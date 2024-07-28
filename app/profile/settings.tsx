import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Switch,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "expo-router";

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

  return (
    <ThemedView style={styles.container}>
      <ScrollView>
        <ThemedText type="title" style={styles.title}>
          Settings
        </ThemedText>
        <View style={styles.section}>
          <SettingsItem title="Change username" onPress={() => {}} />
          <SettingsItem title="Buy a Plan" onPress={() => {}} />
          <SettingsItem title="Add a payment method" onPress={() => {}} />
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
          <SettingsItem title="About us" onPress={() => {}} />
          <SettingsItem title="Contact us" onPress={() => {}} />
          <SettingsItem title="Privacy policy" onPress={() => {}} />
          <SettingsItem
            title="Logout"
            onPress={() => {
              navigation.navigate("login/login");
            }}
            icon={<MaterialIcons name="logout" size={24} color="red" />}
            style={styles.logoutItem}
            textStyle={styles.logoutText}
          />
        </View>
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
});
