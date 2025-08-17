import { Text, TextStyle, StyleProp, useColorScheme } from "react-native";
import { Colours } from "@/constants/Globals";

type ThemedTextProps = React.PropsWithChildren<{
  style?: StyleProp<TextStyle>;
  title?: boolean;
}>;

const ThemedText: React.FC<ThemedTextProps> = ({ style, title, ...props }) => {
  const colourScheme = useColorScheme();
  const theme = Colours[colourScheme ?? "light"];

  return (
    <Text
      style={[
        {
          fontFamily: title ?  Colours.fontFamilyBold : Colours.fontFamily,
          fontSize: title ? 26 : 16,
          color: theme.textColour,
        },
        style,
      ]}
      {...props}
    />
  );
};

export default ThemedText;
