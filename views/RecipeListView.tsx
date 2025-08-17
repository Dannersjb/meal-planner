import { Modal, Pressable, StyleSheet, ScrollView, TouchableOpacity, TouchableWithoutFeedback, View, useColorScheme } from "react-native";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useDatabase } from "@/providers/DatabaseProvider";
import ThemedView from "@/components/ThemedView";
import ThemedOverlayView from "@/components/ThemedOverlayView";
import AddRecipeForm from "@/components/forms/AddRecipeForm";
import ThemedText from "@/components/ThemedText";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RecipesStackParamList } from "@/app/recipes"
import { Colours } from "@/constants/Globals";

type Recipe = {
  id: number;
  name: string;
  instructions: string;
  created_at: string;
};

type RecipeListViewProps = NativeStackScreenProps<RecipesStackParamList, "RecipeListView">;

const RecipeListView : React.FC<RecipeListViewProps> = ({ route, navigation }) => {
  const colourScheme = useColorScheme();
  const theme = Colours[colourScheme ?? "light"];

  const db = useDatabase();
  const [recipeList, setRecipeList] = useState<Recipe[]>([]);
  const [recipeModalVisible, setRecipeModalVisible] = useState(false);

  useLayoutEffect(() => {
    const parentNav = navigation.getParent();

    parentNav?.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={() => setRecipeModalVisible(true)} style={{ marginRight: 20 }}>
          <Ionicons name="add-circle" size={42} color="#FFF" />
        </TouchableOpacity>
      ),
    });

    return () => {
      parentNav?.setOptions({
        headerRight: undefined,
      });
  };
  }, [navigation]);

  useEffect(() => {
    try {
      const result = db.getAllSync<Recipe>("SELECT name, id FROM recipes ORDER BY name ASC;");
      setRecipeList(result);
    } catch (error) {
      console.error("Failed to fetch recipes:", error);
    }
  }, []);

  const refreshRecipeList = () => {
    try {
      const result = db.getAllSync<Recipe>("SELECT name, id FROM recipes ORDER BY name ASC;");
      setRecipeList(result);
    } catch (error) {
      console.error("Failed to fetch recipes:", error);
    }
  };

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
          {
            recipeList.map((recipe) => (
              <Pressable
                  key={recipe.id}
                  style={[styles.recipeItem, { borderColor: theme.borderColour}]}
                  onPress={() =>
                    navigation.navigate("RecipeView", {
                      recipeId: recipe.id
                    })
                  }
                >
                <ThemedText title={true}>{recipe.name}</ThemedText>
              </Pressable>
            ))
          }
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

const styles = StyleSheet.create({
  recipeItem: {
    paddingVertical: 30,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
  }
})


export default RecipeListView;
