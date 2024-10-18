export interface UserType {
    user_firebase_id: string; // Primary key, uniquely identifies the user (Firebase ID)
    name: string; // Name of the user
    pronouns: string; // User's pronouns
    email: string; // User's email
    phone_number: string; // User's phone number
    profile_img_url: string; // URL to the user's profile image
}
