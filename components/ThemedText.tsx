import { Text, TextStyle, StyleProp, useColorScheme, TextProps } from "react-native";
import { Colours } from "@/constants/Globals";

type ThemedTextProps = TextProps & {
  style?: StyleProp<TextStyle>;
  title?: boolean;
};

const ThemedText: React.FC<ThemedTextProps> = ({ style, title, ...props }) => {
  const colourScheme = useColorScheme();
  const theme = Colours[colourScheme ?? "light"];

  return (
    <Text
      style={[
        {
          fontFamily: title ?  Colours.fontFamilyBold : Colours.fontFamily,
          fontSize: title ? 26 : 15,
          color: theme.textColour,
        },
        style,
      ]}
      {...props}
    />
  );
};

export default ThemedText;
