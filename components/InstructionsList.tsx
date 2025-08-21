import {
  View,
  TextStyle,
  StyleSheet,
  StyleProp,
  useColorScheme,
  Pressable,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";
import { Colours } from "@/constants/Globals";
import React, { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useDatabase } from "@/providers/DatabaseProvider";
import ThemedText from "@/components/ThemedText";
import ThemedOverlayView from "@/components/ThemedOverlayView";
import AddInstructionForm from "./forms/AddInstructionForm";

type InstructionsListProps = React.PropsWithChildren<{
  recipeId: number | null;
  editMode: boolean;
  style?: StyleProp<TextStyle>;
}>;

type Instruction = {
  id: number;
  description: string;
  item_order: number;
};

const InstructionsList: React.FC<InstructionsListProps> = ({ style, recipeId, editMode }) => {
  const db = useDatabase();
  const colourScheme = useColorScheme();
  const theme = Colours[colourScheme ?? "light"];
  const [instructionList, setInstructionList] = useState<Instruction[]>([]);
  const [instructionModalVisible, setInstructionModalVisible] = useState(false);

  useEffect(() => {
    try {
      const result = db.getAllSync<Instruction>(
        `SELECT id, description, item_order
          FROM recipe_instructions
          WHERE recipe_id = ?;`,
        [recipeId]
      );
      setInstructionList(result);
    } catch (error) {
      console.error(`Failed to fetch recipe instructions for recipe_id ${recipeId}: `, error);
    }
  }, []);

  const refreshInstructionsList = () => {
    try {
      const result = db.getAllSync<Instruction>(
        `SELECT id, description, item_order
          FROM recipe_instructions
          WHERE recipe_id = ?;`,
        [recipeId]
      );
      setInstructionList(result);
    } catch (error) {
      console.error(`Failed to fetch recipe instructions for recipe_id ${recipeId}: `, error);
    }
  };

  const deleteIngredient = (id: number) => {
    try {
      db.runSync(`DELETE FROM recipe_instructions WHERE id = ?;`, [id]);
      refreshInstructionsList();
    } catch (error) {
      console.error("Failed to delete ingredient:", error);
    }
  };

  return (
    <View
      style={[
        {
          backgroundColor: Colours.secondary,
          padding: 20,
        },
        style,
      ]}
    >
      <ThemedText style={{ fontSize: 21, marginBottom: 10 }}>Method</ThemedText>
      <View style={[styles.ingredient, { backgroundColor: theme.backgroundColour }]}>
        { instructionList.length === 0 ? (
          <ThemedText>No Instructions.</ThemedText>
        ) : (
          <>
          {instructionList.map((item, index) => (
          <View key={item.id} style={{ flexDirection: "row", alignItems: "center", borderBottomWidth: 1, borderColor: theme.borderColour }}>
            <ThemedText style={{ paddingVertical: 7, fontSize: 16}}>
                {`${index + 1}. ${item.description}`}
            </ThemedText>
            { editMode && (
              <Pressable
                style={styles.deleteButtonContainer}
                onPress={() => deleteIngredient(item.id)}>
                  <Ionicons name="trash" size={22} color={Colours.danger} />
              </Pressable>
            )}
          </View>
        ))}
        </>
        )
        }
      </View>
      { editMode && (
        <Pressable
          style={[
            styles.addButton,
            { backgroundColor: theme.backgroundColour, borderColor: Colours.primary },
          ]}
          onPress={() => setInstructionModalVisible(true)}
        >
          <ThemedText style={{ fontSize: 18, paddingLeft: 5 }}>Add Instruction</ThemedText>
          <Ionicons name="add-circle" size={42} color={Colours.primary} />
        </Pressable>
      )}

      <Modal
        visible={instructionModalVisible}
        animationType="fade"
        transparent
        onRequestClose={() => setInstructionModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setInstructionModalVisible(false)}>
          <ThemedOverlayView>
            <AddInstructionForm
              onItemAdded={() => {
                setInstructionModalVisible(false); // close modal
                refreshInstructionsList(); // update the list render
              }}
              recipeId={recipeId}
            />
          </ThemedOverlayView>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  addButton: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderWidth: 2,
    borderRadius: 10,
    marginVertical: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  ingredient: {
    padding: 20,
    borderRadius: 10,
    fontSize: 20,
    marginVertical: 5,
    fontWeight: "bold",
  },
  deleteButtonContainer: {
    justifyContent: "center",
    alignItems: "flex-end",
    flex: 1,
  },
  deleteButton: {
    backgroundColor: Colours.danger,
    color: '#fff',
    padding: 20,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
  }
});

export default InstructionsList;
