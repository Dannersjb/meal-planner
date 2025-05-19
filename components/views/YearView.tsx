import { ScrollView, StyleSheet } from "react-native";

import ThemedView from "@/components/ThemedView";
import ThemedAccordion from "@/components/ThemedAccordion";
import MonthView from "@/components/views/MonthView";

const YearView = () => {
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
