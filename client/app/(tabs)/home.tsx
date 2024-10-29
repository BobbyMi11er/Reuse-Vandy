import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Card from "@/components/Card"; // Assuming Card component is in the same directory
import Notifications from "@/components/notificationsModal";
import { useNavigation } from "@react-navigation/native";
import { PostType } from "@/utils/models/postModel";
import { fetchPosts } from "@/utils/interfaces/postInterface";
import AsyncStorage from "@react-native-async-storage/async-storage";

const MarketplacePage = () => {
  const [notificationsModalVisible, setNotificationsVisible] = useState(false)
  const navigation = useNavigation();
  const [isFocused, setIsFocused] = useState(false);
  const [posts, setPosts] = useState<PostType[]>([]);

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
        const token = await AsyncStorage.getItem("token");
        const posts = await fetchPosts(token!);
        setPosts(posts);
      } catch (error) {
        console.error("Error:", error);
      }
    };
    if (isFocused) {
      fetchUserData();
    }
  }, [isFocused]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Marketplace</Text>
        <TouchableOpacity onPress={() => setNotificationsVisible(true)}>
          <Ionicons name="notifications-outline" size={24} color="black" />
        </TouchableOpacity>

      </View>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.cardContainer}>
          {posts.map((item) => (
            <Card key={item.post_id} {...item} page="marketplace"/>
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
    fontSize: 24,
    fontWeight: "bold",
  },
  scrollContent: {
    flexGrow: 1,
  },
  cardContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    padding: 10,
  },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingVertical: 10,
  },
});

export default MarketplacePage;
