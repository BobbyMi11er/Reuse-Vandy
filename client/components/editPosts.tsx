import React, { useEffect, useRef, useState } from "react";
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
  Modal,
  Alert,
} from "react-native";
import { auth } from "../firebase";
import { fetchPostById, updatePost } from "../utils/interfaces/postInterface";
import { PostType } from "../utils/models/postModel";
import { authStyles } from "../app/(auth)/auth_style";

interface EditPostsProps {
  modalVisible: boolean;
  setModalVisible: (value: boolean) => void;
  // SHOULD TAKE FULL POST OBJECT; NEED TO CHANGE CARD TO USE THAT INSTEAD
  postId: number;
}

const EditPostsModal: React.FC<EditPostsProps> = ({
  modalVisible,
  setModalVisible,
  postId,
}) => {
  const [isFocusedName, setIsFocusedName] = useState(false);
  const [isFocusedPrice, setIsFocusedPrice] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState("");
  const [price, setPrice] = useState("");
  const [size, setSize] = useState("");

  const [post, setPost] = useState<PostType>();

  const dismissKeyboard = () => {
    Keyboard.dismiss();
    setIsFocusedName(false);
    setIsFocusedPrice(false);
  };

  const getPostData = async () => {
    const idToken = await auth.currentUser?.getIdToken();
    if (!idToken || !auth.currentUser?.uid) {
      Alert.alert("You must be logged in to edit a post.");
      return;
    }

    let newPost = await fetchPostById(idToken, postId);
    setPost(newPost);
    setTitle(newPost.title);
    setColor(newPost.color);
    setDescription(newPost.description);
    setPrice(newPost.price + "");
    setSize(newPost.size);
  };

  useEffect(() => {
    getPostData();
  }, []);

  const handleSubmit = async () => {
    // Validate required fields
    if (!title || !price) {
      Alert.alert("Please fill out all required fields (title and price)");
      return;
    }

    try {
      const idToken = await auth.currentUser?.getIdToken();
      if (!idToken || !auth.currentUser?.uid) {
        Alert.alert("You must be logged in to edit a post.");
        return;
      }

      let newPost = post;
      if (newPost) {
        newPost.title = title;
        newPost.price = parseFloat(price);
        newPost.description = description;
        newPost.size = size;
        newPost.color = color;
        newPost.updated_at = new Date();
        await updatePost(idToken, newPost.post_id, newPost);
        Alert.alert("Post updated");
      } else {
        console.error("New post is undefined?");
      }
    } catch (error) {
      console.error("Error editting listing", error);
      Alert.alert("Failed to edit post. Please try again.");
    }

    setModalVisible(false);
  };

  return (
    <Modal animationType="fade" visible={modalVisible} transparent={true}>
      <TouchableWithoutFeedback onPress={dismissKeyboard}>
        <KeyboardAvoidingView style={authStyles.container} behavior="padding">
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <View style={authStyles.content}>
              <View style={authStyles.topSection}>
                <Text style={styles.title}>Editing Listing</Text>

                <View style={authStyles.inputContainer}>
                  <Text style={authStyles.label}>Listing Name *</Text>
                  <TextInput
                    style={authStyles.input}
                    placeholder="Listing Item"
                    value={title}
                    onChangeText={setTitle}
                  />
                </View>
                <View style={authStyles.inputContainer}>
                  <Text style={authStyles.label}>Description</Text>
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
                  <Text style={authStyles.buttonText}>Edit Listing</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[authStyles.button, styles.exit_button]}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={authStyles.buttonText}>Exit</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    alignItems: "center",
    backgroundColor: "#F8F8F8",
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#000",
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 10,
  },
  exit_button: {
    backgroundColor: "lightgrey",
  },
});

export default EditPostsModal;
