import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { ICloudProvider } from "../cloud.interface";
import { S3_BUCKET_NAME } from "../../../config";

interface S3Config {
  region: string;
  credentials: { secretAccessKey: string; accessKeyId: string };
}

export class S3CloudProvider implements ICloudProvider {
  private client: S3Client;

  constructor(config: S3Config) {
    this.client = new S3Client({
      region: config.region,
      credentials: config.credentials,
    });
  }

  async uploadFile(file: Express.Multer.File, path: string): Promise<string> {
    let command = new PutObjectCommand({
      Bucket: S3_BUCKET_NAME,
      Key: `social-app/${path}/${Date.now()}_${file.originalname}`,
      ACL: "public-read",
      ContentType: file.mimetype,
      Body: file.buffer,
    });
    await this.client.send(command);

    return command.input.Key as string;
  }

  async getFile(key: string): Promise<NodeJS.ReadableStream | undefined> {
    let command = new GetObjectCommand({
      Key: key,
      Bucket: S3_BUCKET_NAME,
    });
    const { Body } = await this.client.send(command);

    return Body as unknown as NodeJS.ReadStream;
  }

  async deleteFile(key: string): Promise<boolean> {
    let command = new DeleteObjectCommand({
      Key: key,
      Bucket: S3_BUCKET_NAME,
    });
    const { DeleteMarker } = await this.client.send(command);

    return DeleteMarker as boolean;
  }
}
