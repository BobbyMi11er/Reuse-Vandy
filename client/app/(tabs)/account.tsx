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
import { getUserById } from "@/utils/interfaces/userInterface";
import { fetchPostByUserId } from "@/utils/interfaces/postInterface";
import { useState, useEffect } from "react";
import { UserType } from "@/utils/models/userModel";
import { PostType } from "@/utils/models/postModel";
import { useNavigation } from "@react-navigation/native";
import Notifications from "@/components/notificationsModal";
import { auth, getToken, getUserId } from "../../firebase";
import { router } from "expo-router";

const AccountPage = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [userData, setUserData] = useState<UserType | null>(null);
  const [notificationsModalVisible, setNotificationsVisible] = useState(false);
  const [userPosts, setUserPosts] = useState<PostType[]>([]);
  const navigation = useNavigation();
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    const checkFocus = () => {
      setIsFocused(navigation.isFocused());
    };
    checkFocus();
    navigation.addListener("focus", checkFocus);
    navigation.addListener("blur", checkFocus);
    return () => {
      navigation.removeListener("focus", checkFocus);
      navigation.removeListener("blur", checkFocus);
    };
  }, [navigation]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = getUserId();
        setUserId(userId);
        const token = await getToken();
        const userData = await getUserById(token!, userId!);
        const userPosts = await fetchPostByUserId(token!, userId!);
        setUserData(userData);
        setUserPosts(userPosts);
      } catch (error) {
        console.error("Error:", error);
      }
    };
    if (isFocused) {
      fetchUserData();
    }
  }, [isFocused]);

  const handleSignOut = async () => {
    console.log("here")
    await auth.signOut()
    router.replace("/(auth)/landing")
  }

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
          <TouchableOpacity style={styles.sign_out_button} activeOpacity={0.7} onPress={() => handleSignOut()}>
            <Text style={styles.buttonText}>Sign Out</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.name}>
            My Posts
          </Text>
        <View style={styles.cardContainer}>
          {userPosts.map((item) => (
            <Card key={item.post_id} {...item} page="account" />
          ))}
        </View>
      </ScrollView>
      <Notifications
        modalVisible={notificationsModalVisible}
        setModalVisible={setNotificationsVisible}
      />
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
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
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
  sign_out_button: {
    marginTop: 20,
    backgroundColor: "grey",
    paddingVertical: 8,
    width: "50%",
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
