import React from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import Card from "@/components/Card";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getUserById } from "@/utils/interfaces/userInterface";
import { useState, useEffect } from "react";
import { UserType } from "@/utils/models/userModel";
import { router } from "expo-router";
import Notifications from "@/components/notificationsModal";

const marketplaceData = [
  {
    id: 1,
    image: require("@/assets/images/adaptive-icon.png"),
    title: "JOHN PORK",
    price: 9999,
    size: "XXS",
    time: "2 MIN AGO",
    boosted: true,
  },
  {
    id: 2,
    image: require("@/assets/images/adaptive-icon.png"),
    title: "JOHN PORK",
    price: 9999,
    size: "XXS",
    time: "2 MIN AGO",
    boosted: true,
  },
  {
    id: 3,
    image: require("@/assets/images/adaptive-icon.png"),
    title: "JOHN PORK",
    price: 9999,
    size: "XXS",
    time: "2 MIN AGO",
    boosted: true,
  },
  {
    id: 4,
    image: require("@/assets/images/adaptive-icon.png"),
    title: "JOHN PORK",
    price: 9999,
    size: "XXS",
    time: "2 MIN AGO",
    boosted: true,
  },
  {
    id: 5,
    image: require("@/assets/images/adaptive-icon.png"),
    title: "JOHN PORK",
    price: 9999,
    size: "XXS",
    time: "2 MIN AGO",
    boosted: true,
  },
  {
    id: 6,
    image: require("@/assets/images/adaptive-icon.png"),
    title: "JOHN PORK",
    price: 9999,
    size: "XXS",
    time: "2 MIN AGO",
    boosted: true,
  },
  {
    id: 7,
    image: require("@/assets/images/adaptive-icon.png"),
    title: "JOHN PORK",
    price: 9999,
    size: "XXS",
    time: "2 MIN AGO",
    boosted: true,
  },
  {
    id: 8,
    image: require("@/assets/images/adaptive-icon.png"),
    title: "JOHN PORK",
    price: 9999,
    size: "XXS",
    time: "2 MIN AGO",
    boosted: true,
  },
  {
    id: 9,
    image: require("@/assets/images/adaptive-icon.png"),
    title: "JOHN PORK",
    price: 9999,
    size: "XXS",
    time: "2 MIN AGO",
    boosted: true,
  },
  {
    id: 10,
    image: require("@/assets/images/adaptive-icon.png"),
    title: "JOHN PORK",
    price: 9999,
    size: "XXS",
    time: "2 MIN AGO",
    boosted: true,
  },
  // Add more items as needed
];

const AccountPage = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [userData, setUserData] = useState<UserType | null>(null);
  const [userPosts, setUserPosts] = useState([]);
  const [notificationsModalVisible, setNotificationsVisible] = useState(false)

  const getUserId = async () => {
    try {
      return await AsyncStorage.getItem("user_id");
    } catch (error) {
      console.log("Error retrieving token:", error);
      throw error;
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = await getUserId();
        setUserId(userId);
        const token = await AsyncStorage.getItem("token");
        const userData = await getUserById(token!, userId!);
        setUserData(userData);
      } catch (error) {
        console.error("Error:", error);
      }
    };
    fetchUserData();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Account</Text>
        <TouchableOpacity onPress={() => setNotificationsVisible(true)}>
          <Ionicons name="notifications-outline" size={24} color="black" />
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <View style={styles.profileImageContainer}>
            <Image
              source={require("@/assets/images/profile-placeholder.png")}
              style={styles.profileImage}
            />
            <TouchableOpacity style={styles.editButton}>
              <Ionicons name="pencil" size={16} color="white" />
            </TouchableOpacity>
          </View>
          <Text style={styles.name}>
            {userData ? userData.name : "Error Loading Name"}
          </Text>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>EMAIL</Text>
            <TextInput
              style={styles.input}
              value={userData ? userData.email : "Error Loading Email"}
              editable={false}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>PHONE NUMBER</Text>
            <TextInput
              style={styles.input}
              value={
                userData ? userData.phone_number : "Error Loading Phone Number"
              }
              editable={false}
            />
          </View>
          <TouchableOpacity style={styles.button} activeOpacity={0.7}>
            <Text style={styles.buttonText}>Update Account</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.cardContainer}>
          {marketplaceData.map((item) => (
            <Card key={item.id} {...item} />
          ))}
        </View>
      </ScrollView>
      <Notifications modalVisible={notificationsModalVisible} setModalVisible={setNotificationsVisible} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8F8",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },

  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 10,
  },

  scrollContent: {
    flexGrow: 1,
    alignItems: "center",
  },

  content: {
    flex: 1,
    width: "90%",
    alignItems: "center",
    padding: 20,
  },
  profileImageContainer: {
    width: 100,
    height: 100,
    borderRadius: 15,
    overflow: "hidden",
    marginBottom: 20,
  },
  profileImage: {
    width: "100%",
    height: "100%",
  },
  editButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "purple",
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },

  inputContainer: {
    width: "100%",
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    color: "#666",
    marginBottom: 5,
  },
  input: {
    width: "100%",
    padding: 10,
    backgroundColor: "#EDEDED",
    borderRadius: 5,
    color: "#000",
  },
  button: {
    marginTop: 20,
    backgroundColor: "#F4A71D",
    paddingVertical: 15,
    width: "100%",
    alignItems: "center",
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },

  cardContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    padding: 10,
  },
});

export default AccountPage;
