import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  Button,
  Text,
  TouchableOpacity,
} from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { useNavigation } from "expo-router";

const Login = () => {
  const navigation = useNavigation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    navigation.setOptions({
      headerTitle: "Login",
      headerLeft: () => null, // this hides the back button
      // headerShown: false, // this hides the header
    });
  }, [navigation]);

  const handleLogin = () => {
    console.log("Username:", username);
    console.log("Password:", password);
  };

  return (
    <ThemedView style={styles.container}>
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
        <TouchableOpacity
          onPress={() => navigation.navigate("forgot-password")}
        >
          <Text style={styles.passLink}>Forgot your password?</Text>
        </TouchableOpacity>
      </View>
      <Button title="Login" onPress={handleLogin} />
      <TouchableOpacity onPress={() => navigation.navigate("signup")}>
        <Text style={styles.link}>Don't have an account? Signup!</Text>
      </TouchableOpacity>
    </ThemedView>
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
