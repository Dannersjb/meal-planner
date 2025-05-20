import { StyleSheet, View } from "react-native";
import React from "react";
import ThemedText from "@/components/ThemedText";
import ThemedView from "@/components/ThemedView";

const SettingsScreen = () => {
  return (
    <ThemedView
      style={{
        paddingVertical: 60,
      }}
    >
      <ThemedText style={{ textAlign: "center", fontSize: 18 }}>No settings.</ThemedText>
    </ThemedView>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({});
