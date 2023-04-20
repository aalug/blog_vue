import { User } from './User';
import { Tag } from './Tag';
import { Comment } from './Comment';
import { PostImage } from '@/types/PostImage';

export interface Post {
  id: number;
  title: string;
  slug: string;
  author: User;
  description: string;
  body: string;
  tags: Tag[];
  coverImage: string | File | Blob | null;
  numberOfComments: string;
  comments: Comment[];
  images: PostImage[];
  createdAt: string;
  updatedAt: string;
}

