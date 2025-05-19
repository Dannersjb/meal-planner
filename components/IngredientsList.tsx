import {
  View,
  TextStyle,
  StyleSheet,
  StyleProp,
  useColorScheme,
  FlatList,
  Pressable,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";
import { Colours } from "../constants/Globals";
import React, { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useDatabase } from "@/providers/DatabaseProvider";
import ThemedText from "./ThemedText";
import ThemedOverlayView from "./ThemedOverlayView";
import AddIngredientForm from "./forms/AddIngredientForm";

type IngredientsListProps = React.PropsWithChildren<{
  recipeId: number | null;
  onAddIngredientPress?: () => void;
  style?: StyleProp<TextStyle>;
}>;

type Ingredient = {
  id: number;
  name: string;
  quantity: number;
  unit: string;
};

const IngredientsList: React.FC<IngredientsListProps> = ({
  style,
  recipeId,
  onAddIngredientPress,
}) => {
  const db = useDatabase();
  const colourScheme = useColorScheme();
  const theme = Colours[colourScheme ?? "light"];
  const [ingredientList, setRecipeList] = useState<Ingredient[]>([]);
  const [ingredientModalVisible, setIngredientModalVisible] = useState(false);

  useEffect(() => {
    try {
      const result = db.getAllSync<Ingredient>(
        `SELECT recipe_ingredients.id, ingredients.name, recipe_ingredients.quantity, recipe_ingredients.unit
            FROM recipe_ingredients
            JOIN ingredients ON recipe_ingredients.ingredient_id = ingredients.id
            WHERE recipe_ingredients.recipe_id = ?;`,
        [recipeId]
      );
      setRecipeList(result);
    } catch (error) {
      console.error(`Failed to fetch recipe ingredients for recipe_id ${recipeId}: `, error);
    }
  }, []);

  const refreshIngredientsList = () => {
    try {
      const result = db.getAllSync<Ingredient>(
        `SELECT recipe_ingredients.id, ingredients.name, recipe_ingredients.quantity, recipe_ingredients.unit
            FROM recipe_ingredients
            JOIN ingredients ON recipe_ingredients.ingredient_id = ingredients.id
            WHERE recipe_ingredients.recipe_id = ?;`,
        [recipeId]
      );
      setRecipeList(result);
    } catch (error) {
      console.error(`Failed to fetch recipe ingredients for recipe_id ${recipeId}: `, error);
    }
  };

  const renderIngredientContent = ({ item }: { item: Ingredient }) => (
    <View style={[styles.ingredient, { backgroundColor: theme.backgroundColour }]}>
      <ThemedText
        style={{ fontSize: 18 }}
      >{`${item.quantity}${item.unit} ${item.name}`}</ThemedText>
    </View>
  );

  return (
    <View
      style={[
        {
          backgroundColor: Colours.secondary,
          padding: 20,
        },
        style,
      ]}
    >
      <ThemedText style={{ fontSize: 21, marginBottom: 10 }}>Ingredients:</ThemedText>
      <FlatList
        data={ingredientList}
        keyExtractor={(item) => `${item.id}`}
        renderItem={renderIngredientContent}
        scrollEnabled={false}
      />
      <Pressable
        style={[
          styles.addButton,
          { backgroundColor: theme.backgroundColour, borderColor: Colours.primary },
        ]}
        onPress={() => setIngredientModalVisible(true)}
      >
        <ThemedText style={{ fontSize: 18 }}>Add Ingredient</ThemedText>
        <Ionicons name="add-circle" size={42} color={Colours.primary} />
      </Pressable>

      <Modal
        visible={ingredientModalVisible}
        animationType="fade"
        transparent
        onRequestClose={() => setIngredientModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setIngredientModalVisible(false)}>
          <ThemedOverlayView>
            <AddIngredientForm
              onItemAdded={() => {
                setIngredientModalVisible(false); // close modal
                refreshIngredientsList();
              }}
              recipeId={recipeId}
            />
          </ThemedOverlayView>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  addButton: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderWidth: 2,
    borderRadius: 10,
    marginVertical: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  ingredient: {
    padding: 20,
    borderRadius: 10,
    fontSize: 20,
    marginVertical: 5,
    fontWeight: "bold",
  },
});

export default IngredientsList;
