import { View, ViewStyle, StyleProp, useColorScheme } from "react-native";
import { Colours } from "../constants/Globals";
import { useSafeAreaInsets } from "react-native-safe-area-context";
//import { SafeAreaView } from "react-native-safe-area-context";

type ThemedViewProps = React.PropsWithChildren<{
  style?: StyleProp<ViewStyle>;
  safe?: boolean;
}>;

const ThemedView: React.FC<ThemedViewProps> = ({ style, safe = false, ...props }) => {
  const colourScheme = useColorScheme();
  const theme = Colours[colourScheme ?? "light"];

  if (!safe)
    return (
      <View
        style={[
          {
            backgroundColor: theme.backgroundColour,
          },
          style,
        ]}
        {...props}
      />
    );

  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        {
          backgroundColor: theme.backgroundColour,
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
        },
        style,
      ]}
      {...props}
    />
  );
};

export default ThemedView;
