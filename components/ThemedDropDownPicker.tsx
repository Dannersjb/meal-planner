import { Colours } from "@/constants/Globals";
import DropDownPicker, { DropDownPickerProps } from "react-native-dropdown-picker";
import { Ionicons } from "@expo/vector-icons";

const ThemedDropDownPicker = <T extends string | number | boolean>({
  style,
  ...props
}: DropDownPickerProps<T>) => {
  return (
    <DropDownPicker
      {...props}
      labelStyle={{
        fontSize: 18,
        fontFamily: Colours.fontFamily,
      }}
      textStyle={{
        fontSize: 18,
        fontFamily: Colours.fontFamily,
      }}
      dropDownContainerStyle={{
        borderColor: Colours.primary,
        borderWidth: 2,
        borderTopWidth: 0,
      }}
      style={[
        {
          marginVertical: 5,
          borderColor: Colours.primary,
          borderWidth: 2,
        },
        style,
      ]}
      ArrowDownIconComponent={() => (
        <Ionicons name="chevron-down" size={20} color={Colours.primary} />
      )}
      ArrowUpIconComponent={() => <Ionicons name="chevron-up" size={20} color={Colours.primary} />}
    />
  );
};

export default ThemedDropDownPicker;
