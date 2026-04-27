import { Types } from "mongoose";
import { CreateCommentDTO } from "./comment.dto";
import { PostRepository } from "./../../DB/models/post/post.repository";
import { BadRequestException, IPost, NotFoundException, UnAuthorizedException } from "../../common";
import { CommentRepository } from "../../DB/models/comment/comment.repository";

class CommentService {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly commentRepository: CommentRepository
  ) {}

  async create(createCommentDTO: CreateCommentDTO, params: any, userId: Types.ObjectId) {
    const postExist = await this.postRepository.getOne({ _id: params.postId });
    if (!postExist) throw new NotFoundException("Post Not Found.");

    if (params.postId) {
      const postExist = await this.postRepository.getOne({ _id: params.postId });
      if (!postExist) throw new BadRequestException("Post Not Found.");
    }

    let parentCommentExist = undefined;
    if (params.parentId) {
      parentCommentExist = await this.commentRepository.getOne({ _id: params.parentId });
      if (!parentCommentExist) throw new NotFoundException("Comment Not Found");
    }

    return await this.commentRepository.create({
      ...createCommentDTO,
      ...params,
      userId,
      postId: params.postId || parentCommentExist?.postId,
    });
  }

  async getAll(params: any) {
    const comments = await this.commentRepository.getAll({
      postId: params.postId,
      parentId: params.parentId,
    });
    if (comments.length === 0) throw new NotFoundException("No Comments.");
    return comments;
  }

  async delete(id: Types.ObjectId, userId: Types.ObjectId) {
    const commentExist = await this.commentRepository.getOne({ _id: id }, {}, { populate: [{ path: "postId" }] });
    if (!commentExist) throw new NotFoundException("Comment not Found.");

    let commentAuthor = commentExist.userId.toString();
    let postAuthor = (commentExist.postId as IPost[])[0]?.userId.toString();

    if (![postAuthor, commentAuthor].includes(userId.toString()))
      throw new UnAuthorizedException("You are not authorized to delete this comment!");

    await this.commentRepository.deleteOne({ _id: id });
  }
}

export default new CommentService(new PostRepository(), new CommentRepository());
