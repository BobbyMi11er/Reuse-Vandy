export interface PostType {
    post_id: number; // Primary key for the post
    user_firebase_id: string; // Reference to the user who created the post
    title: string; // Title of the post
    description: string; // Description of the post
    color: string; // Color attribute of the item in the post
    image_url: string; // URL to an image of the item
    created_at: Date; // Timestamp of when the post was created
    updated_at: Date; // Timestamp of the last update to the post
}
