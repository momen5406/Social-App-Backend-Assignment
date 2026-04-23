import { Types } from "mongoose";
import { AddReactionDTO, CreatePostDTO } from "./post.dto";
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

  async addReaction(addReactionDTO: AddReactionDTO, userId: Types.ObjectId) {
    const postExist = await this.postRepository.getOne({ _id: addReactionDTO.postId });
    if (!postExist) throw new NotFoundException("Post not found");

    const userReaction = await this.reactRepository.getOne({
      onModel: ON_MODEL.Post,
      refId: addReactionDTO.postId,
      userId,
    });
    // no reaction => create new one
    if (!userReaction) {
      await this.reactRepository.create({
        onModel: ON_MODEL.Post,
        refId: addReactionDTO.postId,
        userId,
        reaction: addReactionDTO.reaction,
      });
      await this.postRepository.updateOne({ _id: addReactionDTO.postId }, { $inc: { reactionsCount: 1 } });
      return;
    }

    // same reaction => delete it
    if (userReaction.reaction == addReactionDTO.reaction) {
      await this.reactRepository.deleteOne({ _id: userReaction._id });
      await this.postRepository.updateOne({ _id: addReactionDTO.postId }, { $inc: { reactionsCount: -1 } });
      return;
    }

    // different reaction => update it
    await this.reactRepository.updateOne({ _id: userReaction._id }, { reaction: addReactionDTO.reaction });
    return;
  }
}

export default new PostService(new PostRepository(), new ReactionRepository());
