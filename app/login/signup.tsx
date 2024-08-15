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
import Constants from 'expo-constants'; // Import Constants

const { BASE_URL } = Constants.expoConfig?.extra || {}; // Access BASE_URL from app.json


const Signup = () => {
  const navigation = useNavigation();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordStrength, setPasswordStrength] = useState("");
  const [suggestedPassword, setSuggestedPassword] = useState("");

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  const handleSignup = async () => {
    if (username.trim() === "" || email.trim() === "" || password.trim() === "") {
      alert("Please fill in all fields.");
      return;
    }
  
    try {
      const response = await fetch(`${BASE_URL}/api/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password, mail: email }),  // Ensure the email is passed as mail
      });
  
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Signup failed');
      }
  
      const data = await response.json();
      console.log("Signup successful:", data);
      alert("Signup successful");
      navigation.navigate("index");
    } catch (error) {
      console.error("Error during signup:", error);
      alert("Signup failed: " + error.message);
    }
  };
  
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
              Are you ready to embark on a new journey?
            </ThemedText>
            <View style={styles.box}>
              <ThemedText type="title" style={styles.title}>
                Signup
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
                placeholder="Email"
                placeholderTextColor="#aaa"
                value={email}
                onChangeText={setEmail}
              />
              <TextInput
                style={styles.mobileInput}
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
                  <Text style={styles.suggestionLink}>Suggest a Password!</Text>
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
    } else if(Platform.OS === "web"){
      return (
        <ThemedView style={styles.container}>
          <ThemedText type="title" style={styles.title}>
            Signup
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
            placeholder="Email"
            placeholderTextColor="#aaa"
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            style={styles.webInput}
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
              <Text style={styles.suggestionLink}>Suggest a Password!</Text>
            </TouchableOpacity>
            {suggestedPassword ? (
              <View style={styles.suggestedPasswordContainer}>
                <Text style={styles.suggestedPassword}>{suggestedPassword}</Text>
                <TouchableOpacity onPress={copyToClipboard} style={styles.copyButton}>                    
                  <FontAwesome6 name="copy" size={14} color="white" />
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
        </ThemedView>
      );
    }
  };

  return (
    platform()
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
  },
  passwordStrength: {
    color: "#ffffff",
    marginTop: 10,
  },
  suggestionLink: {
    color: "#0F4C75",
    textAlign: "left",
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
  animationContainer: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
});