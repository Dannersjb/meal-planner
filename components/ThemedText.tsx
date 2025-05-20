import { Text, TextStyle, StyleProp, useColorScheme } from "react-native";
import { Colours } from "@/constants/Globals";

type ThemedTextProps = React.PropsWithChildren<{
  style?: StyleProp<TextStyle>;
}>;

const ThemedText: React.FC<ThemedTextProps> = ({ style, ...props }) => {
  const colourScheme = useColorScheme();
  const theme = Colours[colourScheme ?? "light"];

  return (
    <Text
      style={[
        {
          fontFamily: Colours.fontFamily,
          color: theme.textColour,
        },
        style,
      ]}
      {...props}
    />
  );
};

export default ThemedText;
