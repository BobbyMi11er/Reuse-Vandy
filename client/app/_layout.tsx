import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useRef, useState } from "react";
import { Animated, View, StyleSheet, Text } from "react-native";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/useColorScheme";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });
  const [isAppReady, setIsAppReady] = useState(false);

  const fadeAnim = useRef(new Animated.Value(1)).current; // Initial opacity: 1 (fully visible)

  useEffect(() => {
    if (loaded) {
      setTimeout(() => {
        Animated.timing(fadeAnim, {
          toValue: 0, // Fade out to opacity 0
          duration: 500, // Duration of the animation (in milliseconds)
          useNativeDriver: true,
        }).start(() => {
          setIsAppReady(true); // Set app as ready after fade-out animation
          SplashScreen.hideAsync(); // Hide splash screen after animation
        });
      }, 500); // Optional delay before fade-out starts
    }
  }, [loaded]);

  if (!loaded || !isAppReady) {
    return (
      <View style={styles.container}>
        <Animated.View style={[styles.splashScreen, { opacity: fadeAnim }]}>
        <Text style={styles.splashText}>Welcome to MyApp</Text> {/* Added text here */}
        </Animated.View>
      </View>
    );
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  splashScreen: {
    ...StyleSheet.absoluteFillObject, // This will fill the screen with the splash screen view
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff", // You can set this to match your splash screen background color
  },
  splashText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#333", // You can customize the text color
  },
});
