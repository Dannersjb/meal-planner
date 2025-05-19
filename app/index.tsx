import { createNativeStackNavigator } from "@react-navigation/native-stack";
import YearView from "@/components/views/YearView"; // year view
import WeekView from "@/components/views/WeekView"; // new screen for weeks

type PlanStackParamList = {
  YearView: {};
  WeekView: {
    monthIndex: number;
    monthName: string;
    year: number;
  };
};

const Stack = createNativeStackNavigator<PlanStackParamList>();

export default function HomeScreen() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="YearView"
        component={YearView}
        options={{
          headerShown: false, // or true if needed
          title: "", // make sure it's empty so it won't be reused
        }}
      />
      <Stack.Screen
        name="WeekView"
        component={WeekView}
        options={{
          title: "Week Overview",
          headerBackTitle: "", // (not effective in native-stack, but harmless)
        }}
      />
    </Stack.Navigator>
  );
}
