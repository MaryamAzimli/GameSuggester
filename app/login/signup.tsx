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
  const [signupSuccess, setSignupSuccess] = useState(false);
  const [otp, setOtp] = useState(""); 
  const [verificationError, setVerificationError] = useState("");
  const [otpSent, setOtpSent] = useState(false); 
  const [usernameError, setUsernameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");


  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleUsernameChange = async (text) => {
    setUsername(text);
    setUsernameError(""); // Reset error
  
    if (text.length > 0) {
      try {
        const response = await fetch(`${BASE_URL}/api/auth/check-username`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username: text }),
        });
  
        const data = await response.json(); // Parse the JSON response
  
        if (!response.ok) {
          const errorMessage = data.message;
          const suggestedUsername = data.suggestedUsername || "";
          setUsernameError(`${errorMessage} ${suggestedUsername}`);
        } else {
          setUsernameError(""); // Clear any existing error if username is available
        }
      } catch (error) {
        console.error("Error checking username:", error);
        setUsernameError("An error occurred while checking the username.");
      }
    }
  };

  const handleEmailChange = (text) => {
    setEmail(text);
    setEmailError(validateEmail(text) ? "" : "Invalid email format.");
  };

  const handlePasswordChange = (text) => {
    setPassword(text);
    setPasswordError("");
    calculatePasswordStrength(text);
  };

  const calculatePasswordStrength = (password) => {
    let strength = "Weak";
    if (password.length >= 8 && /[a-z]/.test(password) && /[A-Z]/.test(password) && /\d/.test(password) && /\W/.test(password)) {
      strength = "Strong";
    } else if (password.length >= 6 && /[a-z]/.test(password) && /[A-Z]/.test(password) && /\d/.test(password)) {
      strength = "Medium";
    }
    setPasswordStrength(strength);
    setPasswordError(strength === "Strong" ? "" : "Password strength is not strong enough.");
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

  const handleSignup = async () => {
    setUsernameError("");
    setEmailError("");
    setPasswordError("");

    if (username.trim() === "" || email.trim() === "" || password.trim() === "") {
      alert("Please fill in all fields.");
      return;
    }

    if (usernameError || emailError || passwordError) {
      alert("Please fix the errors before submitting.");
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

      const data = await response.json();
  
      if (!response.ok) {
        const data = await response.json();
        if (data.message.startsWith("Username is taken")) {
          setUsernameError(data.message);
        } else {
          throw new Error(data.error || 'Signup failed');
        }
      } else {
          setSignupSuccess(true);
          setOtpSent(true);
          console.log("Signup successful:", data);
      }
    } catch (error) {
      console.error("Error during signup:", error);
      alert(`Signup failed: ${error.message}`);
    }
  };

  const handleVerifyOtp = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/auth/verify-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, otp }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'OTP verification failed');
      }

      const data = await response.json();
      console.log("OTP verified successfully:", data);
      navigation.navigate("profilePage", { username }); // Navigate to the profile page with the username
    } catch (error) {
      console.error("Error during OTP verification:", error);
      setVerificationError("OTP verification failed. Please try again.");
    }
  };

  const handleResendOtp = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/auth/resend-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password, mail: email }), 
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to resend OTP');
      }

      const data = await response.json();
      console.log("OTP resent successfully:", data);
    } catch (error) {
      console.error("Error resending OTP:", error);
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
              Are you ready to embark on a new journey?
            </ThemedText>
            <View style={styles.box}>
              <ThemedText type="title" style={styles.title}>
                Signup
              </ThemedText>
               
              <TextInput
                style={[styles.mobileInput, signupSuccess && styles.disabledInput]}
                placeholder="Username"
                placeholderTextColor="#aaa"
                value={username}
                onChangeText={handleUsernameChange}
                editable={!signupSuccess}
              />
               {usernameError ? (
                <Text style={styles.errorText}>{usernameError}</Text>
              ) : null}

              <TextInput
                style={[styles.mobileInput, signupSuccess && styles.disabledInput]}
                placeholder="Email"
                placeholderTextColor="#aaa"
                value={email}
                onChangeText={handleEmailChange}
                editable={!signupSuccess}
              />
            {emailError ? (
                <Text style={styles.errorText}>{emailError}</Text>
              ) : null}

              <TextInput
                style={[styles.mobileInput, signupSuccess && styles.disabledInput]}
                placeholder="Password"
                placeholderTextColor="#aaa"
                secureTextEntry
                value={password}
                onChangeText={handlePasswordChange}
                onSubmitEditing={(e) => e.preventDefault()}
                blurOnSubmit={false} 
                editable={!signupSuccess}
              />
              <View style={styles.linkContainer}>
                <TouchableOpacity onPress={suggestPassword}>
                  <Text style={styles.suggestionLink}>Suggest a Password!</Text>
                </TouchableOpacity>
                {password ? (
                <Text style={[styles.passwordStrength, (passwordStrength === "Weak" || passwordStrength === "Medium") && styles.weakOrMediumPassword]}>
                  Password Strength: {passwordStrength}
                </Text>
              ) : null}
                {suggestedPassword ? (
                  <View style={styles.suggestedPasswordContainer}>
                    <Text style={styles.suggestedPassword}>{suggestedPassword}</Text>
                    <TouchableOpacity onPress={copyToClipboard} style={styles.copyButton}>                    
                      <FontAwesome6 name="copy" size={14} color="black" />
                    </TouchableOpacity>
                  </View>
                ) : null}
              </View>
              
              {signupSuccess ? (
                <>
                  <Text style={styles.verificationText}>
                    Signup successful! Enter the OTP sent to your email. If you don't see it, please check your spam folder.
                  </Text>
                  <TextInput
                    style={styles.mobileInput}
                    placeholder="Enter OTP"
                    placeholderTextColor="#aaa"
                    value={otp}
                    onChangeText={setOtp}
                    keyboardType="default"
                  />
                  <Button title="Verify OTP" onPress={handleVerifyOtp} color={"#0F4C75"} />
                  {verificationError ? (
                    <Text style={styles.verificationError}>{verificationError}</Text>
                  ) : null}
                  {verificationError && (
                    <TouchableOpacity onPress={handleResendOtp}>
                      <Text style={styles.link}>Resend OTP</Text>
                    </TouchableOpacity>
                  )}
                </>
              ) : (
                <Button title="Signup" onPress={handleSignup} color={"#0F4C75"} />
              )}
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
            <Text style={[styles.passwordStrength, (passwordStrength === "Weak" || passwordStrength === "Medium") && styles.weakOrMediumPassword]}>
              Password Strength: {passwordStrength}
            </Text>
          ) : null}
          </View>

          <Button title="Signup" onPress={handleSignup} color={"#0F4C75"} />
          {signupSuccess && (
            <>
              <Text style={styles.verificationText}>
                Signup successful! Enter the OTP sent to your email.
              </Text>
              <TextInput
                style={styles.webInput}
                placeholder="Enter OTP"
                placeholderTextColor="#aaa"
                value={otp}
                onChangeText={setOtp}
              />
              <Button title="Verify OTP" onPress={handleVerifyOtp} color={"#0F4C75"} />
              {verificationError ? (
                <Text style={styles.verificationError}>{verificationError}</Text>
              ) : null}
              <TouchableOpacity onPress={handleResendOtp}>
                <Text style={styles.link}>Resend OTP</Text>
              </TouchableOpacity>
            </>
          )}

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
  weakOrMediumPassword: {
    color: "red", 
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
  verificationText: {
    color: '#FF5722',
    marginTop: 20,
    textAlign: 'center',
  },
  verificationError: {
    color: 'red',
    marginTop: 10,
    textAlign: 'center',
  },
  disabledInput: {
    backgroundColor: "#f0f0f0",
    color: "#888",
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
    textAlign: 'center',
  },
});