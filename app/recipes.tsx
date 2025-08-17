import { createNativeStackNavigator } from "@react-navigation/native-stack";
import RecipeListView from "@/views/RecipeListView";
import RecipeView from "@/views/RecipeView";

export type RecipesStackParamList = {
  RecipeListView: {};
  RecipeView: {
    recipeId: number
  };
};

const Stack = createNativeStackNavigator<RecipesStackParamList>();

const RecipesScreen = () => {
  return (
    <Stack.Navigator>
       <Stack.Screen
        name="RecipeListView"
        component={RecipeListView}
        options={{
          headerShown: false,
          title: "",
        }}
      />
      <Stack.Screen
        name="RecipeView"
        component={RecipeView}
        options={{
          headerShown: false,
          title: "",
        }}
      />
    </Stack.Navigator>
  )
};

export default RecipesScreen;
