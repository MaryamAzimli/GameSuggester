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
import * as Clipboard from 'expo-clipboard';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

const Signup = () => {
  const navigation = useNavigation();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordStrength, setPasswordStrength] = useState("");
  const [suggestedPassword, setSuggestedPassword] = useState("");

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

  const calculatePasswordStrength = (password) => {
    let strength = "Weak";
    if (password.length >= 8 && /[a-z]/.test(password) && /[A-Z]/.test(password) && /\d/.test(password) && /\W/.test(password)) {
      strength = "Strong";
    } else if (password.length >= 6 && /[a-z]/.test(password) && /[A-Z]/.test(password) && /\d/.test(password)) {
      strength = "Medium";
    }
    setPasswordStrength(strength);
  };

  const suggestPassword = () => {
    const lowercase = "abcdefghijklmnopqrstuvwxyz";
    const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const numbers = "0123456789";
    const specialCharacters = "!@#$%^&*()_+{}[]|:;<>,.?/~`";
    
    const getRandomCharacter = (characters) => characters.charAt(Math.floor(Math.random() * characters.length));
    
    let randomPassword = [
      getRandomCharacter(lowercase),
      getRandomCharacter(uppercase),
      getRandomCharacter(numbers),
      getRandomCharacter(specialCharacters)
    ];
  
    const allCharacters = lowercase + uppercase + numbers + specialCharacters;
    randomPassword = randomPassword.concat(
      Array.from({ length: 8 }, () => getRandomCharacter(allCharacters))
    );
  
    randomPassword = randomPassword.sort(() => Math.random() - 0.5).join('');
  
    setSuggestedPassword(randomPassword);
  };

  const copyToClipboard = () => {
    Clipboard.setString(suggestedPassword);
  };

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
            onChangeText={(text) => {
              setPassword(text);
              calculatePasswordStrength(text);
            }}
          />
          <View style={styles.linkContainer}>
            <TouchableOpacity onPress={suggestPassword}>
              <Text style={styles.suggestionLink}>Suggest a Password</Text>
            </TouchableOpacity>
            {suggestedPassword ? (
                <View style={styles.suggestedPasswordContainer}>
                  <Text style={styles.suggestedPassword}>{suggestedPassword}</Text>
                  <TouchableOpacity onPress={copyToClipboard} style={styles.copyButton}>                    
                    <FontAwesome6 name="copy" size={14} color="black" />
                  </TouchableOpacity>
                </View>
              ) : null}
            {password ? (
              <Text style={styles.passwordStrength}>Password Strength: {passwordStrength}</Text>
            ) : null}
          </View>

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
  linkContainer: {
    marginTop: -10,
    width: "80%",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  link: {
    marginTop: 15,
    color: "#0F4C75",
    textAlign: "center",
    fontWeight: "bold",
  },
  passwordStrength: {
    color: "#ffffff",
    marginTop: 10,
  },
  suggestionLink: {
    color: "#0F4C75",
    textAlign: "left",
    fontWeight: "bold",
    marginTop: 10,
  },
  suggestedPassword: {
    color: "#ffffff",
    fontStyle: "italic",
  },
  suggestedPasswordContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    textAlign: 'center',
    marginTop: 5,
  },
  copyButton: {
    marginLeft: 10,
  },
});
