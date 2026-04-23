import { Types } from "mongoose";
import { CreateCommentDTO } from "./comment.dto";
import { PostRepository } from "./../../DB/models/post/post.repository";
import { NotFoundException } from "../../common";
import { CommentRepository } from "../../DB/models/comment/comment.repository";

class CommentService {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly commentRepository: CommentRepository
  ) {}

  async create(createCommentDTO: CreateCommentDTO, params: any, userId: Types.ObjectId) {
    const postExist = await this.postRepository.getOne({ _id: params.postId });
    if (!postExist) throw new NotFoundException("Post Not Found.");

    if (params.parentId) {
      const parentCommentExist = await this.commentRepository.getOne({ _id: params.parentId });
      if (!parentCommentExist) throw new NotFoundException("Comment Not Found");
    }

    return await this.commentRepository.create({ ...createCommentDTO, ...params, userId });
  }

  async getAll(params: any) {
    const comments = await this.commentRepository.getAll({ postId: params.postId, parentId: params.parentId });
    if (comments.length === 0) throw new NotFoundException("No Comments.");
    return comments;
  }
}

export default new CommentService(new PostRepository(), new CommentRepository());
