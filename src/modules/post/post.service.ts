import { Types } from "mongoose";
import { CreatePostDTO } from "./post.dto";
import { PostRepository } from "../../DB/models/post/post.repository";
import { NotFoundException, ON_MODEL } from "../../common";
import { ReactionRepository } from "../../DB/models/reaction/reaction.repository";

export class PostService {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly reactRepository: ReactionRepository
  ) {}

  async create(createPostDTO: CreatePostDTO, userId: Types.ObjectId) {
    return await this.postRepository.create({ ...createPostDTO, userId });
  }
}

export default new PostService(new PostRepository(), new ReactionRepository());
