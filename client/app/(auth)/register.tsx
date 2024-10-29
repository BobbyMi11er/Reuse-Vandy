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
  KeyboardAvoidingView,
} from "react-native";
import { useRouter } from "expo-router";
import { createUserWithEmailAndPassword, UserCredential } from "firebase/auth";
import { auth } from "../../firebase";
import { createUser } from "../../utils/interfaces/userInterface";
import { UserType } from "../../utils/models/userModel";
import { authStyles } from "./auth_style";

const RegistrationPage = () => {
  const router = useRouter();
  const [isFocusedName, setIsFocusedName] = useState(false);
  const [isFocusedEmail, setIsFocusedEmail] = useState(false);
  const [isFocusedPhoneNumber, setIsFocusedPhoneNumber] = useState(false);
  const [isFocusedPassword, setIsFocusedPassword] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const dismissKeyboard = () => {
    Keyboard.dismiss();
    setIsFocusedName(false);
    setIsFocusedEmail(false);
    setIsFocusedPhoneNumber(false);
    setIsFocusedPassword(false);
  };

  const handleSubmit = async () => {
    console.log("Submitting");
    if (email.length === 0 || password.length === 0) {
      alert("Please fill out all fields.");
      return;
    }

    try {
      const { user } = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const idToken = await auth.currentUser?.getIdToken();

      if (!idToken) {
        throw new Error("Failed to retrieve ID token");
      }

      const userData: UserType = {
        user_firebase_id: user.uid,
        email: email,
        name: name,
        phone_number: phoneNumber,
        pronouns: "",
        profile_img_url: "",
      };

      createUser(idToken!, userData);

      router.navigate("/login");
    } catch (error: any) {
      alert("Failed to create user.");
    }
  };

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <KeyboardAvoidingView style={authStyles.container} behavior="padding">
        {/* <SafeAreaView style={styles.container}> */}
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={authStyles.content}>
            <View style={authStyles.topSection}>
              <Text style={authStyles.title}>Create New Account</Text>
              <Text style={authStyles.subtitle}>Welcome to Reuse Vandy!</Text>

              <View style={authStyles.inputContainer}>
                <Text style={authStyles.label}>NAME</Text>
                <TextInput
                  style={authStyles.input}
                  placeholder={isFocusedName ? "" : "Jiara Martins"}
                  placeholderTextColor="#999"
                  onFocus={() => setIsFocusedName(true)}
                  onBlur={() => setIsFocusedName(false)}
                  onChangeText={(text) => setName(text)}
                />
              </View>

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
                  onChangeText={(text) => setEmail(text)}
                />
              </View>

              <View style={authStyles.inputContainer}>
                <Text style={authStyles.label}>PHONE NUMBER</Text>
                <TextInput
                  style={authStyles.input}
                  placeholder={isFocusedPhoneNumber ? "" : "123-456-7890"}
                  placeholderTextColor="#999"
                  onFocus={() => setIsFocusedPhoneNumber(true)}
                  onBlur={() => setIsFocusedPhoneNumber(false)}
                  onChangeText={(text) => setPhoneNumber(text)}
                />
              </View>

              <View style={authStyles.inputContainer}>
                <Text style={authStyles.label}>PASSWORD</Text>
                <TextInput
                  style={authStyles.input}
                  placeholder={isFocusedPassword ? "" : "********"}
                  placeholderTextColor="#999"
                  onFocus={() => setIsFocusedPassword(true)}
                  onBlur={() => setIsFocusedPassword(false)}
                  onChangeText={(text) => setPassword(text)}
                  value={password}
                  secureTextEntry={!showPassword}
                />
              </View>
            </View>
            <View style={authStyles.bottomSection}>
              <TouchableOpacity
                style={authStyles.button}
                activeOpacity={0.7}
                onPress={() => handleSubmit()}
              >
                <Text style={authStyles.buttonText}>Sign up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      {/* </SafeAreaView> */}
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 900,
    backgroundColor: "rgba(255, 255, 255, 0)",
  },
  scrollContent: {
    flexGrow: 1,
    // justifyContent: "center",
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

export default RegistrationPage;
