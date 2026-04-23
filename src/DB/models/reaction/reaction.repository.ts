import { IReaction } from "../../../common";
import { AbstractRepository } from "../../abstract.repository";
import { Reaction } from "./reaction.model";

export class ReactionRepository extends AbstractRepository<IReaction> {
  constructor() {
    super(Reaction);
  }
}
