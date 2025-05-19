import {
  View,
  ViewStyle,
  StyleProp,
  useColorScheme,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Colours } from "@/constants/Globals";

type ThemedViewProps = React.PropsWithChildren<{
  style?: StyleProp<ViewStyle>;
}>;

const ThemedOverlayView: React.FC<ThemedViewProps> = ({ style, children, ...props }) => {
  const colourScheme = useColorScheme();
  const theme = Colours[colourScheme ?? "light"];

  return (
    <View
      style={[
        {
          flex: 1,
          justifyContent: "center",
          backgroundColor: "rgba(0,0,0,0.5)",
        },
        style,
      ]}
      {...props}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{
          flex: 1,
          justifyContent: "flex-end",
        }}
      >
        <View
          style={[
            {
              backgroundColor: theme.backgroundColour,
              padding: 30,
              elevation: 4,
              borderTopWidth: 40,
              borderColor: Colours.secondary,
            },
          ]}
        >
          {children}
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default ThemedOverlayView;
