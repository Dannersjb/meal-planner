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
import AddMealForm from "./forms/AddMealForm";

type MealsListProps = React.PropsWithChildren<{
  scheduledDate: string | null;
  onAddIngredientPress?: () => void;
  style?: StyleProp<TextStyle>;
}>;

type Recipe = {
  id: number;
  name: string;
};

const MealsList: React.FC<MealsListProps> = ({ style, scheduledDate, onAddIngredientPress }) => {
  const db = useDatabase();
  const colourScheme = useColorScheme();
  const theme = Colours[colourScheme ?? "light"];
  const [mealList, setMealList] = useState<Recipe[]>([]);
  const [mealModalVisible, setMealModalVisible] = useState(false);

  useEffect(() => {
    try {
      const result = db.getAllSync<Recipe>(
        `SELECT recipes.id, recipes.name
          FROM meal_plan
          JOIN recipes ON meal_plan.recipe_id = recipes.id
          WHERE meal_plan.scheduled_date = ?;
      `,
        [scheduledDate]
      );
      setMealList(result);
    } catch (error) {
      console.error(`Failed to fetch recipes for date ${scheduledDate}: `, error);
    }
  }, []);

  const refreshIngredientsList = () => {
    try {
      const result = db.getAllSync<Recipe>(
        `SELECT recipes.id, recipes.name
          FROM meal_plan
          JOIN recipes ON meal_plan.recipe_id = recipes.id
          WHERE meal_plan.scheduled_date = ?;
      `,
        [scheduledDate]
      );
      setMealList(result);
    } catch (error) {
      console.error(`Failed to fetch recipes for date ${scheduledDate}: `, error);
    }
  };

  const renderRecipeContent = ({ item }: { item: Recipe }) => (
    <View style={[styles.ingredient, { backgroundColor: theme.backgroundColour }]}>
      <ThemedText style={{ fontSize: 18 }}>{item.name}</ThemedText>
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
      <FlatList
        data={mealList}
        keyExtractor={(item) => `${item.id}`}
        renderItem={renderRecipeContent}
        scrollEnabled={false}
      />
      <Pressable
        style={[
          styles.addButton,
          { backgroundColor: theme.backgroundColour, borderColor: Colours.primary },
        ]}
        onPress={() => setMealModalVisible(true)}
      >
        <ThemedText style={{ fontSize: 18, paddingLeft: 5 }}>Add Meal</ThemedText>
        <Ionicons name="add-circle" size={42} color={Colours.primary} />
      </Pressable>

      <Modal
        visible={mealModalVisible}
        animationType="fade"
        transparent
        onRequestClose={() => setMealModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setMealModalVisible(false)}>
          <ThemedOverlayView>
            <AddMealForm
              onItemAdded={() => {
                setMealModalVisible(false); // close modal
                refreshIngredientsList();
              }}
              scheduledDate={scheduledDate}
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

export default MealsList;
