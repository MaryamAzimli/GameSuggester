import { Ionicons, FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import { type IconProps } from "@expo/vector-icons/build/createIconSet";
import { type ComponentProps } from "react";

type IconName =
  | ComponentProps<typeof Ionicons>["name"]
  | ComponentProps<typeof FontAwesome5>["name"];

interface CustomIconProps extends IconProps<IconName> {
  library: "Ionicons" | "FontAwesome5" | "MaterialIcons";
}

export function TabBarIcon({ style, name, library, ...rest }: CustomIconProps) {
  if (library === "FontAwesome5") {
    return (
      <FontAwesome5
        size={25}
        style={[{ marginBottom: -3 }, style]}
        name={name}
        {...rest}
      />
    );
  } else if (library === "MaterialIcons") {
    return (
      <MaterialIcons
        size={28}
        style={[{ marginBottom: -3 }, style]}
        name={name}
        {...rest}
      />
    );
  }
  return (
    <Ionicons
      size={28}
      style={[{ marginBottom: -3 }, style]}
      name={name}
      {...rest}
    />
  );
}
