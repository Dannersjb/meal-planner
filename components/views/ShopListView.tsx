import {
  Modal,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  useColorScheme,
  View,
} from "react-native";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { useNavigation } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import DraggableFlatList, { RenderItemParams } from "react-native-draggable-flatlist";

import { useDatabase } from "@/providers/DatabaseProvider";
import ThemedView from "@/components/ThemedView";
import ThemedOverlayView from "@/components/ThemedOverlayView";
import AddShoppingItemForm from "@/components/forms/AddShoppingItemForm";
import ThemedText from "@/components/ThemedText";
import { Colours } from "@/constants/Globals";

type ShoppingItem = {
  id: number;
  item_name: string;
  item_order: number;
  quantity: number;
  is_checked: boolean;
};

const ShopListView = () => {
  const colourScheme = useColorScheme();
  const theme = Colours[colourScheme ?? "light"];

  const db = useDatabase();
  const navigation = useNavigation();

  const [shoppingList, setShoppingList] = useState<ShoppingItem[]>([]);
  const [modalVisible, setModalVisible] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={() => setModalVisible(true)} style={{ marginRight: 20 }}>
          <Ionicons name="add-circle" size={42} color="#FFF" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  useEffect(() => {
    try {
      const result = db.getAllSync<ShoppingItem>(
        "SELECT * FROM shopping_list ORDER BY item_order ASC;"
      );
      setShoppingList(result);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  }, []);

  const refreshShoppingList = () => {
    try {
      const result = db.getAllSync<ShoppingItem>(
        "SELECT * FROM shopping_list ORDER BY item_order ASC;"
      );
      setShoppingList(result);
    } catch (error) {
      console.error("Failed to fetch shopping list:", error);
    }
  };

  const toggleCheck = (key: number) => {
    try {
      setShoppingList((prev) =>
        prev.map((item) => {
          if (item.id === key) {
            const newChecked = !item.is_checked;
            // Update the database
            db.runSync("UPDATE shopping_list SET is_checked = ? WHERE id = ?", [newChecked, key]);
            return { ...item, is_checked: newChecked };
          }
          return item;
        })
      );
    } catch (error) {
      console.error("Failed to toggle check status:", error);
    }
  };

  return (
    <ThemedView>
      <DraggableFlatList
        data={shoppingList}
        style={{ paddingHorizontal: 20, marginVertical: 20 }}
        keyExtractor={(item) => item.id.toString()}
        activationDistance={0}
        onDragEnd={({ data }) => {
          setShoppingList(data);
          // Update the itemOrder in the database
          data.forEach((item, index) => {
            db.runSync("UPDATE shopping_list SET item_order = ? WHERE id = ?", [
              index + 1,
              item.id,
            ]);
          });
        }}
        renderItem={({ item, drag, isActive }: RenderItemParams<ShoppingItem>) => (
          <View
            style={[
              styles.shopItem,
              {
                backgroundColor: theme.backgroundColour,
                borderColor: theme.borderColour,
              },
            ]}
          >
            <TouchableOpacity style={styles.leftSide} onPress={() => toggleCheck(item.id)}>
              <Ionicons
                name={item.is_checked ? "checkmark-circle" : "ellipse-outline"}
                size={32}
                color={item.is_checked ? Colours.primary : theme.iconColour}
              />
              <ThemedText style={styles.name}>{item.item_name}</ThemedText>
            </TouchableOpacity>
            <View pointerEvents="box-only">
              <TouchableOpacity
                onPressIn={drag}
                disabled={isActive}
                style={[isActive && { backgroundColor: "#eee" }]}
              >
                <Ionicons name="reorder-three-outline" size={42} color={theme.iconColour} />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      <Modal
        visible={modalVisible}
        animationType="fade"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <ThemedOverlayView>
            <AddShoppingItemForm
              onItemAdded={() => {
                refreshShoppingList(); // refresh list
                setModalVisible(false); // close modal
              }}
            />
          </ThemedOverlayView>
        </TouchableWithoutFeedback>
      </Modal>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  shopItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderTopWidth: 1,
  },
  leftSide: {
    flexDirection: "row",
    alignItems: "center",
  },
  name: {
    fontSize: 18,
    marginLeft: 15,
    fontWeight: "bold",
  },
});

export default ShopListView;
