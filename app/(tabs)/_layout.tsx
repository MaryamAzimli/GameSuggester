import { Tabs } from "expo-router";
import React from "react";
import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { GameProvider } from "../GameContext"; // Import the GameProvider

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <GameProvider>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
          headerShown: false,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon
                name={focused ? "home" : "home-outline"}
                color={color}
                library="Ionicons"
              />
            ),
          }}
        />
        <Tabs.Screen
          name="explore"
          options={{
            title: "Explore",
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon name="explore" color={color} library="MaterialIcons" />
            ),
          }}
        />
        <Tabs.Screen
          name="profilePage"
          options={{
            title: "Profile Page",
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon name="user-alt" color={color} library="FontAwesome5" />
            ),
          }}
        />
      </Tabs>
    </GameProvider>
  );
}
