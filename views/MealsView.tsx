import React, { useEffect, useLayoutEffect, useState } from "react";
import { ScrollView, View, StyleSheet, useColorScheme, Pressable, Alert } from "react-native";
import ThemedAccordion from "@/components/ThemedAccordion";
import ThemedText from "@/components/ThemedText";
import { getOrdinal } from "@/constants/Helper";
import MealsList from "@/components/MealsList";
import { Ionicons } from "@expo/vector-icons";
import { Colours } from "@/constants/Globals";
import { useDatabase } from "@/providers/DatabaseProvider";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

interface MealCountResult {
  mealCount: number;
}

type PlanStackParamList = {
  MealsView: {
    week: string[];
    monthName: string;
    year: number;
  };
};

type MealsViewProps = NativeStackScreenProps<PlanStackParamList, "MealsView">;

const MealsView: React.FC<MealsViewProps> = ({ route, navigation }) => {
  const { week, monthName, year } = route.params;
  const parsedWeek = week.map((d) => d ? new Date(d) : null);
  const db = useDatabase();
  const colourScheme = useColorScheme();
  const theme = Colours[colourScheme ?? "light"];

  useLayoutEffect(() => {
    navigation.setOptions({
      title: `${monthName} ${year}`,
      headerBackButtonDisplayMode: "minimal",
      headerTintColor: Colours.primary,
      headerTitleStyle: {
        fontFamily: Colours.fontFamilyBold,
        fontSize: 22,
        color: theme.textColour,
      },
      headerStyle: {
        backgroundColor: theme.backgroundColour,
      },
    });
  }, [navigation, monthName, year]);

  const addWeekToShoppingList = (week: (Date | null)[]) => {
    const addedIngredients = new Set<string>();

    for (const day of week) {
      if (!day) continue;

      const scheduledDate = day.toISOString().split("T")[0];

      // Get all recipe IDs for the day
      const recipes = db.getAllSync<{ recipe_id: number }>(
        `SELECT recipe_id FROM meal_plan WHERE scheduled_date = ?`,
        [scheduledDate]
      );

      for (const { recipe_id } of recipes) {
        // Get ingredient names for the recipe
        const ingredients = db.getAllSync<{ name: string }>(
          `SELECT ingredients.name 
             FROM recipe_ingredients 
             JOIN ingredients ON ingredients.id = recipe_ingredients.ingredient_id 
             WHERE recipe_ingredients.recipe_id = ?`,
          [recipe_id]
        );

        for (const { name } of ingredients) {
          // Only add if it's not already in shopping_list
          if (!addedIngredients.has(name)) {
            const exists = db.getFirstSync<{ count: number }>(
              `SELECT COUNT(*) as count FROM shopping_list WHERE item_name = ?`,
              [name]
            );

            if (!exists || exists.count === 0) {
              db.runSync(
                `INSERT INTO shopping_list (item_name, item_order) 
                   VALUES (?, (SELECT IFNULL(MAX(item_order), 0) + 1 FROM shopping_list))`,
                [name]
              );
              addedIngredients.add(name);
            }
          }
        }
      }
    }
    Alert.alert("Shopping List Updated", "Ingredients added to your shopping list.");
  };

  return (
    <ScrollView
        contentContainerStyle={[styles.container, { backgroundColor: theme.backgroundColour }]}
      >
      {parsedWeek.map((day, dayIndex: React.Key | null | undefined) => {
        if (!day) return null; // skip null placeholders

        const formattedLabel = `${day.toLocaleDateString("en-US", { weekday: "short" })} ${day.getDate()}${getOrdinal(day)}`

        return (
          <View key={dayIndex} style={[styles.day, { borderBlockColor: theme.borderColour }]}> 
            <ThemedText style={{ width: 60 }}>{formattedLabel}</ThemedText>
            <View style={styles.mealContent}>
              <MealsList scheduledDate={day.toISOString().split("T")[0]} />
            </View>
          </View>
        );
      })}

        <Pressable
          style={[
            styles.addButton,
            { backgroundColor: theme.backgroundColour, borderColor: Colours.primary },
          ]}
          onPress={() => addWeekToShoppingList(parsedWeek)}
        >
          <ThemedText style={{ fontSize: 18, paddingLeft: 5 }}>Add Shopping</ThemedText>
          <Ionicons name="cart" size={42} color={Colours.primary} />
        </Pressable> 
    </ScrollView>
  )}
      
  
  
const styles = StyleSheet.create({
  day: {
    borderBottomWidth: 1,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  container: {
    padding: 20,
  },
  weekContainer: {
    marginBottom: 20,
  },
  mealContent: {
    borderRadius: 8,
  },
  addButton: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderWidth: 2,
    borderRadius: 10,
    marginTop: 20,
    marginBottom: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});

export default MealsView;
