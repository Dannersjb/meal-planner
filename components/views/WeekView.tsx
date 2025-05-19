import React, { useEffect, useLayoutEffect, useState } from "react";
import { ScrollView, View, StyleSheet, useColorScheme } from "react-native";
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
  const [completionStatus, setCompletionStatus] = useState<boolean[]>([]); // Array to track completion for each week

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
    fontWeight: "bold",
  },
  mealContent: {
    //padding: 10,
    borderRadius: 8,
  },
});

export default WeekView;
