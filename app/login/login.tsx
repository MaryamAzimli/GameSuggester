import React, { useEffect, useState } from "react";
import { StyleSheet, View, TextInput, Button, Text, TouchableOpacity, Platform } from "react-native";
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
      const response = await fetch(`${BASE_URL}/api/auth/login`, {
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
      await AsyncStorage.setItem('userId', data.user.id); // Store the user ID
      await AsyncStorage.setItem('user', JSON.stringify(data.user));
  
      alert("Login successful");
      navigation.navigate("profilePage", { username });
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

          <View style={styles.blurContainer}>
            <ThemedText type="title" style={styles.subtitle}>
              Login and continue your journey...
            </ThemedText>
            <View style={styles.box}>
              <ThemedText type="title" style={styles.title}>
                Login
              </ThemedText>
              <TextInput
                style={styles.mobileInput}
                placeholder="Username"
                placeholderTextColor="#aaa"
                value={username}
                onChangeText={setUsername}
              />
              <TextInput
                style={styles.mobileInput}
                placeholder="Password"
                placeholderTextColor="#aaa"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />    
              <Button  title="Login" onPress={handleLogin} color={"#0F4C75"}/>

              <TouchableOpacity onPress={() => navigation.navigate("login/signup")}>
                <Text style={styles.link}>Don't have an account? Signup!</Text>
              </TouchableOpacity>
            </View>
          </View>
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
            style={styles.webInput}
            placeholder="Username"
            placeholderTextColor="#aaa"
            value={username}
            onChangeText={setUsername}
          />
          <TextInput
            style={styles.webInput}
            placeholder="Password"
            placeholderTextColor="#aaa"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          <Button  title="Login" onPress={handleLogin} color={"#0F4C75"}/>
          
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
  mobileInput: {
    width: "80%",
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
    color: "black",
    backgroundColor: "white",
  },
  webInput: {
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
  link: {
    marginTop: 15,
    color: "#0F4C75",
    textAlign: "center",
  },
  animation: {
    position: "absolute",
    width: "125%",
    height: "125%",
  },
  blurContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
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
});
