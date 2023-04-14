import { User } from '@/types/User';
import { VoteType } from '@/types/Vote';

export interface Comment {
  id: number;
  author: User;
  text: string;
  numberOfUpvotes: number;
  numberOfDownvotes: number;
  createdAt: string;
  updatedAt: string;
  hasVoted: VoteType | null;
}
