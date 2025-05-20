import {
  Modal,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  useColorScheme,
  View,
} from "react-native";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { useNavigation } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useDatabase } from "@/providers/DatabaseProvider";
import ThemedView from "@/components/ThemedView";
import ThemedOverlayView from "@/components/ThemedOverlayView";
import AddRecipeForm from "@/components/forms/AddRecipeForm";
import { Colours } from "@/constants/Globals";
import ThemedText from "@/components/ThemedText";
import IngredientsList from "@/components/IngredientsList";
import ThemedAccordion from "@/components/ThemedAccordion";

type Recipe = {
  id: number;
  name: string;
  instructions: string;
  created_at: string;
};

const RecipesView = () => {
  const colourScheme = useColorScheme();
  const theme = Colours[colourScheme ?? "light"];

  const db = useDatabase();
  const navigation = useNavigation();
  const [recipeList, setRecipeList] = useState<Recipe[]>([]);
  const [recipeModalVisible, setRecipeModalVisible] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={() => setRecipeModalVisible(true)} style={{ marginRight: 20 }}>
          <Ionicons name="add-circle" size={42} color="#FFF" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  useEffect(() => {
    try {
      const result = db.getAllSync<Recipe>("SELECT * FROM recipes ORDER BY name ASC;");
      setRecipeList(result);
    } catch (error) {
      console.error("Failed to fetch recipes:", error);
    }
  }, []);

  const refreshRecipeList = () => {
    try {
      const result = db.getAllSync<Recipe>("SELECT * FROM recipes ORDER BY name ASC;");
      setRecipeList(result);
    } catch (error) {
      console.error("Failed to fetch recipes:", error);
    }
  };

  const renderRecipeContent = (recipe: Recipe) => (
    <View style={{ paddingHorizontal: 10 }}>
      <IngredientsList recipeId={recipe.id} />
      <ThemedText>{recipe.instructions}</ThemedText>
    </View>
  );

  return (
    <ThemedView>
      {recipeList.length === 0 ? (
        <View
          style={{
            paddingVertical: 60,
          }}
        >
          <ThemedText style={{ textAlign: "center", fontSize: 18 }}>No recipes found.</ThemedText>
        </View>
      ) : (
        <ScrollView>
          <ThemedAccordion
            sections={recipeList}
            renderContent={renderRecipeContent}
            defaultActiveSectionIndex={null}
          />
        </ScrollView>
      )}

      <Modal
        visible={recipeModalVisible}
        animationType="fade"
        transparent
        onRequestClose={() => setRecipeModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setRecipeModalVisible(false)}>
          <ThemedOverlayView>
            <AddRecipeForm
              onItemAdded={() => {
                refreshRecipeList(); // refresh list
                setRecipeModalVisible(false); // close modal
              }}
            />
          </ThemedOverlayView>
        </TouchableWithoutFeedback>
      </Modal>
    </ThemedView>
  );
};

export default RecipesView;
