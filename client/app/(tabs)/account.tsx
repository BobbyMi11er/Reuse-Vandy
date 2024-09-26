import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";

const AccountPage = () => {
  const router = useRouter();
  const [isFocusedName, setIsFocusedName] = useState(false);
  const [isFocusedEmail, setIsFocusedEmail] = useState(false);
  const [isFocusedPhoneNumber, setIsFocusedPhoneNumber] = useState(false);
  const [isFocusedPassword, setIsFocusedPassword] = useState(false);

  const dismissKeyboard = () => {
    Keyboard.dismiss();
    setIsFocusedName(false);
    setIsFocusedEmail(false);
    setIsFocusedPhoneNumber(false);
    setIsFocusedPassword(false);
  };

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.title}>Account Information</Text>
        </ScrollView>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0)",
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8F8F8",
    paddingVertical: 70,
  },
  content: {
    width: "80%",
    alignItems: "center",
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
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
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
  },
});

export default AccountPage;
