import { User } from './User';

export enum VoteType {
  UPVOTE = 'upvote',
  DOWNVOTE = 'downvote'
}

export interface Vote {
  id: number;
  user: User;
  comment: number; // comment ID
  voteType: VoteType;
}

