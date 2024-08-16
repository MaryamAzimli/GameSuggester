import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Switch,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Modal } from "react-native";
import { Button } from "react-native";

const SettingsItem = ({
  title,
  onPress,
  hasSwitch,
  switchValue,
  onSwitchChange,
  icon,
  style,
  textStyle,
}) => (
  <TouchableOpacity onPress={onPress} style={[styles.settingsItem, style]}>
    <Text style={[styles.itemText, textStyle]}>{title}</Text>
    {hasSwitch && (
      <Switch
        value={switchValue}
        onValueChange={onSwitchChange}
        trackColor={{ false: "#767577", true: "#81b0ff" }}
        thumbColor={switchValue ? "#f5dd4b" : "#f4f3f4"}
      />
    )}
    {icon && <View style={styles.iconContainer}>{icon}</View>}
  </TouchableOpacity>
);


const Settings = () => {
  const [pushNotifications, setPushNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const navigation = useNavigation();
  const handleLogout = async () => {
    try {
      // Clear stored user data
      await AsyncStorage.removeItem('user');
      
      // Navigate to login screen
      navigation.navigate('login/login');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };
  
  const [privacyModalVisible, setPrivacyModalVisible] = useState(false);
  const [contactModalVisible, setContactModalVisible] = useState(false);
  const [userMessage, setUserMessage] = useState("");
  const [aboutModalVisible, setAboutModalVisible] = useState(false);
  const [usernameModalVisible, setUsernameModalVisible] = useState(false);
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [emailModalVisible, setEmailModalVisible] = useState(false);

  const [currentUsername, setCurrentUsername] = useState("current_username");
  const [newUsername, setNewUsername] = useState("");

  const [currentPassword, setCurrentPassword] = useState("current_password");
  const [newPassword, setNewPassword] = useState("");

  const [currentEmail, setCurrentEmail] = useState("current_email@example.com");
  const [newEmail, setNewEmail] = useState("");

  return (
    <ThemedView style={styles.container}>
      <ScrollView>
        <ThemedText type="title" style={styles.title}>
          Settings
        </ThemedText>
        <View style={styles.section}>
        <SettingsItem title="Change username" onPress={() => setUsernameModalVisible(true)} />
        <SettingsItem title="Change password" onPress={() => setPasswordModalVisible(true)} />
        <SettingsItem title="Change email" onPress={() => setEmailModalVisible(true)} />
          <SettingsItem
            title="Push notifications"
            hasSwitch
            switchValue={pushNotifications}
            onSwitchChange={(value) => setPushNotifications(value)}
          />
          <SettingsItem
            title="Dark mode"
            hasSwitch
            switchValue={darkMode}
            onSwitchChange={(value) => setDarkMode(value)}
          />
        </View>
        <View style={styles.section}>
          <SettingsItem title="About us" onPress={() => setAboutModalVisible(true)} />
          <SettingsItem
            title="Contact us"
            onPress={() => setContactModalVisible(true)}
          />
          <SettingsItem
            title="Privacy policy"
            onPress={() => setPrivacyModalVisible(true)}
          />
          <SettingsItem
            title="Logout"
            onPress={handleLogout}
            icon={<MaterialIcons name="logout" size={24} color="red" />}
            style={styles.logoutItem}
            textStyle={styles.logoutText}
          />
        </View>
        <Modal
          animationType="fade"
          transparent={true}
          visible={privacyModalVisible}
          onRequestClose={() => setPrivacyModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Privacy Policy</Text>
              <ScrollView style={{ maxHeight: 400 }}>
                <Text style={styles.modalText}>
                  Our mobile application, GameSuggester, is dedicated to protecting
                  your privacy. We collect and use personal information, such as your
                  account details and gaming preferences, to provide a personalized
                  experience and improve our services. We may also collect usage data
                  to analyze how the app is used. Rest assured, your information is
                  not shared with third parties except for essential service providers
                  or when required by law. We prioritize the security of your data,
                  though no method of transmission is completely secure. For more
                  information, please refer to our detailed privacy policy.
                </Text>
              </ScrollView>
              <View style={styles.buttonContainer}>
                <View style={styles.button}>
                  <Button
                    title="Close"
                    onPress={() => setPrivacyModalVisible(false)}
                    color="#FFA500"
                  />
                </View>
              </View>
            </View>
          </View>
        </Modal>
        <Modal
          animationType="fade"
          transparent={true}
          visible={contactModalVisible}
          onRequestClose={() => setContactModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Send us your message!</Text>
              <TextInput
                style={styles.textArea}
                placeholder="Type your message here..."
                placeholderTextColor="#999"
                multiline={true}
                numberOfLines={4}
                value={userMessage}
                onChangeText={setUserMessage}
              />
              <View style={styles.buttonContainer}>
                <View style={styles.button}>
                  <Button
                    title="Close"
                    onPress={() => setContactModalVisible(false)}
                    color="#FFA500"
                  />
                </View>
                <View style={styles.button}>
                  <Button
                    title="Send"
                    onPress={() => {
                      console.log('Message sent:', userMessage);
                      setContactModalVisible(false);
                    }}
                    color="#00FF00"
                  />
                </View>
              </View>
            </View>
          </View>
        </Modal>
        <Modal
          animationType="fade"
          transparent={true}
          visible={aboutModalVisible}
          onRequestClose={() => setAboutModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>About Us</Text>
              <ScrollView style={{ maxHeight: 400 }}>
                <Text style={styles.modalText}>
                  We are three passionate students from Bilkent University who share a deep love for gaming. Our mission is to create a platform that not only recommends games based on your preferences but also fosters a community of gamers who can share their experiences and discover new titles together. Whether you're into strategy, adventure, or anything in between, we're here to help you find your next favorite game!
                </Text>
              </ScrollView>
              <View style={styles.buttonContainer}>
                <View style={styles.button}>
                  <Button
                    title="Close"
                    onPress={() => setAboutModalVisible(false)}
                    color="#FFA500"
                  />
                </View>
              </View>
            </View>
          </View>
        </Modal>
        <Modal
          animationType="fade"
          transparent={true}
          visible={usernameModalVisible}
          onRequestClose={() => setUsernameModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Change Username</Text>
              <Text style={styles.modalText}>Your current username is: {currentUsername}</Text>
              <TextInput
                style={styles.input}
                placeholder="New Username"
                placeholderTextColor="#999"
                value={newUsername}
                onChangeText={setNewUsername}
              />
              <View style={styles.buttonContainer}>
                <View style={styles.button}>
                  <Button
                    title="Close"
                    onPress={() => setUsernameModalVisible(false)}
                    color="#FFA500"
                  />
                </View>
                <View style={styles.button}>
                  <Button
                    title="Save"
                    onPress={() => {
                      console.log('Username changed to:', newUsername);
                      setUsernameModalVisible(false);
                    }}
                    color="#00FF00"
                  />
                </View>
              </View>
            </View>
          </View>
        </Modal>

        <Modal
          animationType="fade"
          transparent={true}
          visible={passwordModalVisible}
          onRequestClose={() => setPasswordModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Change Password</Text>
              <Text style={styles.modalText}>Your current password is: {currentPassword}</Text>
              <TextInput
                style={styles.input}
                placeholder="New Password"
                placeholderTextColor="#999"
                secureTextEntry={true}
                value={newPassword}
                onChangeText={setNewPassword}
              />
              <View style={styles.buttonContainer}>
                <View style={styles.button}>
                  <Button
                    title="Close"
                    onPress={() => setPasswordModalVisible(false)}
                    color="#FFA500"
                  />
                </View>
                <View style={styles.button}>
                  <Button
                    title="Save"
                    onPress={() => {
                      console.log('Password changed to:', newPassword);
                      setPasswordModalVisible(false);
                    }}
                    color="#00FF00"
                  />
                </View>
              </View>
            </View>
          </View>
        </Modal>

        <Modal
          animationType="fade"
          transparent={true}
          visible={emailModalVisible}
          onRequestClose={() => setEmailModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Change Email</Text>
              <Text style={styles.modalText}>Your current email is: {currentEmail}</Text>
              <TextInput
                style={styles.input}
                placeholder="New Email"
                placeholderTextColor="#999"
                keyboardType="email-address"
                value={newEmail}
                onChangeText={setNewEmail}
              />
              <View style={styles.buttonContainer}>
                <View style={styles.button}>
                  <Button
                    title="Close"
                    onPress={() => setEmailModalVisible(false)}
                    color="#FFA500"
                  />
                </View>
                <View style={styles.button}>
                  <Button
                    title="Save"
                    onPress={() => {
                      console.log('Email changed to:', newEmail);
                      setEmailModalVisible(false);
                    }}
                    color="#00FF00"
                  />
                </View>
              </View>
            </View>
          </View>
        </Modal>
      </ScrollView>
      
    </ThemedView>
  );
};

export default Settings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#121212",
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    color: "#ffffff",
  },
  section: {
    marginVertical: 20,
  },
  logoutSection: {
    marginVertical: 290,
  },
  settingsItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#333333",
  },
  itemText: {
    fontSize: 18,
    color: "#ffffff",
  },
  iconContainer: {
    marginLeft: 10,
  },
  logoutItem: {
    borderBottomColor: "red",
  },
  logoutText: {
    color: "red",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.8)",
  },
  modalContent: {
    width: 400,
    padding: 20,
    backgroundColor: "#353636",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 20,
  },
  button: {
    flex: 1,
    marginHorizontal: 5,
  },
  modalTitle: {
    fontSize: 20,
    color: "white",
    marginBottom: 20,
  },
  modalText: {
    fontSize: 16,
    color: "#FFFFFF",
    marginBottom: 20,
  },
  textArea: {
    width: '100%',
    height: 100,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    color: '#FFFFFF',
    backgroundColor: '#2b2b2b',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    color: '#FFFFFF',
    backgroundColor: '#2b2b2b',
    marginBottom: 20,
  },
});
