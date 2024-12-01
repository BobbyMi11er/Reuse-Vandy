import {
  Modal,
  View,
  Text,
  Alert,
  Pressable,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import { auth, getToken, getUserId } from "../firebase";
import { getUserById } from "@/utils/interfaces/userInterface";
import { useEffect, useState } from "react";
import { UserType } from "@/utils/models/userModel";
import { PostType } from "@/utils/models/postModel";
import { deletePost } from "@/utils/interfaces/postInterface";
import EditPostsModal from "./editPosts";

interface PopupProps {
  testID?: string;
  modalVisible: boolean;
  setModalVisible: (value: boolean) => void;
  postId: number;
}

const DeletePopup: React.FC<PopupProps> = ({
  modalVisible,
  setModalVisible,
  postId,
}) => {
  const [editModalVisible, setEditModalVisible] = useState(false)
  
  const handleDelete = async () => {
    try {
      const token = await getToken();
      await deletePost(token!, postId);
      setModalVisible(false); // Ensure this line is executed
      Alert.alert("Post Deleted");
    } catch (error) {
      console.error(error);
    }
  };

    const handleEditPosts = () => {
      setEditModalVisible(true)
    }
  return (
    <Modal
      testID="delete-popup-modal"
      animationType="fade"
      visible={modalVisible}
      transparent={true}
      onRequestClose={() => {
        Alert.alert("Modal has been closed.");
        setModalVisible(!modalVisible);
      }}
    >
      <View style={styles.overlay}>
        <EditPostsModal modalVisible={editModalVisible} setModalVisible={setEditModalVisible} postId={postId}/>
        <View style={styles.modalView}>
          <View>
            <Text style={styles.title}>Do you want to change this post?</Text>
            <Pressable style={[styles.button, styles.edit_button]}>
              <Text>Edit Post</Text>
            </Pressable>
            <Pressable
              style={[styles.button, styles.delete_button]}
              onPress={() => handleDelete()}
            >
              <Text>Delete Post</Text>
            </Pressable>
          </View>
          <Pressable
            style={[styles.button, styles.buttonClose]}
            onPress={() => setModalVisible(!modalVisible)}
          >
            <Text style={styles.textStyle}>Exit</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent gray background
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginTop: 10,
    alignItems: "center",
  },
  delete_button: {
    backgroundColor: "#ef4444",
  },
  edit_button: {
    backgroundColor: "#fdba74",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
    paddingHorizontal: 25,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  text: {
    fontSize: 14,
  },
  underline: {
    textDecorationLine: "underline",
  },
});

export default DeletePopup;
