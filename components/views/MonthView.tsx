import { TextStyle, StyleProp, StyleSheet, useColorScheme, View, Pressable } from "react-native";
import { Colours } from "@/constants/Globals";
import { Ionicons } from "@expo/vector-icons";
import ThemedText from "../ThemedText";
import { useEffect, useState } from "react";
import { useDatabase } from "@/providers/DatabaseProvider";
import { useNavigation } from "expo-router";

type MonthViewProps = React.PropsWithChildren<{
  leapYear: boolean;
  year: number;
  style?: StyleProp<TextStyle>;
}>;

const MonthView: React.FC<MonthViewProps> = ({ style, leapYear, year, ...props }) => {
  const colourScheme = useColorScheme();
  const navigation = useNavigation<any>();
  const theme = Colours[colourScheme ?? "light"];

  const db = useDatabase();
  const [completionStatus, setCompletionStatus] = useState<boolean[]>([]);

  const months = [
    { name: "January", days: 31, monthIndex: 0 },
    { name: "February", days: leapYear ? 29 : 28, monthIndex: 1 },
    { name: "March", days: 31, monthIndex: 2 },
    { name: "April", days: 30, monthIndex: 3 },
    { name: "May", days: 31, monthIndex: 4 },
    { name: "June", days: 30, monthIndex: 5 },
    { name: "July", days: 31, monthIndex: 6 },
    { name: "August", days: 31, monthIndex: 7 },
    { name: "September", days: 30, monthIndex: 8 },
    { name: "October", days: 31, monthIndex: 9 },
    { name: "November", days: 30, monthIndex: 10 },
    { name: "December", days: 31, monthIndex: 11 },
  ];

  useEffect(() => {
    Promise.all(
      months.map((month) => {
        const start = new Date(year, month.monthIndex, 1);
        // makes sure the whole day is included in the query
        const end = new Date(year, month.monthIndex + 1, 0, 23, 59, 59, 999);

        return db
          .getAllAsync<any>(
            `SELECT COUNT(DISTINCT scheduled_date) as count FROM meal_plan
           WHERE scheduled_date BETWEEN ? AND ?`,
            [start.toISOString(), end.toISOString()]
          )
          .then((result) => {
            const filledDays = result[0]?.count ?? 0;
            return filledDays >= month.days;
          })
          .catch(() => false);
      })
    ).then(setCompletionStatus);
  }, [leapYear]);

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: Colours.secondary,
        },
        style,
      ]}
      {...props}
    >
      {months.map((month, index) => {
        const isComplete = completionStatus[index] ?? false;
        return (
          <Pressable
            key={month.name}
            onPress={() =>
              navigation.navigate("WeekView", {
                monthIndex: month.monthIndex,
                monthName: month.name,
                year: year,
                days: month.days,
              })
            }
            style={[
              styles.month,
              {
                borderColor: isComplete ? Colours.primary : theme.backgroundColour,
                backgroundColor: theme.backgroundColour,
              },
              style,
            ]}
            {...props}
          >
            <ThemedText style={{ paddingVertical: 5 }}>{month.name}</ThemedText>
            <Ionicons
              style={{ paddingVertical: 5 }}
              name={isComplete ? "checkmark-circle" : "remove-circle"}
              size={36}
              color={isComplete ? Colours.primary : Colours.warning}
            />
          </Pressable>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: "center",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  month: {
    width: "31%",
    padding: 10,
    alignItems: "center",
    borderWidth: 2,
    borderRadius: 10,
    marginVertical: 5,
  },
  title: {
    fontWeight: "bold",
    fontSize: 20,
  },
});

export default MonthView;
