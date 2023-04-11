import { User } from '@/types/User';

export interface Comment {
  id: number;
  author: User;
  text: string;
  numberOfUpvotes: number;
  numberOfDownvotes: number;
  createdAt: string;
  updatedAt: string;
}
