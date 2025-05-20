import { useColorScheme, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import React from "react";
import { Tabs } from "expo-router";
import { Colours } from "@/constants/Globals";
import { useFonts } from "expo-font";

import { DatabaseProvider } from "@/providers/DatabaseProvider";

import ChefsHatIcon from "@/components/Icons/ChefsHatIcon";
import CalendarIcon from "@/components/Icons/CalendarIcon";
import CogIcon from "@/components/Icons/CogIcon";
import ListIcon from "@/components/Icons/ListIcon";
import { StatusBar } from "expo-status-bar";

const RootLayout = () => {
  const colourScheme = useColorScheme();
  // use this to conditionally style dark or light mode
  const theme = Colours[colourScheme ?? "light"];
  const [fontsLoaded] = useFonts({
    "Comfortaa-Regular": require("../assets/fonts/Comfortaa/static/Comfortaa-Regular.ttf"),
    "Comfortaa-Bold": require("../assets/fonts/Comfortaa/static/Comfortaa-Bold.ttf"),
  });

  // wait for fonts to load before rendering app
  if (!fontsLoaded) {
    return <View />;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: theme.backgroundColour }}>
      <DatabaseProvider>
        {/* this will update the status bar (top text on phone eg time, battery etc) based on the colour theme 
            I always want it to be green so I'm hard coding it to light*/}
        <StatusBar style="light" />
        <Tabs
          screenOptions={{
            headerStyle: {
              backgroundColor: Colours.primary,
              height: 130,
            },
            headerTitleStyle: {
              fontFamily: Colours.fontFamily,
              color: "#FFF",
              fontSize: 32,
            },
            headerTitleAlign: "left",
            tabBarStyle: {
              backgroundColor: Colours.primary,
              height: 145,
              paddingHorizontal: 10,
              borderTopRightRadius: 25,
              borderTopLeftRadius: 25,
            },
            tabBarIconStyle: {
              height: 80,
              marginBottom: -6,
              marginTop: 3,
            },
            tabBarLabelStyle: {
              fontFamily: Colours.fontFamily,
              fontSize: 18,
              flex: 1,
            },
            tabBarActiveTintColor: "#FFF",
            tabBarInactiveTintColor: Colours.secondary,
          }}
        >
          <Tabs.Screen
            name="index"
            options={{
              title: "Plan",
              headerTitle: "Meal Calendar",
              tabBarIcon: ({ focused }) => (
                <CalendarIcon
                  stroke={focused ? "#FFF" : Colours.secondary}
                  fill={focused ? "#FFF" : Colours.secondary}
                />
              ),
            }}
          />
          <Tabs.Screen
            name="recipes"
            options={{
              title: "Recipes",
              headerTitle: "My Recipes",
              tabBarIcon: ({ focused }) => (
                <ChefsHatIcon stroke={focused ? "#FFF" : Colours.secondary} />
              ),
            }}
          />
          <Tabs.Screen
            name="shopList"
            options={{
              title: "Shop",
              headerTitle: "Shopping List",
              tabBarIcon: ({ focused }) => (
                <ListIcon stroke={focused ? "#FFF" : Colours.secondary} />
              ),
            }}
          />
          <Tabs.Screen
            name="settings"
            options={{
              title: "Settings",
              tabBarIcon: ({ focused }) => (
                <CogIcon
                  stroke={focused ? "#FFF" : Colours.secondary}
                  fill={focused ? "#FFF" : Colours.secondary}
                />
              ),
            }}
          />
        </Tabs>
      </DatabaseProvider>
    </GestureHandlerRootView>
  );
};

export default RootLayout;
