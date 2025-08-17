import React, { useEffect, useLayoutEffect, useState } from "react";
import { ScrollView, View, StyleSheet, useColorScheme, Pressable, Alert } from "react-native";
import ThemedText from "@/components/ThemedText";
import { getWeeksForMonth, getOrdinal } from "@/constants/Helper";
import { Ionicons } from "@expo/vector-icons";
import { Colours } from "@/constants/Globals";
import { useDatabase } from "@/providers/DatabaseProvider";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { PlanStackParamList } from "@/app/index";

interface MealCountResult {
  mealCount: number;
}

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
      if (!day) return true;
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

  return (
    <ScrollView
      contentContainerStyle={[styles.container, { backgroundColor: theme.backgroundColour }]}
    >
      {weeks.map((week, weekIndex) => {
        // Get the first and last valid date in this week
        const startDate = week.find((d) => d !== null);
        const endDate = [...week].reverse().find((d) => d !== null);

        // Format them nicely (you already have formatDateWithOrdinal helper)
        const weekRange =
        startDate && endDate
          ? `${startDate.toLocaleDateString("en-US", { weekday: "short" })} ${startDate.getDate()}${getOrdinal(startDate)} - ${endDate.toLocaleDateString("en-US", { weekday: "short" })} ${endDate.getDate()}${getOrdinal(endDate)}`
          : "";

        return (
          <Pressable
            key={weekIndex}
            onPress={() =>
              navigation.navigate("MealsView", {
                week: week.map((d) => d ? d.toISOString() : null),
                monthName: monthName,
                year: year,
              })
            }
          >
          <View key={weekIndex} style={styles.weekContainer}>
              <View style={styles.weekHeader}>
                <ThemedText style={[styles.weekTitle, { fontFamily: Colours.fontFamilyBold }]}>
                  Week {weekIndex + 1} <ThemedText style={styles.ordinal}> {weekRange ? ` ${weekRange}` : ""}</ThemedText>
                </ThemedText>
                <Ionicons
                  name={completionStatus[weekIndex] ? "checkmark-circle" : "remove-circle"}
                  size={36}
                  color={completionStatus[weekIndex] ? Colours.primary : Colours.warning}
                />
              </View>
            </View>
          </Pressable>
        )
      }
        
      )}
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
  ordinal: {
    fontSize: 16
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
