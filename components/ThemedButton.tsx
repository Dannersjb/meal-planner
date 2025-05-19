import { Text, Pressable, PressableProps, StyleProp, StyleSheet, ViewStyle } from "react-native";
import { Colours } from "@/constants/Globals";

type ThemedButtonProps = PressableProps & {
  style?: StyleProp<ViewStyle>;
};

const ThemedButton: React.FC<ThemedButtonProps> = ({ style, children, ...props }) => {
  return (
    <Pressable style={({ pressed }) => [styles.btn, pressed && styles.pressed, style]} {...props}>
      {/* Let caller decide if children is Text or not */}
      {typeof children === "string" ? <Text style={styles.text}>{children}</Text> : children}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  btn: {
    fontFamily: Colours.fontFamily,
    backgroundColor: Colours.primary,
    padding: 18,
    borderRadius: 5,
    marginVertical: 10,
  },
  pressed: {
    opacity: 0.5,
  },
  text: {
    fontFamily: Colours.fontFamily,
    color: "#FFF",
    fontSize: 18,
    textAlign: "center",
  },
});

export default ThemedButton;
