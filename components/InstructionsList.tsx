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
          WHERE recipe_id = ?
          ORDER BY item_order ASC;`,
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
          WHERE recipe_id = ?
          ORDER BY item_order ASC;`,
        [recipeId]
      );
      setInstructionList(result);
    } catch (error) {
      console.error(`Failed to fetch recipe instructions for recipe_id ${recipeId}: `, error);
    }
  };

  const deleteInstruction = (id: number) => {
    try {
      db.runSync(`DELETE FROM recipe_instructions WHERE id = ?;`, [id]);
      refreshInstructionsList();
    } catch (error) {
      console.error("Failed to delete instruction:", error);
    }
  };

  const moveItem = (index: number, direction: "up" | "down") => {
  const targetIndex = direction === "up" ? index - 1 : index + 1;

  // boundary check
  if (targetIndex < 0 || targetIndex >= instructionList.length) return;

  const currentItem = instructionList[index];
  const targetItem = instructionList[targetIndex];

  try {
    db.runSync("BEGIN TRANSACTION;");

    // swap item_order values
    db.runSync(
      `UPDATE recipe_instructions SET item_order = ? WHERE id = ?;`,
      [targetItem.item_order, currentItem.id]
    );

    db.runSync(
      `UPDATE recipe_instructions SET item_order = ? WHERE id = ?;`,
      [currentItem.item_order, targetItem.id]
    );

    db.runSync("COMMIT;");

    refreshInstructionsList(); // reload from DB
  } catch (error) {
    db.runSync("ROLLBACK;");
    console.error("Failed to reorder instruction:", error);
  }
};

  return (
    <View
      style={[
        {
          backgroundColor: Colours.secondary,
          padding: 20,
          marginTop: 20
        },
        style,
      ]}
    >
      <ThemedText style={{ fontSize: 21, marginBottom: 10 }}>Method</ThemedText>
      <View style={[styles.instruction, { backgroundColor: theme.backgroundColour }]}>
        { instructionList.length === 0 ? (
          <ThemedText>No Instructions.</ThemedText>
        ) : (
          <>
          {instructionList.map((item, index) => (
          <View key={item.id} style={{ flexDirection: "row", alignItems: "flex-start", borderBottomWidth: 1, borderColor: theme.borderColour }}>
            <ThemedText style={{ paddingVertical: 10, fontFamily: Colours.fontFamilyBold, fontSize: 16}}>
                {`${index + 1}.`}
            </ThemedText>
            <ThemedText style={{ flex: 1, flexShrink: 1, marginLeft: 7, paddingVertical: 10, textAlign: "left", fontSize: 16}}>{item.description}</ThemedText>
            { editMode && (
              <View style={styles.editButtonsContainer}>
                <Pressable onPress={() => deleteInstruction(item.id)}>
                    <Ionicons style={styles.button} name="trash" size={24} color={Colours.danger} />
                </Pressable>
                <Pressable onPress={() => moveItem(index, "up")}>
                  <Ionicons style={styles.button} name="chevron-up"  size={24} color={Colours.primary} />
                </Pressable>
                <Pressable onPress={() => moveItem(index, "down")}>
                    <Ionicons name="chevron-down" size={24} color={Colours.primary} />
                </Pressable>
              </View>
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
  instruction: {
    padding: 20,
    borderRadius: 10,
    fontSize: 20,
    marginVertical: 10,
    fontWeight: "bold",
  },
  editButtonsContainer: {
    flexDirection: "row",
    paddingVertical: 10,
    flexShrink: 0,
  },
  button: {
    marginRight: 7,
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
