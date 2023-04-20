export interface PostImage {
  title: string;
  image: string | File | Blob;
  post?: number; // post ID
}
