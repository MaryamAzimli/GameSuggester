import React, { useState } from "react";
import { StyleSheet, View, Text, Switch, TouchableOpacity } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";

const SettingsItem = ({
  title,
  onPress,
  hasSwitch,
  switchValue,
  onSwitchChange,
}) => (
  <TouchableOpacity onPress={onPress} style={styles.settingsItem}>
    <Text style={styles.itemText}>{title}</Text>
    {hasSwitch && (
      <Switch
        value={switchValue}
        onValueChange={onSwitchChange}
        trackColor={{ false: "#767577", true: "#81b0ff" }}
        thumbColor={switchValue ? "#f5dd4b" : "#f4f3f4"}
      />
    )}
  </TouchableOpacity>
);

const Settings = () => {
  const [pushNotifications, setPushNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>
        Settings
      </ThemedText>
      <View style={styles.section}>
        <SettingsItem title="Edit profile" onPress={() => {}} />
        <SettingsItem title="Change password" onPress={() => {}} />
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
        <SettingsItem title="Privacy policy" onPress={() => {}} />
      </View>
    </ThemedView>
  );
};

export default Settings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#121212", // Dark background
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    color: "#ffffff", // White text color
  },
  section: {
    marginVertical: 20,
  },
  settingsItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#333333", // Lighter border color for better visibility
  },
  itemText: {
    fontSize: 18,
    color: "#ffffff", // White text color
  },
});
