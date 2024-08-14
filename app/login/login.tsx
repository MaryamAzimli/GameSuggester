import React, { useEffect, useState } from "react";
import { StyleSheet, View, TextInput, Button, Text, TouchableOpacity } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { useNavigation } from "expo-router";
import LottieView from "lottie-react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants'; // Import Constants

const { BASE_URL } = Constants.expoConfig?.extra || {}; // Access BASE_URL from app.json


const Login = () => {
  const navigation = useNavigation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  const handleLogin = async () => {
    if (username.trim() === "" || password.trim() === "") {
      alert("Please enter both username and password.");
      return;
    }
  
    try {
      const response = await fetch(`${BASE_URL}/api/auth/login`, { // Use BASE_URL from app.json
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });
  
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || `HTTP error! Status: ${response.status}`);
      }
  
      const data = await response.json();
      console.log("Login successful:", data);
      await AsyncStorage.setItem('token', data.token);
      await AsyncStorage.setItem('user', JSON.stringify(data.user));
      alert("Login successful");
      navigation.navigate("home");
    } catch (error) {
      console.error("Error during login:", error);
      alert("Login failed: " + error.message);
    }
  };

  const platform = () => {
    if(Platform.OS === "android" || Platform.OS === "ios"){
      return(
        <ThemedView style={styles.container}>
          <LottieView
            source={require("@/assets/animations/train.json")}
            autoPlay
            loop
            style={styles.animation}
          />

              <ThemedText type="title" style={styles.title}>
                Login
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
                placeholder="Password"
                placeholderTextColor="#aaa"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
              <View style={styles.linkContainer}>
                <TouchableOpacity onPress={() => navigation.navigate("forgotPass")}>
                  <Text style={styles.passLink}>Forgot your password?</Text>
                </TouchableOpacity>
              </View>

              <Button title="Login" onPress={handleLogin} />
              <TouchableOpacity onPress={() => navigation.navigate("login/signup")}>
                <Text style={styles.link}>Don't have an account? Signup!</Text>
              </TouchableOpacity>

        </ThemedView>
      );
    } else if(Platform.OS === "web"){
      return (
        <ThemedView style={styles.container}>
          <ThemedText type="title" style={styles.title}>
            Login
          </ThemedText>
          <View style={styles.animationContainer}>
            <LottieView
              source={require("@/assets/animations/suggestSimilar.json")}
              autoPlay
              loop
            />
          </View>
          <TextInput
            style={styles.input}
            placeholder="Username"
            placeholderTextColor="#aaa"
            value={username}
            onChangeText={setUsername}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#aaa"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          <View style={styles.linkContainer}>
            <TouchableOpacity onPress={() => navigation.navigate("forgotPass")}>
              <Text style={styles.passLink}>Forgot your password?</Text>
            </TouchableOpacity>
          </View>
          <Button title="Login" onPress={handleLogin} />
          <TouchableOpacity onPress={() => navigation.navigate("login/signup")}>
            <Text style={styles.link}>Don't have an account? Signup!</Text>
          </TouchableOpacity>
        </ThemedView>
      );
    }
  };
  
  
  return (
    platform()
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#121212",
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    color: "#ffffff",
  },
  animationContainer: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  input: {
    width: "80%",
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
    color: "#ffffff",
    backgroundColor: "#2a2a2a",
  },
  linkContainer: {
    marginTop: -10,
    width: "80%",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  passLink: {
    color: "#1e90ff",
    textAlign: "left",
  },
  link: {
    marginTop: 15,
    color: "#1e90ff",
    textAlign: "center",
  },
});
