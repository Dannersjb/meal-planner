import { Colours } from "@/constants/Globals";
import { StyleProp, TextStyle, TextInput, useColorScheme, TextInputProps } from "react-native";

type ThemedTextInputProps = TextInputProps & {
  style?: StyleProp<TextStyle>;
};

const ThemedTextInput: React.FC<ThemedTextInputProps> = ({ style, ...props }) => {
  const colourScheme = useColorScheme();
  const theme = Colours[colourScheme ?? "light"];

  return (
    <TextInput
      placeholderTextColor={theme.iconColour}
      style={[
        {
          marginVertical: 5,
          fontFamily: Colours.fontFamily,
          backgroundColor: "#FFF",
          borderWidth: 2,
          borderColor: Colours.primary,
          color: theme.textColour,
          fontSize: 18,
          paddingVertical: 15,
          paddingHorizontal: 12,
          borderRadius: 6,
        },
        style,
      ]}
      {...props}
    />
  );
};

export default ThemedTextInput;
