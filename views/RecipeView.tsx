import { ScrollView, View, StyleSheet, TouchableOpacity, useColorScheme } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { useDatabase } from "@/providers/DatabaseProvider";
import ThemedView from "@/components/ThemedView";
import ThemedText from "@/components/ThemedText";
import IngredientsList from "@/components/IngredientsList";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RecipesStackParamList } from "@/app/recipes"
import { Colours } from "@/constants/Globals";

type Recipe = {
  id: number;
  name: string;
  instructions: string;
  created_at: string;
};

type RecipeViewProps = NativeStackScreenProps<RecipesStackParamList, "RecipeView">;

const RecipeView : React.FC<RecipeViewProps> = ({ route, navigation }) => {
    const colourScheme = useColorScheme();
    const theme = Colours[colourScheme ?? "light"];

  const { recipeId } = route.params;
  const db = useDatabase();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [editMode, setEditMode] = useState<boolean>(false);


  useEffect(() => {
    const parentNav = navigation.getParent();

    const focusUnsub = navigation.addListener("focus", () => {
        parentNav?.setOptions({
        headerRight: () => (
            <TouchableOpacity
                onPress={() => setEditMode(prev => !prev)}
                style={ styles.circle }
            >
                <Ionicons name="pencil-outline" size={22} color={Colours.primary} />
            </TouchableOpacity>
            ),
            });
        });

        const blurUnsub = navigation.addListener("blur", () => {
            parentNav?.setOptions({
            headerRight: undefined, // clear when leaving this screen
            });
        });

        return () => {
            focusUnsub();
            blurUnsub();
        };
    }, [navigation]);

    useEffect(() => {
        try {
            const result = db.getFirstSync<Recipe>("SELECT * FROM recipes WHERE id = ?;", recipeId);
            setRecipe(result);
        } catch (error) {
            console.error("Failed to fetch recipe:", error);
        }
    }, []);

      useLayoutEffect(() => {
        navigation.setOptions({
          headerTintColor: Colours.primary,
          headerBackTitle: "Recipes",
          headerStyle: {
            backgroundColor: theme.backgroundColour,
          },
        });
      }, [navigation]);

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
            <View style={ styles.recipeContainer }>
                <ThemedText title={true} style={{ marginBottom: 20, marginTop: 10}}>{recipe.name}</ThemedText>
                <IngredientsList recipeId={recipe.id} editMode={editMode}/>
                <InstructionsList />
            </View>
        </ScrollView>
      )}

    </ThemedView>
  );
};

const styles = StyleSheet.create({
  recipeContainer: {
    paddingHorizontal: 10,
    paddingVertical: 20,
  },
  circle: {
    width: 34,
    height: 34,
    borderRadius: 20,
    marginRight: 24,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
  }
})

export default RecipeView;
