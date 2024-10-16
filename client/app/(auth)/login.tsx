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
} from "react-native";
import { useRouter } from "expo-router";
import {auth} from "../../firebase"
import { signInWithEmailAndPassword } from "firebase/auth";

const LoginPage = () => {
  const router = useRouter();
  const [isFocusedEmail, setIsFocusedEmail] = useState(false);
  const [isFocusedPassword, setIsFocusedPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassWord] = useState("");
  const [error, setError] = useState("TESTING")

  const dismissKeyboard = () => {
    Keyboard.dismiss();
    setIsFocusedEmail(false);
    setIsFocusedPassword(false);
  };

  const handleSubmit = async () => {
    if (email.length === 0 || password.length === 0) {
			alert('Please fill out all fields.');
			return;
		}
		try {
      console.log('Trying to sign in')
      await signInWithEmailAndPassword(auth, email, password)
      setError("HERE")
      const idToken = await auth.currentUser?.getIdToken();
      router.replace("/(tabs)/home")
    } catch(error) {
      if (error instanceof Error) {
        setError(error.message)
      }
      else {
        setError("An unknown error occured")
      }
    }
  }

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <View style={styles.container}>
        {/* <SafeAreaView style={styles.container}> */}
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.content}>
            <Text style={styles.title}>Login</Text>
            <Text style={styles.subtitle}>Welcome back to Reuse Vandy!</Text>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>EMAIL</Text>
              <TextInput
                style={styles.input}
                placeholder={isFocusedEmail ? "" : "hello@reallygreatsite.com"}
                placeholderTextColor="#999"
                onFocus={() => setIsFocusedEmail(true)}
                onBlur={() => setIsFocusedEmail(false)}
                onChangeText={newText => setEmail(newText)}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>PASSWORD</Text>
              <TextInput
                style={styles.input}
                placeholder={isFocusedPassword ? "" : "********"}
                placeholderTextColor="#999"
                // value={dob}
                // onChangeText={setDob}
                onChangeText={newText => setPassWord(newText)}
                onFocus={() => setIsFocusedPassword(true)}
                onBlur={() => setIsFocusedPassword(false)}
              />
            </View>
            <TouchableOpacity
              style={styles.button}
              activeOpacity={0.7}
              onPress={() => handleSubmit()}
            >
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
            <Text>{error}</Text>
          </View>
        </ScrollView>
      </View>
      {/* </SafeAreaView> */}
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

export default LoginPage;
