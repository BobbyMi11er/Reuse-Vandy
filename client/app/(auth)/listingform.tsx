import React, { useState } from "react";
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
} from "react-native";
import { useRouter } from "expo-router";
import { auth } from "../../firebase";
import { createPost } from "../../utils/interfaces/postInterface";
import { PostType } from "../../utils/models/postModel";
import { authStyles } from "./auth_style";

const ListingForm = () => {
  const [isFocusedName, setIsFocusedName] = useState(false);
  const [isFocusedPrice, setIsFocusedPrice] = useState(false);

  // State for all PostType fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [price, setPrice] = useState("");
  const [size, setSize] = useState("");

  const dismissKeyboard = () => {
    Keyboard.dismiss();
    setIsFocusedName(false);
    setIsFocusedPrice(false);
  };

  const handleSubmit = async () => {
    // Validate required fields
    if (!title || !price) {
      alert("Please fill out all required fields.");
      return;
    }

    try {
      // Get the current user's Firebase ID token
      const idToken = await auth.currentUser?.getIdToken();
      if (!idToken || !auth.currentUser?.uid) {
        alert("You must be logged in to create a post.");
        return;
      }

      // Create a new post object following PostType interface
      const newPost: PostType = {
        post_id: 0, // This will be assigned by the backend
        user_firebase_id: auth.currentUser.uid,
        title,
        description,
        color,
        image_url: imageUrl,
        price: parseFloat(price),
        size,
        created_at: new Date(),
        updated_at: new Date(),
      };

      // Call the createPost method
      await createPost(idToken, newPost);

      // Navigate back or show success message
      alert("Listing created successfully!");
    } catch (error) {
      console.error("Error creating post (ListingForm):", error);
      alert("Failed to create listing. Please try again.");
    }
  };

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <KeyboardAvoidingView style={authStyles.container} behavior="padding">
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={authStyles.content}>
            <View style={authStyles.topSection}>
              <View style={authStyles.inputContainer}>
                <Text style={authStyles.label}>Listing Name *</Text>
                <TextInput
                  style={authStyles.input}
                  placeholder={isFocusedName ? "" : "Listing Item"}
                  placeholderTextColor="#999"
                  onFocus={() => setIsFocusedName(true)}
                  onBlur={() => setIsFocusedName(false)}
                  value={title}
                  onChangeText={setTitle}
                />
              </View>

              <View style={authStyles.inputContainer}>
                <Text style={authStyles.label}>Description</Text>
                <TextInput
                  style={[authStyles.input, { height: 100 }]}
                  placeholder="Enter item description"
                  placeholderTextColor="#999"
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
                  placeholderTextColor="#999"
                  value={color}
                  onChangeText={setColor}
                />
              </View>

              <View style={authStyles.inputContainer}>
                <Text style={authStyles.label}>Image URL</Text>
                <TextInput
                  style={authStyles.input}
                  placeholder="Enter image URL"
                  placeholderTextColor="#999"
                  value={imageUrl}
                  onChangeText={setImageUrl}
                />
              </View>

              <View style={authStyles.inputContainer}>
                <Text style={authStyles.label}>Price *</Text>
                <TextInput
                  style={authStyles.input}
                  placeholder={isFocusedPrice ? "" : "$1"}
                  placeholderTextColor="#999"
                  onFocus={() => setIsFocusedPrice(true)}
                  onBlur={() => setIsFocusedPrice(false)}
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
                  placeholderTextColor="#999"
                  value={size}
                  onChangeText={setSize}
                />
              </View>
            </View>

            <View style={authStyles.bottomSection}>
              <TouchableOpacity
                style={authStyles.button}
                activeOpacity={0.7}
                onPress={handleSubmit}
              >
                <Text style={authStyles.buttonText}>Create Listing</Text>
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
