import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Card from "@/components/Card"; // Assuming Card component is in the same directory
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

const MarketplacePage = () => {
  const [notificationsModalVisible, setNotificationsVisible] = useState(false)

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
