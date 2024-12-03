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
  Alert,
} from "react-native";
import Card from "@/components/Card";
import { Ionicons } from "@expo/vector-icons";
import { getUserById, updateUser } from "@/utils/interfaces/userInterface";
import {
  fetchPostById,
  fetchPostByUserId,
} from "@/utils/interfaces/postInterface";
import { useState, useEffect } from "react";
import { UserType } from "@/utils/models/userModel";
import { PostType } from "@/utils/models/postModel";
import { useNavigation } from "@react-navigation/native";
import Notifications from "@/components/notificationsModal";
import { auth, getToken, getUserId } from "../../firebase";
import { router } from "expo-router";
import ProfileImagePopup from "@/components/profileImagePopup";
import { getLikesByUser } from "@/utils/interfaces/likesInterface";

const AccountPage = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [userData, setUserData] = useState<UserType | null>(null);

  const [userPosts, setUserPosts] = useState<PostType[]>([]);
  const [likedPosts, setLikedPosts] = useState<PostType[]>([]);
  const [likeChanged, setLikeChanged] = useState(false);

  const navigation = useNavigation();
  const [isFocused, setIsFocused] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");

  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    if (userData) {
      setEditedUser(userData);
      // image_url not in image storage
      let image_url = userData.profile_img_url;
      if (
        !image_url ||
        (image_url &&
          (image_url.length < 19 ||
            image_url.substring(0, 19) != "https://reuse-vandy"))
      ) {
        image_url =
          "https://reuse-vandy.s3.us-east-2.amazonaws.com/profile-placeholder.png";
      }
      setImageUrl(image_url);
    }
  }, [userData]);

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
        const likedPostIds = await getLikesByUser(token!, userId!);

        const likedPosts = [];
        for (const like of likedPostIds) {
          const res = await fetchPostById(token!, like.post_id);
          likedPosts.push(res);
        }

        setLikeChanged(false);
        setUserData(userData);
        setUserPosts(userPosts);
        setLikedPosts(likedPosts);
      } catch (error) {
        console.error("Error:", error);
      }
    };
    if (isFocused) {
      fetchUserData();
    }
  }, [isFocused, likeChanged]);

  const handleSignOut = async () => {
    await auth.signOut();
    router.replace("/(auth)/landing");
  };

  const handleUpdateAccount = async () => {
    if (!editedUser || !userId) return;

    try {
      setLoading(true);
      const token = await getToken();

      var failedCheck = false;

      const phoneNumber = editedUser.phone_number;

      if (phoneNumber.length != 10) {
        Alert.alert("Phone number must be 10 characters long");
        failedCheck = true;
      }
      const digits_only = (string: string) =>
        [...string].every((c) => "0123456789".includes(c));
      if (!digits_only(phoneNumber)) {
        Alert.alert("Phone number should only contain numbers");
        failedCheck = true;
      }

      if (!failedCheck) {
        // Call the updateUser function
        await updateUser(token!, userId, editedUser);

        // Update the local state with new data
        setUserData(editedUser);
        setIsEditing(false);

        Alert.alert("Your account has been updated successfully!");
      }
    } catch (error) {
      console.error("Error updating account:", error);
      Alert.alert("Failed to update account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const renderInput = (
    label: string,
    value: string,
    field: keyof UserType,
    placeholder: string
  ) => (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, isEditing && styles.editableInput]}
        value={value}
        onChangeText={(text) =>
          setEditedUser((prev) => (prev ? { ...prev, [field]: text } : null))
        }
        editable={isEditing}
        placeholder={placeholder}
      />
    </View>
  );

  const handlePostDelete = (deletedPostId: number) => {
    setUserPosts((prevPosts) =>
      prevPosts.filter((post) => post.post_id !== deletedPostId)
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Account</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <ProfileImagePopup
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
          userId={userId!}
          userData={userData!}
        />
        <View style={styles.content}>
          <View style={styles.profileImageContainer}>
            {imageUrl == "" ? (
              <Image
                source={require("@/assets/images/profile-placeholder.png")}
                style={styles.profileImage}
              />
            ) : (
              <Image source={{ uri: imageUrl }} style={styles.profileImage} />
            )}

            <TouchableOpacity
              style={styles.editButton}
              onPress={() => {
                setModalVisible(true);
              }}
            >
              <Ionicons name="pencil" size={16} color="white" />
            </TouchableOpacity>
          </View>
          <Text style={styles.name}>
            {userData ? userData.name : "Error Loading Name"}
          </Text>
          {renderInput(
            "NAME",
            editedUser?.name || "",
            "name",
            "Enter your name"
          )}

          <View style={styles.inputContainer}>
            <Text style={styles.label}>{"EMAIL"}</Text>
            <Text style={styles.input}>{editedUser?.email || ""}</Text>
          </View>

          {renderInput(
            "PHONE NUMBER",
            editedUser?.phone_number || "",
            "phone_number",
            "Enter your phone number"
          )}

          {renderInput(
            "PRONOUNS",
            editedUser?.pronouns || "",
            "pronouns",
            "Enter your pronouns"
          )}

          {isEditing ? (
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.saveButton]}
                onPress={handleUpdateAccount}
                disabled={loading}
              >
                <Text style={styles.buttonText}>
                  {loading ? "Updating..." : "Save Changes"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => {
                  setIsEditing(false);
                  setEditedUser(userData);
                }}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.button}
              onPress={() => setIsEditing(true)}
            >
              <Text style={styles.buttonText}>Edit Profile Information</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={styles.sign_out_button}
            activeOpacity={0.7}
            onPress={() => handleSignOut()}
          >
            <Text style={styles.buttonText}>Sign Out</Text>
          </TouchableOpacity>
        </View>
        <ScrollView style={{ width: "100%" }}>
          <Text style={styles.name}>My Posts</Text>
          <View style={styles.cardContainer}>
            {userPosts.map((item) => (
              <Card
                key={item.post_id}
                {...item}
                page="account"
                onDelete={handlePostDelete}
              />
            ))}
          </View>
        </ScrollView>
        {likedPosts.length > 0 ? (
          <ScrollView style={{ width: "100%" }}>
            <Text style={styles.name}>Liked Posts</Text>
            <View style={styles.cardContainer}>
              {likedPosts.map((item) => (
                <Card
                  key={item.post_id}
                  {...item}
                  page="marketplace"
                  setLikeChanged={setLikeChanged}
                />
              ))}
            </View>
          </ScrollView>
        ) : (
          <View />
        )}
      </ScrollView>
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
    borderRadius: 50,
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
  editableInput: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  buttonContainer: {
    width: "100%",
    gap: 10,
  },
  saveButton: {
    backgroundColor: "#F4A71D",
  },
  cancelButton: {
    backgroundColor: "#ddd",
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    alignSelf: "center",
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
    backgroundColor: "#F4A71D",
    paddingVertical: 15,
    width: "100%",
    alignItems: "center",
    borderRadius: 5,
    marginBottom: 10,
  },
  sign_out_button: {
    borderColor: "#F4A71D",
    borderWidth: 2,
    paddingVertical: 15,
    width: "100%",
    alignItems: "center",
    borderRadius: 5,
    marginBottom: 10,
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
