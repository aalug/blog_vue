export interface PostImage {
  id?: number | string;
  title: string;
  image: string | File | Blob;
  post?: number; // post ID
}
