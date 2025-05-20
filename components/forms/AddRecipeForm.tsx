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

const AddRecipeForm: React.FC<ThemedViewProps> = ({ onItemAdded }) => {
  const db = useDatabase();
  const [name, setName] = useState("");

  const handleSubmit = () => {
    if (!name.trim()) {
      Alert.alert("Please enter a product name.");
      return;
    }

    try {
      db.runSync("INSERT INTO recipes (name) VALUES (?);", [name.trim()]);

      setName(""); // Clear input
      onItemAdded?.(); // Trigger callback to update list and close modal
    } catch (error: any) {
      if (error.message.includes("UNIQUE constraint failed")) {
        Alert.alert("Recipe already exists", "Please use a different name.");
      } else {
        console.error("Failed to insert recipe:", error);
        Alert.alert("Error adding recipe.");
      }
    }
  };

  return (
    <>
      <ThemedText style={[{ fontSize: 24, marginBottom: 15 }]}>Add Recipe:</ThemedText>
      <ThemedTextInput autoFocus placeholder="Recipe Name" value={name} onChangeText={setName} />
      <ThemedButton onPress={handleSubmit}>Add Recipe</ThemedButton>
    </>
  );
};

export default AddRecipeForm;
