import { User } from './User'
import {Tag} from './Tag'


export interface Post {
  id: number;
  title: string;
  slug: string;
  author: User;
  description: string;
  tags: Tag[];
  coverImage: string;
  numberOfComments: string;
  createdAt: string;
  updatedAt: string;
}

