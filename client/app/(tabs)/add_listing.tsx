import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import ListingForm from "../../components/listingform";

const AddListingPage = () => {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Add Listing</Text>

        <ListingForm></ListingForm>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0)",
  },
  scrollContent: {
    flexGrow: 1,
    backgroundColor: "#F8F8F8",
    paddingVertical: 70,
  },

  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#000",
    paddingHorizontal: 20,
  },
});

export default AddListingPage;
