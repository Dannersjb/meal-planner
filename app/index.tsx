import { createNativeStackNavigator } from "@react-navigation/native-stack";
import YearView from "@/views/YearView";
import WeekView from "@/views/WeekView";
import MealsView from "@/views/MealsView"

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
          headerShown: false,
          title: "",
        }}
      />
      <Stack.Screen
        name="WeekView"
        component={WeekView}
        options={{
          title: "Month's Weeks",
          headerBackTitle: "",
        }}
      />
      <Stack.Screen
        name="MealsView"
        component={MealsView}
        options={{
          title: "Week Overview",
          headerBackTitle: "",
        }}
      />
    </Stack.Navigator>
  );
}
