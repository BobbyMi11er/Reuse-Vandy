import React, { useState } from "react";
import {
  View,
  Image,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageSourcePropType,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import SellerPopup from "./SellerPopup";
import DeletePopup from "./DeletePopup";
import { auth, getToken } from "../firebase";
import { deletePost } from "@/utils/interfaces/postInterface";
import { addLike, deleteLike } from "@/utils/interfaces/likesInterface";

interface CardProps {
  post_id: number;
  title: string;
  price: number;
  size: string;
  image_url: string;
  description: string;
  created_at: Date;
  user_firebase_id: string;
  page: string;
  onDelete?: (postId: number) => void;
}

const Card: React.FC<CardProps> = ({
  post_id,
  title,
  price,
  size,
  image_url,
  description,
  created_at,
  user_firebase_id,
  page,
  onDelete,
}) => {
  const createdAtDate = new Date(created_at);

  const [liked, setLiked] = React.useState(false)

  const handleLike = async () => {
    const token = await getToken();
    const currUser = auth.currentUser?.uid;

    if (currUser === undefined) {
      Alert.alert("Not signed in")
    }
    else {
      if (liked) {
        // dislike the post (aka delete like)
        try {
          await deleteLike(token!, {
            user_firebase_id: currUser,
            post_id: post_id
          })
          setLiked(false)
        } catch (error) {
          Alert.alert(error + "")
        }
      }
      else {
        // like the post
        try {
          await addLike(token!, {
            user_firebase_id: currUser,
            post_id: post_id
          })
          setLiked(true)

        } catch(error) {
          Alert.alert(error + "")
        }
      }
    }
  }

  const handleDelete = async () => {
    try {
      const token = await getToken();
      await deletePost(token!, post_id);

      // Call the onDelete callback to update parent state
      if (onDelete) {
        onDelete(post_id);
      }

      Alert.alert("Post Deleted");
      setModalVisible(false);
    } catch (error) {
      console.error("Error deleting post:", error);
      Alert.alert("Failed to delete post. Please try again.");
    }
  };

  // image_url not in image storage
  if (
    image_url.length < 19 ||
    image_url.substring(0, 19) != "https://reuse-vandy"
  ) {
    image_url =
      "https://reuse-vandy.s3.us-east-2.amazonaws.com/adaptive-icon.png";
  }

  const [modalVisible, setModalVisible] = useState(false);

  return (
    <TouchableOpacity
      testID="card-touchable"
      style={styles.card}
      activeOpacity={0.7}
      onPress={() => setModalVisible(true)}
    >
      <Image
        testID="image"
        source={{ uri: image_url }}
        style={styles.image}
      />
      <View style={styles.infoContainer}>
        <Text testID="card-title" style={styles.title}>
          {title}
        </Text>
        <Text testID="card-price" style={styles.price}>
          ${price}
        </Text>
        <Text testID="card-time" style={styles.time}>
          {createdAtDate.toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </Text>
      </View>
      {page == "marketplace" ? (
        <SellerPopup
          testID="seller-popup"
          description={description}
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
          userId={user_firebase_id}
        />
      ) : (
        <DeletePopup
          testID="delete-popup"
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
          postId={post_id}
        />
      )}

      {page !== "marketplace" && (
        <TouchableOpacity
          testID="delete-icon"
          style={styles.deleteIcon}
          onPress={handleDelete}
        >
          <Ionicons name="close-circle" size={24} color="red" />
        </TouchableOpacity>
      )}


      <TouchableOpacity testID="heart-icon" style={styles.heartIcon} onPress={handleLike}>
        {liked ? 
          <Ionicons name="heart" size={24} color="white" /> : 
          <Ionicons name="heart-outline" size={24} color="white" />
        }
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: "48%",
    marginBottom: 10,
    backgroundColor: "#f0ebe0",
    borderRadius: 10,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: 150,
  },
  infoContainer: {
    padding: 10,
  },
  title: {
    fontWeight: "bold",
    marginBottom: 5,
  },
  price: {
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
  },
  size: {
    color: "#FFF",
  },
  time: {
    position: "absolute",
    bottom: 5,
    right: 5,
    fontSize: 12,
    color: "#666",
  },
  heartIcon: {
    position: "absolute",
    bottom: 60,
    right: 5,
  },
  deleteIcon: {
    position: "absolute",
    top: 5,
    right: 5,
    zIndex: 1,
  },
});

export default Card;
