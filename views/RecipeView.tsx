import { ScrollView, View } from "react-native";
import React, { useEffect, useState } from "react";
import { useDatabase } from "@/providers/DatabaseProvider";
import ThemedView from "@/components/ThemedView";
import ThemedText from "@/components/ThemedText";
import IngredientsList from "@/components/IngredientsList";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RecipesStackParamList } from "@/app/recipes"

type Recipe = {
  id: number;
  name: string;
  instructions: string;
  created_at: string;
};

type RecipeViewProps = NativeStackScreenProps<RecipesStackParamList, "RecipeView">;

const RecipeView : React.FC<RecipeViewProps> = ({ route, navigation }) => {
  const { recipeId } = route.params;
  const db = useDatabase();
  const [recipe, setRecipe] = useState<Recipe | null>(null);

    useEffect(() => {
        try {
            const result = db.getFirstSync<Recipe>("SELECT * FROM recipes WHERE id = ?;", recipeId);
            setRecipe(result);
        } catch (error) {
            console.error("Failed to fetch recipe:", error);
        }
    }, []);

  const renderRecipeContent = (recipe: Recipe) => (
    <View style={{ paddingHorizontal: 10 }}>
      <IngredientsList recipeId={recipe.id} />
      <ThemedText>{recipe.instructions}</ThemedText>
    </View>
  );

  return (
    <ThemedView>
      {!recipe ? (
        <View
          style={{
            paddingVertical: 60,
          }}
        >
          <ThemedText style={{ textAlign: "center", fontSize: 18 }}>Recipe not found.</ThemedText>
        </View>
      ) : (
        <ScrollView>
            <View style={{ paddingHorizontal: 10 }}>
                <IngredientsList recipeId={recipe.id} />
                {/* <ThemedText>{recipe.instructions}</ThemedText> */}
            </View>
        </ScrollView>
      )}

    </ThemedView>
  );
};

export default RecipeView;
