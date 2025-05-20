import { ViewStyle, StyleProp, useColorScheme, Alert } from "react-native";
import { Colours } from "@/constants/Globals";
import ThemedTextInput from "../ThemedTextInput";
import ThemedButton from "../ThemedButton";
import { useState } from "react";
import ThemedText from "../ThemedText";
import { useDatabase } from "@/providers/DatabaseProvider";

type ThemedViewProps = React.PropsWithChildren<{
  style?: StyleProp<ViewStyle>;
  onItemAdded?: () => void;
}>;

const AddShoppingItemForm: React.FC<ThemedViewProps> = ({
  style,
  onItemAdded,
  children,
  ...props
}) => {
  const colourScheme = useColorScheme();
  const theme = Colours[colourScheme ?? "light"];
  const db = useDatabase();
  const [name, setName] = useState("");

  const handleSubmit = () => {
    if (!name.trim()) {
      Alert.alert("Please enter a product name.");
      return;
    }

    try {
      // Get the highest current order value to append the new item to the end
      const result = db.getFirstSync<{ maxOrder: number }>(
        "SELECT MAX(item_order) as maxOrder FROM shopping_list;"
      );
      const newOrder = (result?.maxOrder ?? 0) + 1;

      db.runSync(
        "INSERT INTO shopping_list (item_name, item_order, quantity, is_checked) VALUES (?, ?, ?, ?);",
        [name.trim(), newOrder, 1, 0]
      );

      setName(""); // Clear input
      onItemAdded?.(); // Trigger callback to update list or close modal
    } catch (error) {
      console.error("Failed to insert item:", error);
      Alert.alert("Error adding item to list.");
    }
  };

  return (
    <>
      <ThemedText style={[{ fontSize: 24, marginBottom: 15 }]}>Add Shopping:</ThemedText>
      <ThemedTextInput autoFocus placeholder="Product Name" value={name} onChangeText={setName} />
      <ThemedButton onPress={handleSubmit}>Add Product</ThemedButton>
    </>
  );
};

export default AddShoppingItemForm;
