import React, { useRef, useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    TouchableWithoutFeedback,
    Keyboard,
    ScrollView,
    KeyboardAvoidingView,
    Button,
} from "react-native";
import { useRouter } from "expo-router";
import { auth } from "../firebase";
import { createPost } from "../utils/interfaces/postInterface";
import { PostType } from "../utils/models/postModel";
import { authStyles } from "../app/(auth)/auth_style";
import ImageUploadComponent from "./imageUpload";

const ListingForm = () => {
    const [isFocusedName, setIsFocusedName] = useState(false);
    const [isFocusedPrice, setIsFocusedPrice] = useState(false);

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [color, setColor] = useState("");
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [price, setPrice] = useState("");
    const [size, setSize] = useState("");

    const imageUploadRef = useRef<{
        pickImage: () => void;
        uploadImage: () => Promise<string | null>;
    } | null>(null);

    const dismissKeyboard = () => {
        Keyboard.dismiss();
        setIsFocusedName(false);
        setIsFocusedPrice(false);
    };

    const handleImageUpload = (url: string | null) => {
        if (!url) {
            alert("Image upload failed. Please try again.");
            return;
        }
        setImageUrl(url); // Set the uploaded image URL
    };

    const handleSubmit = async () => {
        // Validate required fields
        if (!title || !price) {
            alert("Please fill out all required fields (title and price)");
            return;
        }

        // Ensure image is uploaded and get the URL
        let uploadedImageUrl = imageUrl; // Initialize with the current imageUrl (if any)
        // console.log(uploadedImageUrl)
        if (imageUploadRef.current) {
            uploadedImageUrl = await imageUploadRef.current.uploadImage();
            console.log(uploadedImageUrl)
            if (!uploadedImageUrl) {
                alert("Image upload failed. Please try again.");
                return;
            }
            setImageUrl(uploadedImageUrl); // Update the state with the new URL
        }

        try {
            const idToken = await auth.currentUser?.getIdToken();
            if (!idToken || !auth.currentUser?.uid) {
                alert("You must be logged in to create a post.");
                return;
            }

            // Create a new post with the confirmed image URL
            const newPost: PostType = {
                post_id: 0,
                user_firebase_id: auth.currentUser.uid,
                title,
                description,
                color,
                image_url: uploadedImageUrl !== null ? uploadedImageUrl : "", // Use the uploaded image URL
                price: parseFloat(price),
                size,
                created_at: new Date(),
                updated_at: new Date(),
            };

            await createPost(idToken, newPost);
            alert("Listing created successfully!");
        } catch (error) {
            console.error("Error creating post (ListingForm):", error);
            alert("Failed to create listing. Please try again.");
        }
    };

    return (
        <TouchableWithoutFeedback onPress={dismissKeyboard}>
            <KeyboardAvoidingView
                style={authStyles.container}
                behavior="padding"
            >
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <View style={authStyles.content}>
                        <View style={authStyles.topSection}>
                            <View style={authStyles.inputContainer}>
                                <Text style={authStyles.label}>
                                    Listing Name *
                                </Text>
                                <TextInput
                                    style={authStyles.input}
                                    placeholder="Listing Item"
                                    value={title}
                                    onChangeText={setTitle}
                                />
                            </View>
                            <View style={authStyles.inputContainer}>
                                <Text style={authStyles.label}>
                                    Description
                                </Text>
                                <TextInput
                                    style={[authStyles.input, { height: 100 }]}
                                    placeholder="Enter item description"
                                    multiline
                                    value={description}
                                    onChangeText={setDescription}
                                />
                            </View>

                            <View style={authStyles.inputContainer}>
                                <Text style={authStyles.label}>Color</Text>
                                <TextInput
                                    style={authStyles.input}
                                    placeholder="Enter item color"
                                    value={color}
                                    onChangeText={setColor}
                                />
                            </View>

                            <View style={authStyles.inputContainer}>
                                <Text style={authStyles.label}>Image</Text>
                                <ImageUploadComponent
                                    ref={imageUploadRef}
                                    onImageUpload={handleImageUpload}
                                    onImageChoice={() => {}}
                                />
                            </View>

                            <View style={authStyles.inputContainer}>
                                <Text style={authStyles.label}>Price *</Text>
                                <TextInput
                                    style={authStyles.input}
                                    placeholder="$1"
                                    value={price}
                                    onChangeText={setPrice}
                                    keyboardType="numeric"
                                />
                            </View>

                            <View style={authStyles.inputContainer}>
                                <Text style={authStyles.label}>Size</Text>
                                <TextInput
                                    style={authStyles.input}
                                    placeholder="Enter item size"
                                    value={size}
                                    onChangeText={setSize}
                                />
                            </View>
                        </View>

                        <View style={authStyles.bottomSection}>
                            <TouchableOpacity
                                style={authStyles.button}
                                onPress={handleSubmit}
                            >
                                <Text style={authStyles.buttonText}>
                                    Create Listing
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    scrollContent: {
        flexGrow: 1,
        alignItems: "center",
        backgroundColor: "#F8F8F8",
    },
});

export default ListingForm;
