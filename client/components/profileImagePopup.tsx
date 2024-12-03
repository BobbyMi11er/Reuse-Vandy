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
import { getUserById, updateUser } from "@/utils/interfaces/userInterface";
import { useEffect, useRef, useState } from "react";
import { UserType } from "@/utils/models/userModel";
import { PostType } from "@/utils/models/postModel";
import { deletePost } from "@/utils/interfaces/postInterface";
import ImageUploadComponent from "./imageUpload";
import { updateCurrentUser } from "firebase/auth";

interface PopupProps {
  modalVisible: boolean;
  setModalVisible: (value: boolean) => void;
  userData: UserType;
  userId: string;
}

const ProfileImagePopup: React.FC<PopupProps> = ({
  modalVisible,
  setModalVisible,
  userData,
  userId,
}) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageSelected, setImageSelected] = useState<boolean>(false);

  const handleImageUpload = (url: string | null) => {
    if (!url) {
      alert("Image upload failed. Please try again.");
      return;
    }
    // console.log("here")
    setImageUrl(url); // Set the uploaded image URL
  };

  const onImageChoice = (url: string | null) => {
    setImageSelected(url !== null);
    // console.log("HERE")
    // console.log(url !== null)
  };

  const hideModal = (exit: boolean) => {
    if (exit) {
      setImageSelected(false);
    }
    setModalVisible(false);
  };

  const saveImage = async () => {
    if (!imageSelected) {
      alert("Must select an image");
      return;
    } else {
      let uploadedImageUrl = imageUrl; // Initialize with the current imageUrl (if any)
      // console.log(uploadedImageUrl)
      if (imageUploadRef.current) {
        let res = await imageUploadRef.current.uploadImage();
        if (res != null) {
          uploadedImageUrl = res;
        } else {
          alert("Image upload failed. Please try again.");
          return;
        }
        setImageUrl(uploadedImageUrl); // Update the state with the new URL

        try {
          const token = await getToken();

          let editedUser = userData;
          editedUser.profile_img_url = uploadedImageUrl;

          await updateUser(token!, userId, editedUser);
          alert("Profile Image updated!");
        } catch (error) {
          alert("Failed to update profile image. Please try again");
        }
      }
    }
    setModalVisible(!modalVisible);
  };

  const imageUploadRef = useRef<{
    pickImage: () => void;
    uploadImage: () => Promise<string | null>;
  } | null>(null);

  return (
    <Modal
      testID="modal"
      animationType="fade"
      visible={modalVisible}
      transparent={true}
      onRequestClose={() => {
        Alert.alert("Modal has been closed.");
        setModalVisible(!modalVisible);
      }}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <View>
            <ImageUploadComponent
              ref={imageUploadRef}
              onImageUpload={handleImageUpload}
              onImageChoice={onImageChoice}
            />
          </View>
          <View style={styles.buttonsView}>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => hideModal(true)}
            >
              <Text style={styles.textStyle}>Exit</Text>
            </Pressable>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => saveImage()}
            >
              <Text style={styles.textStyle}>Save</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
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
  buttonsView: {
    flexDirection: "row",
    justifyContent: "space-between",
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

export default ProfileImagePopup;
