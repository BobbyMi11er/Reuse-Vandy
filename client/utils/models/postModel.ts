export interface PostType {
  post_id: number; // Unique identifier for the post
  user_firebase_id: string; // Firebase ID of the user who created the post
  title: string; // Title of the post
  description: string; // Description of the item being posted
  color: string; // Color of the item
  image_url: string; // URL of the image for the post
  price: number; // Price of the item (e.g., 49.99)
  size: string; // Size of the item (e.g., '10', 'M', 'L', etc.)
  created_at: Date; // Timestamp of when the post was created
  updated_at: Date; // Timestamp of when the post was last updated
}
