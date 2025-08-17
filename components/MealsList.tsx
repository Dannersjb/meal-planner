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
import { Colours } from "@/constants/Globals";
import React, { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useDatabase } from "@/providers/DatabaseProvider";
import ThemedText from "@/components/ThemedText";
import ThemedOverlayView from "@/components/ThemedOverlayView";
import AddMealForm from "@/components/forms/AddMealForm";
import { useNavigation } from "expo-router";

type MealsListProps = React.PropsWithChildren<{
  scheduledDate: string | null;
  style?: StyleProp<TextStyle>;
}>;

type Recipe = {
  id: number | "add";
  name: string;
};

const MealsList: React.FC<MealsListProps> = ({ style, scheduledDate }) => {
  const navigation = useNavigation<any>();
 
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

  const renderRecipeContent = ({ item }: { item: Recipe }) => {
    if (item.id === "add") {
      return (
        <Pressable
          style={[
            styles.addButton,
            { backgroundColor: theme.backgroundColour, borderColor: Colours.primary },
          ]}
          onPress={() => setMealModalVisible(true)}
        >
          <Ionicons name="add-circle" size={42} color={Colours.primary} />
        </Pressable>
      );
    }

    return (
      <Pressable
        key={item.id}
        style={[styles.ingredient, { backgroundColor: theme.backgroundColour, borderColor: theme.outlineColour }]}
        onPress={() =>
          navigation.navigate("recipes", {
            screen: "RecipeView",
            params: { recipeId: item.id },
          })
        }
      >
        <ThemedText style={{ fontSize: 16, flexWrap: "wrap", textAlign: "center", }}>{item.name}</ThemedText>
      </Pressable>
        
    );
  };

  return (
    <>
      <FlatList
        data={[...mealList, { id: "add", name: "" }]}
        contentContainerStyle={{   
          alignItems: "center",
          paddingRight: 60,
        }}
        horizontal={true}
        keyExtractor={(item, index) => `${item.id}-${index}-${scheduledDate}`}
        renderItem={renderRecipeContent}
        scrollEnabled={true}
        showsHorizontalScrollIndicator={false}
      />

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
    </>
  );
};

const styles = StyleSheet.create({
  addButton: {
    paddingHorizontal: 10,
    borderWidth: 2,
    borderRadius: 10,
    marginVertical: 10,
    marginHorizontal: 5,
    height: 75,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  ingredientList: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  ingredient: {
    borderColor: "#000000",
    marginHorizontal: 5,
    paddingHorizontal: 15,
    borderRadius: 10,
    borderWidth: 2,
    fontSize: 20,
    fontWeight: "bold",
    maxWidth: 150,
    justifyContent: "center",
    alignItems: "center", 
    height: 75,
    flexShrink: 1, 
  },
});

export default MealsList;
