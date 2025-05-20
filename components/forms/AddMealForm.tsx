import { ViewStyle, StyleProp, useColorScheme, Alert } from "react-native";
import { Colours } from "@/constants/Globals";
import ThemedButton from "../ThemedButton";
import { useEffect, useRef, useState } from "react";
import ThemedText from "../ThemedText";
import { useDatabase } from "@/providers/DatabaseProvider";
import ThemedDropDownPicker from "../ThemedDropDownPicker";

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
  const colourScheme = useColorScheme();
  const theme = Colours[colourScheme ?? "light"];
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
      onItemAdded?.(); // Trigger callback to update list or close modal
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
          label: recipe.name, // Use the recipe name for the label
          value: recipe.id.toString(), // Convert the recipe ID to a string for the value
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
