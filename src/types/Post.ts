import { User } from './User';
import { Tag } from './Tag';
import { Comment } from './Comment';

export interface Post {
  id: number;
  title: string;
  slug: string;
  author: User;
  description: string;
  body: string;
  tags: Tag[];
  coverImage: string;
  numberOfComments: string;
  comments: Comment[];
  createdAt: string;
  updatedAt: string;
}

