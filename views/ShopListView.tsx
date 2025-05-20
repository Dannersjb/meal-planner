import {
  Alert,
  Modal,
  Pressable,
  TouchableOpacity,
  TouchableWithoutFeedback,
  useColorScheme,
  StyleSheet,
  View,
  FlatList,
} from "react-native";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { useFocusEffect, useNavigation } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

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
  const [shopModalVisible, setShopModalVisible] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      // refresh shop list when tab is focused
      refreshShoppingList();
    }, [])
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={() => setShopModalVisible(true)} style={{ marginRight: 20 }}>
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

  const deleteShopping = () => {
    try {
      db.runSync("DELETE FROM shopping_list WHERE is_checked = true;");
      refreshShoppingList();
    } catch (error) {
      console.error("Failed to delete shopping items:", error);
      Alert.alert("Error deleting shopping items.");
    }
  };

  const confirmDeleteChecked = () => {
    Alert.alert(
      "Delete Checked Items",
      "Are you sure you want to remove all checked shopping items?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            deleteShopping();
          },
        },
      ]
    );
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
      {shoppingList.length === 0 ? (
        <View
          style={{
            paddingVertical: 60,
          }}
        >
          <ThemedText style={{ textAlign: "center", fontSize: 18 }}>No shopping.</ThemedText>
        </View>
      ) : (
        <>
          <FlatList<ShoppingItem>
            data={shoppingList}
            style={{ paddingHorizontal: 20, marginTop: 20, marginBottom: 5 }}
            keyExtractor={(item: { id: { toString: () => any } }) => item.id.toString()}
            renderItem={({ item }) => {
              const isFirst = item.id === shoppingList[0]?.id;

              return (
                <View
                  style={[
                    styles.shopItem,
                    {
                      backgroundColor: theme.backgroundColour,
                      borderColor: theme.borderColour,
                      borderTopWidth: isFirst ? 1 : 0,
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
                </View>
              );
            }}
          />
          <Pressable style={[styles.deleteButton]} onPress={confirmDeleteChecked}>
            <ThemedText style={{ fontSize: 18, color: "#D94A38" }}>Delete Checked</ThemedText>
            <Ionicons name="trash-outline" size={36} color="#D94A38" />
          </Pressable>
        </>
      )}
      <Modal
        visible={shopModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setShopModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setShopModalVisible(false)}>
          <ThemedOverlayView>
            <AddShoppingItemForm
              onItemAdded={() => {
                refreshShoppingList(); // refresh list
                setShopModalVisible(false); // close modal
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
    borderBottomWidth: 1,
  },
  leftSide: {
    flexDirection: "row",
    alignItems: "center",
  },
  deleteButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    margin: 20,
    borderWidth: 2,
    borderColor: "#D94A38",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  name: {
    fontSize: 18,
    marginLeft: 15,
  },
});

export default ShopListView;
