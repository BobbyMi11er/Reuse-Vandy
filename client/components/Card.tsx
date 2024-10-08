import React from "react";
import {
  View,
  Image,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageSourcePropType,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface CardProps {
  title: string;
  price: number;
  size: string;
  time: string;
  image: ImageSourcePropType;
  boosted: boolean;
}

const Card: React.FC<CardProps> = ({
  image,
  title,
  price,
  size,
  time,
  boosted,
}) => {
  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.7}>
      <Image source={image} style={styles.image} />
      {boosted && (
        <View style={styles.boostedLabel}>
          <Text style={styles.boostedText}>Boosted</Text>
        </View>
      )}
      <TouchableOpacity style={styles.heartIcon}>
        <Ionicons name="heart-outline" size={24} color="white" />
      </TouchableOpacity>
      <View style={styles.infoContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.price}>${price}</Text>
        <Text style={styles.size}>{size}</Text>
        <Text style={styles.time}>{time}</Text>
      </View>
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
  boostedLabel: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "white",
    padding: 2,
    borderRadius: 3,
    overflow: "hidden",
  },
  boostedText: {
    fontSize: 12,
  },
  heartIcon: {
    position: "absolute",
    bottom: 60,
    right: 5,
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
    color: "#666",
  },
  time: {
    position: "absolute",
    bottom: 5,
    right: 5,
    fontSize: 12,
    color: "#666",
  },
});

export default Card;
