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
  Button,
  KeyboardAvoidingView,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { auth } from "../../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { authStyles } from "./auth_style";

const LoginPage = () => {
  const router = useRouter();
  const [isFocusedEmail, setIsFocusedEmail] = useState(false);
  const [isFocusedPassword, setIsFocusedPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const dismissKeyboard = () => {
    Keyboard.dismiss();
    setIsFocusedEmail(false);
    setIsFocusedPassword(false);
  };

  const handleSubmit = async () => {
    if (email.length === 0 || password.length === 0) {
      alert("Please fill out all fields.");
      return;
    }
    try {
      console.log("Trying to sign in");
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      const idToken = await auth.currentUser?.getIdToken();

      if (!idToken) {
        throw new Error("Failed to retrieve ID token");
      }

      router.replace("/(tabs)/home");
    } catch (error: any) {
      if (error.code === "auth/invalid-credential") {
        alert("Incorrect login information");
      } else {
        alert("An unknown error occured");
      }
    }
  };

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <KeyboardAvoidingView style={authStyles.container} behavior="padding">
        {/* <SafeAreaView style={styles.container}> */}
        <ScrollView contentContainerStyle={authStyles.scrollContent}>
          <View style={authStyles.content}>
            <View style={authStyles.topSection}>
              <Text style={authStyles.title} testID="login-text">
                Login
              </Text>
              <Text style={authStyles.subtitle}>
                Welcome back to Reuse Vandy!
              </Text>

              <View style={authStyles.inputContainer}>
                <Text style={authStyles.label}>EMAIL</Text>
                <TextInput
                  style={authStyles.input}
                  placeholder={
                    isFocusedEmail ? "" : "hello@reallygreatsite.com"
                  }
                  placeholderTextColor="#999"
                  onFocus={() => setIsFocusedEmail(true)}
                  onBlur={() => setIsFocusedEmail(false)}
                  onChangeText={(newText) => setEmail(newText)}
                />
              </View>

              <View style={authStyles.inputContainer}>
                <Text style={authStyles.label}>PASSWORD</Text>
                <TextInput
                  style={authStyles.input}
                  placeholder={isFocusedPassword ? "" : "********"}
                  placeholderTextColor="#999"
                  onChangeText={(newText) => setPassword(newText)}
                  onFocus={() => setIsFocusedPassword(true)}
                  onBlur={() => setIsFocusedPassword(false)}
                  secureTextEntry={true}
                />
              </View>
            </View>
            <View style={authStyles.bottomSection}>
              <TouchableOpacity
                style={authStyles.button}
                activeOpacity={0.7}
                onPress={() => handleSubmit()}
              >
                <Text style={authStyles.buttonText} testID="login-button">
                  Login
                </Text>
              </TouchableOpacity>
              <Text style={authStyles.errorText}>{error}</Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      {/* </SafeAreaView> */}
    </TouchableWithoutFeedback>
  );
};

export default LoginPage;
