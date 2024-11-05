import React, { useState } from "react";
import {
  View,
  Image,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageSourcePropType,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import SellerPopup from "./SellerPopup";
import DeletePopup from "./DeletePopup";

interface CardProps {
  post_id: number;
  title: string;
  price: number;
  size: string;
  image_url: string;
  created_at: Date;
  user_firebase_id: string;
  page: string;
}

const Card: React.FC<CardProps> = ({
  post_id,
  title,
  price,
  size,
  image_url,
  created_at,
  user_firebase_id,
  page,
}) => {
  // image_url not in image storage
  if (image_url.length < 19 || image_url.substring(0, 19) != "https://reuse-vandy") {
    image_url = "https://reuse-vandy.s3.us-east-2.amazonaws.com/adaptive-icon.png"
  }

  const [modalVisible, setModalVisible] = useState(false)

  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.7} onPress={() => setModalVisible(true)}>
      <Image
        source={{uri: image_url}}
        style={styles.image}
      />
      <View style={styles.infoContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.price}>${price}</Text>
        <Text style={styles.size}>{size}</Text>
        {/* <Text style={styles.time}>{created_at.toLocaleString()}</Text> */}
      </View>
      {page == "marketplace" ? 
        <SellerPopup modalVisible={modalVisible} setModalVisible={setModalVisible} userId={user_firebase_id}/>
        : <DeletePopup modalVisible={modalVisible} setModalVisible={setModalVisible} postId={post_id} />
      }
       
      <TouchableOpacity style={styles.heartIcon}>
        <Ionicons name="heart-outline" size={24} color="white" />
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
});

export default Card;
