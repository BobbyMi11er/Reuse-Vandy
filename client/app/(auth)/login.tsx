import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { useRouter } from "expo-router";

const LoginPage = () => {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Reuse Vandy</Text>
        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.7}
          onPress={() => router.navigate("/register")}
        >
          <Text style={styles.buttonText}>Sign in via ID</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.footer}>
        Copyright © SWE Group 15 All Rights Reserved
      </Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#F8F8F8",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
  },
  button: {
    marginTop: 20,
    backgroundColor: "#F4A71D",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
  footer: {
    fontSize: 12,
    color: "#888",
    marginBottom: 20,
  },
});

export default LoginPage;
