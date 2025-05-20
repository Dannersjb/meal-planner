import React, { useEffect, useLayoutEffect, useState } from "react";
import { ScrollView, View, StyleSheet, useColorScheme, Pressable, Alert } from "react-native";
import ThemedAccordion from "@/components/ThemedAccordion";
import ThemedText from "@/components/ThemedText";
import { formatDateWithOrdinal, getWeeksForMonth } from "@/constants/Helper";
import MealsList from "../MealsList";
import { Ionicons } from "@expo/vector-icons";
import { Colours } from "@/constants/Globals";
import { useDatabase } from "@/providers/DatabaseProvider";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

interface MealCountResult {
  mealCount: number;
}

type PlanStackParamList = {
  WeekView: {
    monthIndex: number;
    monthName: string;
    year: number;
  };
};

type WeekViewProps = NativeStackScreenProps<PlanStackParamList, "WeekView">;

const WeekView: React.FC<WeekViewProps> = ({ route, navigation }) => {
  const { monthIndex, monthName, year } = route.params;
  const weeks = getWeeksForMonth(monthIndex, year);
  const db = useDatabase();
  const [completionStatus, setCompletionStatus] = useState<boolean[]>([]);

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

  const checkWeekCompletion = (week: any[]): boolean => {
    return week.every((day) => {
      if (!day) return true; // skip null placeholders
      const formattedDate = day.toISOString().split("T")[0];

      // Check if a meal is set for the given date
      const result = db.getFirstSync<MealCountResult>(
        `SELECT COUNT(*) as mealCount 
         FROM meal_plan 
         WHERE scheduled_date = ?`,
        [formattedDate]
      );

      // Ensure result is not undefined before accessing 'mealCount'
      return result && result.mealCount > 0; // Return true if meal exists for the day
    });
  };

  useEffect(() => {
    const newCompletionStatus = weeks.map((week) => checkWeekCompletion(week));
    setCompletionStatus(newCompletionStatus); // Update completion status for each week
  }, []);

  const addWeekToShoppingList = (week: (Date | null)[]) => {
    const addedIngredients = new Set<string>();

    for (const day of week) {
      if (!day) continue;

      const scheduledDate = day.toISOString().split("T")[0];

      // Step 1: Get all recipe IDs for the day
      const recipes = db.getAllSync<{ recipe_id: number }>(
        `SELECT recipe_id FROM meal_plan WHERE scheduled_date = ?`,
        [scheduledDate]
      );

      for (const { recipe_id } of recipes) {
        // Step 2: Get ingredient names for the recipe
        const ingredients = db.getAllSync<{ name: string }>(
          `SELECT ingredients.name 
             FROM recipe_ingredients 
             JOIN ingredients ON ingredients.id = recipe_ingredients.ingredient_id 
             WHERE recipe_ingredients.recipe_id = ?`,
          [recipe_id]
        );

        for (const { name } of ingredients) {
          // Step 3: Only add if it's not already in shopping_list
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
      {weeks.map((week, weekIndex) => (
        <View key={weekIndex} style={styles.weekContainer}>
          <View style={styles.weekHeader}>
            <ThemedText style={[styles.weekTitle, { fontFamily: Colours.fontFamilyBold }]}>
              Week {weekIndex + 1}
            </ThemedText>
            <Ionicons
              name={completionStatus[weekIndex] ? "checkmark-circle" : "remove-circle"}
              size={36}
              color={completionStatus[weekIndex] ? Colours.primary : Colours.warning}
            />
          </View>

          {week.map((day, dayIndex) => {
            if (!day) return null; // skip null placeholders

            const formattedLabel = formatDateWithOrdinal(day);

            return (
              <ThemedAccordion
                key={dayIndex}
                sections={[
                  {
                    name: formattedLabel,
                    content: (
                      <View style={styles.mealContent}>
                        <MealsList scheduledDate={day.toISOString().split("T")[0]} />
                      </View>
                    ),
                  },
                ]}
                subSection={true}
                renderContent={(section) => section.content}
                defaultActiveSectionIndex={1}
              />
            );
          })}
          <Pressable
            style={[
              styles.addButton,
              { backgroundColor: theme.backgroundColour, borderColor: Colours.primary },
            ]}
            onPress={() => addWeekToShoppingList(week)}
          >
            <ThemedText style={{ fontSize: 18, paddingLeft: 5 }}>Add Shopping</ThemedText>
            <Ionicons name="cart" size={42} color={Colours.primary} />
          </Pressable>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  weekContainer: {
    marginBottom: 20,
  },
  weekHeader: {
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  weekTitle: {
    fontSize: 24,
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

export default WeekView;
