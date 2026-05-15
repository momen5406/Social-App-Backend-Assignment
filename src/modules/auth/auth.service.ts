import { ConflictException, encrypt, hash, generateOTP, NotFoundException, BadRequestException } from "../../common";
import { IMailProvider } from "../../common/email/mail.interface";
import { nodemailerProvider } from "../../common/email/nodemailer/init";
import { userRepository, UserRepository } from "../../DB/models/user/user.repository";
import { deleteFromCache, getFromCache, setIntoCache } from "../../DB/redis.service";
import { ResetPasswordDTO, LoginDTO, SignupDTO, VerifyAccountDTO } from "./auth.dto";

class AuthService {
  constructor(
    private userRepository: UserRepository,
    private mailProvider: IMailProvider
  ) {}

  async signup(signupDTO: SignupDTO) {
    const { email } = signupDTO;
    const isUserExist = await this.userRepository.getOne({ email });

    if (isUserExist) throw new ConflictException("User already exist");

    signupDTO.password = await hash(signupDTO.password);

    if (signupDTO.phone) signupDTO.phone = encrypt(signupDTO.phone);

    const otp = generateOTP();

    await this.mailProvider.send(signupDTO.email, "Confirm Email", `<p>You OTP to verify your account is ${otp}</p>`);

    await setIntoCache(`${signupDTO.email}:otp`, otp, 3 * 60);

    await setIntoCache(signupDTO.email, JSON.stringify(signupDTO), 60 * 60 * 24 * 3);
  }

  async verifyAccount(verifyAccountDTO: VerifyAccountDTO) {
    const userData = await getFromCache(verifyAccountDTO.email);
    if (!userData) throw new NotFoundException("User not found");

    const otp = await getFromCache(`${verifyAccountDTO.email}:otp`);
    if (!otp) throw new BadRequestException("OTP expired!");

    if (otp != verifyAccountDTO.otp) throw new BadRequestException("Invalid OTP!");

    await this.userRepository.create(JSON.parse(userData));
    await deleteFromCache(`${verifyAccountDTO.email}:otp`);
    await deleteFromCache(`${verifyAccountDTO.email}`);
  }

  async resendOTP(email: string) {
    const isUserExist = await this.userRepository.getOne({ email });

    const isUserExistInCache = await getFromCache(email);

    if (!isUserExist && !isUserExistInCache) throw new NotFoundException("User not found, please signup.");

    const isOtpExist = await getFromCache(`${email}:otp`);
    if (isOtpExist) throw new BadRequestException("Already have a valid otp!");

    const otp = generateOTP();
    await this.mailProvider.send(email, "Re-send OTP", `<p>Your new otp is ${otp}</p>`);

    await setIntoCache(`${email}:otp`, otp, 3 * 60);
  }

  async resetPassword(resetPasswordDTO: ResetPasswordDTO) {
    const userExist = await this.userRepository.getOne({ email: resetPasswordDTO.email });
    if (!userExist) throw new NotFoundException("User not found.");

    const otp = await getFromCache(`${resetPasswordDTO.email}:otp`);
    if (otp != resetPasswordDTO.otp) throw new BadRequestException("Invalid OTP!");

    resetPasswordDTO.newPassword = await hash(resetPasswordDTO.newPassword);

    await this.userRepository.updateOne({ email: resetPasswordDTO.email }, { password: resetPasswordDTO.newPassword });
  }

  login(loginDTO: LoginDTO) {}
}

export default new AuthService(userRepository, nodemailerProvider);
