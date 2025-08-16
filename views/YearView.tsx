import { ScrollView, StyleSheet } from "react-native";

import ThemedView from "@/components/ThemedView";
import ThemedAccordion from "@/components/ThemedAccordion";
import MonthView from "@/views/MonthView";
import { useEffect, useRef } from "react";
import { useFocusEffect, useNavigation } from "expo-router";
import { getWeeksForMonth } from "@/constants/Helper";
import React from "react";


const YearView = () => {
  const navigation = useNavigation<any>();
  const firstTabFocus = useRef(true); // track if Plan tab was clicked

  useFocusEffect(
    React.useCallback(() => {
      if (!firstTabFocus.current) return;

      const today = new Date();
      const monthIndex = today.getMonth();
      const monthName = today.toLocaleString("en-US", { month: "long" });
      const year = today.getFullYear();
      const weeks = getWeeksForMonth(monthIndex, year);

      const todayWeek = weeks.find((week) =>
        week.some(day => day && day.toDateString() === today.toDateString())
      );

      const weekStrings = todayWeek?.map(d => (d ? d.toISOString() : "")) ?? [];

      navigation.navigate("WeekView", { monthIndex, monthName, year });
      navigation.navigate("MealsView", { week: weekStrings, monthName, year });

      firstTabFocus.current = false; // only auto-navigate on tab click
    }, [navigation])
  );

  const yearSections = [
    { name: "2025", leapYear: false },
    { name: "2026", leapYear: false },
    { name: "2027", leapYear: false },
    { name: "2028", leapYear: true },
  ];

  const currentYear = new Date().getFullYear();
  const defaultActive = yearSections.findIndex((section) => section.name === String(currentYear));

  const renderYearContent = (section: { name: string; leapYear: boolean }) => (
    <MonthView year={Number(section.name)} leapYear={section.leapYear} />
  );

  return (
    <ThemedView style={styles.container}>
      <ScrollView>
        <ThemedAccordion
          sections={yearSections}
          renderContent={renderYearContent}
          defaultActiveSectionIndex={defaultActive}
        />
      </ScrollView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontWeight: "bold",
    fontSize: 20,
  },
});

export default YearView;
