import { ViewStyle, StyleProp, Alert } from "react-native";
import ThemedTextInput from "@/components/ThemedTextInput";
import ThemedButton from "@/components/ThemedButton";
import { useState } from "react";
import ThemedText from "@/components/ThemedText";
import { useDatabase } from "@/providers/DatabaseProvider";
import ThemedDropDownPicker from "@/components/ThemedDropDownPicker";

type ThemedViewProps = React.PropsWithChildren<{
  recipeId: number | null;
  style?: StyleProp<ViewStyle>;
  onItemAdded?: () => void;
}>;

const AddIngredientForm: React.FC<ThemedViewProps> = ({ onItemAdded, recipeId }) => {
  const db = useDatabase();
  const [openPicker, setOpenPicker] = useState(false);
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [selectedUnit, setUnit] = useState("");

  const units = [
    { label: "grams", value: "g" },
    { label: "kilograms", value: "kg" },
    { label: "millilitres", value: "ml" },
    { label: "litres", value: "l" },
    { label: "teaspoons", value: "tsp" },
    { label: "tablespoons", value: "tbsp" },
    { label: "cups", value: "cup" },
    { label: "pieces", value: "pcs" },
  ];

  const handleSubmit = () => {
    if (!name.trim()) {
      Alert.alert("Please enter an ingredient name.");
      return;
    }

    if (!quantity.trim()) {
      Alert.alert("Please enter a quantity.");
      return;
    }

    if (!selectedUnit.trim()) {
      Alert.alert("Please select a unit of measurement.");
      return;
    }

    try {
      db.runSync("INSERT OR IGNORE INTO ingredients (name) VALUES (?);", name);
      const result = db.getFirstSync<{ id: number }>(
        "SELECT id FROM ingredients WHERE name = ?;",
        name
      );
      const ingredientId = result?.id ?? null;
      db.runSync(
        "INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit) VALUES (?, ?, ?, ?);",
        [recipeId, ingredientId, quantity, selectedUnit]
      );
      setName(""); // Clear input
      onItemAdded?.(); // Trigger callback to update list and close modal
    } catch (error) {
      console.error("Failed to insert item:", error);
      Alert.alert("Error ingredient to recipe.");
    }
  };

  return (
    <>
      <ThemedText style={[{ fontSize: 24, marginBottom: 15 }]}>Add Ingredient:</ThemedText>
      <ThemedTextInput
        autoFocus
        placeholder="Ingredient Name"
        value={name}
        onChangeText={setName}
      />
      <ThemedTextInput placeholder="Quantity" value={quantity} onChangeText={setQuantity} />
      <ThemedDropDownPicker
        open={openPicker}
        value={selectedUnit}
        items={units}
        setOpen={setOpenPicker}
        setValue={setUnit}
        placeholder="Select a unit"
        style={{ marginBottom: openPicker ? 100 : 20 }}
      />
      <ThemedButton onPress={handleSubmit}>Add Ingredient</ThemedButton>
    </>
  );
};

export default AddIngredientForm;
