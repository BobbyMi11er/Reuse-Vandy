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

const RegistrationPage = () => {
  const router = useRouter();
  const [isFocusedName, setIsFocusedName] = useState(false);
  const [isFocusedEmail, setIsFocusedEmail] = useState(false);
  const [isFocusedYear, setIsFocusedYear] = useState(false);
  const [isFocusedDOB, setIsFocusedDOB] = useState(false);

  const dismissKeyboard = () => {
    Keyboard.dismiss();
    setIsFocusedName(false);
    setIsFocusedEmail(false);
    setIsFocusedYear(false);
    setIsFocusedDOB(false);
  };

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <View style={styles.container}>
        {/* <SafeAreaView style={styles.container}> */}
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.content}>
            <Text style={styles.title}>Create New Account</Text>
            <Text style={styles.subtitle}>Welcome to Reuse Vandy!</Text>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>NAME</Text>
              <TextInput
                style={styles.input}
                placeholder={isFocusedName ? "" : "Jiara Martins"}
                placeholderTextColor="#999"
                onFocus={() => setIsFocusedName(true)}
                onBlur={() => setIsFocusedName(false)}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>EMAIL</Text>
              <TextInput
                style={styles.input}
                placeholder={isFocusedEmail ? "" : "hello@reallygreatsite.com"}
                placeholderTextColor="#999"
                onFocus={() => setIsFocusedEmail(true)}
                onBlur={() => setIsFocusedEmail(false)}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>YEAR</Text>
              <TextInput
                style={styles.input}
                placeholder={isFocusedYear ? "" : "2026"}
                placeholderTextColor="#999"
                // value={year}
                // onChangeText={setYear}
                onFocus={() => setIsFocusedYear(true)}
                onBlur={() => setIsFocusedYear(false)}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>DATE OF BIRTH</Text>
              <TextInput
                style={styles.input}
                placeholder={isFocusedDOB ? "" : "MM/DD/YYYY"}
                placeholderTextColor="#999"
                // value={dob}
                // onChangeText={setDob}
                onFocus={() => setIsFocusedDOB(true)}
                onBlur={() => setIsFocusedDOB(false)}
              />
            </View>

            <TouchableOpacity
              style={styles.button}
              activeOpacity={0.7}
              onPress={() => router.navigate("/(tabs)/home")}
            >
              <Text style={styles.buttonText}>Sign up</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
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
    fontSize: 24,
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
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
});

export default RegistrationPage;
