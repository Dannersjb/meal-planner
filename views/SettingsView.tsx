import { Alert, Pressable, StyleSheet } from "react-native";
import ThemedText from "@/components/ThemedText";
import ThemedView from "@/components/ThemedView";
import { Ionicons } from "@expo/vector-icons";
import { useDatabase } from "@/providers/DatabaseProvider";

const SettingsView = () => {
  const db = useDatabase();

  const deleteData = () => {
    try {
      db.runSync("DELETE FROM shopping_list;");
      db.runSync("DELETE FROM ingredients;");
      db.runSync("DELETE FROM recipes;");
      db.runSync("DELETE FROM recipe_ingredients;");
      db.runSync("DELETE FROM meal_plan;");
      db.runSync("DELETE FROM sqlite_sequence WHERE name = 'shopping_list';");
      Alert.alert("Success", "All data has been cleared.");
    } catch (error) {
      console.error("Failed to delete data:", error);
      Alert.alert("Error deleting data.");
    }
  };

  const confirmDeleteData = () => {
    Alert.alert("Clear data", "Are you sure you want to clear all data?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Clear",
        style: "destructive",
        onPress: () => {
          deleteData();
        },
      },
    ]);
  };

  return (
    <ThemedView>
      <Pressable style={[styles.deleteButton]} onPress={confirmDeleteData}>
        <ThemedText style={{ fontSize: 18, color: "#D94A38" }}>Clear Data</ThemedText>
        <Ionicons name="trash-outline" size={36} color="#D94A38" />
      </Pressable>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  deleteButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    marginTop: 30,
    marginHorizontal: 20,
    borderWidth: 2,
    borderColor: "#D94A38",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});

export default SettingsView;
