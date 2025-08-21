import { ViewStyle, StyleProp, Alert } from "react-native";
import ThemedTextInput from "@/components/ThemedTextInput";
import ThemedButton from "@/components/ThemedButton";
import { useState } from "react";
import ThemedText from "@/components/ThemedText";
import { useDatabase } from "@/providers/DatabaseProvider";

type ThemedViewProps = React.PropsWithChildren<{
  recipeId: number | null;
  style?: StyleProp<ViewStyle>;
  onItemAdded?: () => void;
}>;

const AddInstructionForm: React.FC<ThemedViewProps> = ({ onItemAdded, recipeId }) => {
  const db = useDatabase();
  const [description, setDescription] = useState("");

  const handleSubmit = () => {
    if (!description.trim()) {
      Alert.alert("Please enter an instruction description.");
      return;
    }

    try {
      db.runSync("INSERT OR IGNORE INTO recipe_instructions (description) VALUES (?);", description);
  
      setDescription(""); // Clear input
      onItemAdded?.(); // Trigger callback to update list and close modal
    } catch (error) {
      console.error("Failed to insert item:", error);
      Alert.alert("Error instruction to recipe.");
    }
  };

  return (
    <>
      <ThemedText style={[{ fontSize: 24, marginBottom: 15 }]}>Add Instruction:</ThemedText>
      <ThemedTextInput
        autoFocus
        placeholder="Desciption"
        value={description}
        onChangeText={setDescription}
      />
      <ThemedButton onPress={handleSubmit}>Add Instruction</ThemedButton>
    </>
  );
};

export default AddInstructionForm;
