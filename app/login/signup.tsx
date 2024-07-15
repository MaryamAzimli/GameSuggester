import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  Button,
  Text,
  TouchableOpacity,
  Platform,
} from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { useNavigation } from "expo-router";
import LottieView from "lottie-react-native";

const Signup = () => {
  const navigation = useNavigation();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = () => {
    console.log("Username:", username);
    console.log("Email:", email);
    console.log("Password:", password);
  };

  useEffect(() => {
    navigation.setOptions({
      //headerTitle: "Login",
      //headerLeft: () => null, // this hides the back button
      headerShown: false,
    });
  }, [navigation]);

  return (
    <ThemedView style={styles.container}>
      {Platform.OS !== "web" && (
        <LottieView
          source={require("@/assets/animations/train.json")}
          autoPlay
          loop
          style={styles.animation}
        />
      )}
      <View style={styles.blurContainer}>
        <ThemedText type="title" style={styles.subtitle}>
          Are you ready to embark on a new journey?
        </ThemedText>
        <View style={styles.box}>
          <ThemedText type="title" style={styles.title}>
            Signup
          </ThemedText>
          <TextInput
            style={styles.input}
            placeholder="Username"
            placeholderTextColor="#aaa"
            value={username}
            onChangeText={setUsername}
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#aaa"
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#aaa"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          <Button title="Signup" onPress={handleSignup} color={"#0F4C75"} />
          <TouchableOpacity onPress={() => navigation.navigate("login/login")}>
            <Text style={styles.link}>Already have an account? Login!</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ThemedView>
  );
};

export default Signup;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#121212",
    paddingVertical: 0,
  },
  blurContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
  animation: {
    position: "absolute",
    width: "125%",
    height: "125%",
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 20,
    color: "#ffffff",
    textAlign: "center",
  },
  box: {
    width: "90%",
    padding: 20,
    borderRadius: 10,
    backgroundColor: "rgba(255, 255, 255, 0.4)",
    borderColor: "rgba(255, 255, 255, 0.4)",
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    color: "#ffffff",
  },
  input: {
    width: "100%",
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
    color: "black",
    backgroundColor: "white",
  },
  link: {
    marginTop: 15,
    color: "#0F4C75",
    textAlign: "center",
    fontWeight: "bold",
  },
});
