import { Types } from "mongoose";
import { AddReactionDTO } from "../dto";
import { BadRequestException, NotFoundException } from "../utils";
import { ON_MODEL } from "../enums";
import { ReactionRepository } from "../../DB/models/reaction/reaction.repository";
import { PostRepository } from "../../DB/models/post/post.repository";
import { CommentRepository } from "../../DB/models/comment/comment.repository";
import { FirebasePushNotificationProvider } from "../notification/firebase/firebase.service";

function toModel(collectionName: string) {
  switch (collectionName) {
    case "posts":
      return ON_MODEL.Post;

    case "comments":
      return ON_MODEL.Comment;

    default:
      throw new BadRequestException("Invalid collection");
  }
}

export const addReaction = async (
  addReactionDTO: AddReactionDTO,
  userId: Types.ObjectId,
  repo: PostRepository | CommentRepository
) => {
  const docExist = await repo.getOne({ _id: addReactionDTO.id });
  if (!docExist) throw new NotFoundException(`${repo.model.modelName} not found`);

  const collectionName = docExist.collection.name;
  const reactionRepository = new ReactionRepository();

  const userReaction = await reactionRepository.getOne({
    onModel: toModel(collectionName),
    refId: addReactionDTO.id,
    userId,
  });
  // no reaction => create new one
  if (!userReaction) {
    await reactionRepository.create({
      onModel: toModel(collectionName),
      refId: addReactionDTO.id,
      userId,
      reaction: addReactionDTO.reaction,
    });
    await repo.updateOne({ _id: addReactionDTO.id }, { $inc: { reactionsCount: 1 } });

    return;
  }

  // same reaction => delete it
  if (userReaction.reaction == addReactionDTO.reaction) {
    await reactionRepository.deleteOne({ _id: userReaction._id });
    await repo.updateOne({ _id: addReactionDTO.id }, { $inc: { reactionsCount: -1 } });
    return;
  }

  // different reaction => update it
  await reactionRepository.updateOne({ _id: userReaction._id }, { reaction: addReactionDTO.reaction });
  return;
};
