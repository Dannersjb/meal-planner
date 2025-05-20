import { ViewStyle, StyleProp, Alert } from "react-native";
import ThemedTextInput from "@/components/ThemedTextInput";
import ThemedButton from "@/components/ThemedButton";
import { useState } from "react";
import ThemedText from "@/components/ThemedText";
import { useDatabase } from "@/providers/DatabaseProvider";

type ThemedViewProps = React.PropsWithChildren<{
  style?: StyleProp<ViewStyle>;
  onItemAdded?: () => void;
}>;

const AddShoppingItemForm: React.FC<ThemedViewProps> = ({ onItemAdded }) => {
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
      onItemAdded?.(); // Trigger callback to update list and close modal
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
