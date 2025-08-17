import {
  View,
  TextStyle,
  StyleSheet,
  StyleProp,
  useColorScheme,
  Pressable,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";
import { Colours } from "@/constants/Globals";
import React, { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useDatabase } from "@/providers/DatabaseProvider";
import ThemedText from "@/components/ThemedText";
import ThemedOverlayView from "@/components/ThemedOverlayView";
import AddIngredientForm from "@/components/forms/AddIngredientForm";
import { SwipeListView } from "react-native-swipe-list-view";

type IngredientsListProps = React.PropsWithChildren<{
  recipeId: number | null;
  editMode: boolean;
  style?: StyleProp<TextStyle>;
}>;

type Ingredient = {
  id: number;
  name: string;
  quantity: number;
  unit: string;
};

const IngredientsList: React.FC<IngredientsListProps> = ({ style, recipeId, editMode }) => {
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

  const deleteIngredient = (id: number) => {
    try {
      db.runSync(`DELETE FROM recipe_ingredients WHERE id = ?;`, [id]);
      refreshIngredientsList();
    } catch (error) {
      console.error("Failed to delete ingredient:", error);
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
      <SwipeListView
        data={ingredientList}
        keyExtractor={(item) => `${item.id}`}
        scrollEnabled={false}
        renderItem={({ item }) => (
          <View style={[styles.ingredient, { backgroundColor: theme.backgroundColour }]}>
            <ThemedText style={{ fontSize: 18 }}>
              {`${item.quantity}${item.unit} ${item.name}`}
            </ThemedText>
          </View>
        )}
        renderHiddenItem={({ item }) => (
          <Pressable
            style={styles.deleteButtonContainer}
            onPress={() => deleteIngredient(item.id)}
          >
            <ThemedText style={styles.deleteButton}>Delete</ThemedText>
          </Pressable>
        )}
        rightOpenValue={-75}
      />
      { editMode && (
        <Pressable
          style={[
            styles.addButton,
            { backgroundColor: theme.backgroundColour, borderColor: Colours.primary },
          ]}
          onPress={() => setIngredientModalVisible(true)}
        >
          <ThemedText style={{ fontSize: 18, paddingLeft: 5 }}>Add Ingredient</ThemedText>
          <Ionicons name="add-circle" size={42} color={Colours.primary} />
        </Pressable>
      )}

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
                refreshIngredientsList(); // update the list render
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
  deleteButtonContainer: {
    justifyContent: "center",
    alignItems: "flex-end",
    flex: 1,
  },
  deleteButton: {
    backgroundColor: Colours.danger,
    color: '#fff',
    padding: 20,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
  }
});

export default IngredientsList;
