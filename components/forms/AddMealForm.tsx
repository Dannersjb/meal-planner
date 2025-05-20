import { ViewStyle, StyleProp, Alert } from "react-native";
import ThemedButton from "@/components/ThemedButton";
import { useEffect, useState } from "react";
import ThemedText from "@/components/ThemedText";
import { useDatabase } from "@/providers/DatabaseProvider";
import ThemedDropDownPicker from "@/components/ThemedDropDownPicker";

type ThemedViewProps = React.PropsWithChildren<{
  style?: StyleProp<ViewStyle>;
  onItemAdded?: () => void;
  scheduledDate: string | null;
}>;

type Recipe = {
  id: number;
  name: string;
};

const AddMealForm: React.FC<ThemedViewProps> = ({ style, onItemAdded, children, ...props }) => {
  const [openPicker, setOpenPicker] = useState(false);
  const [recipeList, setRecipeList] = useState<Recipe[]>([]);
  const [selectedRecipe, setRecipe] = useState("");
  const db = useDatabase();

  useEffect(() => {
    try {
      const result = db.getAllSync<Recipe>(
        `SELECT recipes.id, recipes.name
          FROM recipes;
      `
      );
      setRecipeList(result);
    } catch (error) {
      console.error(`Failed to fetch recipes:`, error);
    }
  }, []);

  const handleSubmit = () => {
    if (!selectedRecipe) {
      Alert.alert("Please select a recipe.");
      return;
    }

    try {
      db.runSync("INSERT INTO meal_plan (scheduled_date, recipe_id) VALUES (?, ?);", [
        props.scheduledDate,
        selectedRecipe,
      ]);
      setRecipe(""); // Clear input
      onItemAdded?.(); // Trigger callback to update list and close modal
    } catch (error) {
      console.error("Failed to add recipe to meal plan:", error);
      Alert.alert("Error adding recipe to meal plan.");
    }
  };

  return (
    <>
      <ThemedText style={[{ fontSize: 24, marginBottom: 15 }]}>Add Meal:</ThemedText>
      <ThemedDropDownPicker
        open={openPicker}
        value={selectedRecipe}
        items={recipeList.map((recipe) => ({
          label: recipe.name,
          value: recipe.id.toString(),
        }))}
        setOpen={setOpenPicker}
        setValue={setRecipe}
        placeholder="Select a recipe"
        style={{ marginBottom: openPicker ? 100 : 20 }}
      />
      <ThemedButton onPress={handleSubmit}>Add Meal</ThemedButton>
    </>
  );
};

export default AddMealForm;
