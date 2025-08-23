import React from "react";
import { render, fireEvent, act } from "@testing-library/react-native";
import ShopListView from "@/views/ShopListView";
import { useDatabase } from "@/providers/DatabaseProvider";

jest.mock("@react-navigation/native", () => ({
  ...jest.requireActual("@react-navigation/native"),
  useFocusEffect: jest.fn(), 
}));

jest.mock("@/providers/DatabaseProvider");

describe("<ShopListView>", () => {
  const mockGetAllSync = jest.fn();
  const mockRunSync = jest.fn();

  beforeEach(() => {
    mockGetAllSync.mockReset();
    mockRunSync.mockReset();

    // Set the return value of the mocked useDatabase hook
    (useDatabase as jest.Mock).mockReturnValue({
      getAllSync: mockGetAllSync,
      runSync: mockRunSync,
    });
  });

  it("displays correct message when the shop list is empty", () => {
    // return empty list before render
    mockGetAllSync.mockReturnValue([]);

    const shopList = render(<ShopListView />);
    expect(shopList.getByText("No shopping.")).toBeTruthy();
  });

  it("Shopping list gets populated and toggles checkboxes", async () => {
    const mockShoplist = [
      { id: 1, item_name: "Apples", item_order: 1, quantity: 1, is_checked: false },
      { id: 2, item_name: "Bananas", item_order: 2, quantity: 1, is_checked: false },
    ];

    mockGetAllSync.mockReturnValue(mockShoplist);
    mockRunSync.mockImplementation(() => {
      mockShoplist[0].is_checked = true;
    });

    const shopList = render(<ShopListView />);
    expect(shopList.getByText("Apples")).toBeTruthy();
    expect(shopList.getByText("Bananas")).toBeTruthy();

    // check there are two unchecked boxes
    const checkboxes = shopList.getAllByText("ellipse-outline");
    expect(checkboxes).toHaveLength(2);
    expect(shopList.queryByText("checkmark-circle")).toBeNull();

    // fake press first checkbox and db update
    fireEvent.press(checkboxes[0]);
    mockShoplist[0].is_checked = true;
    expect(shopList.getByText("checkmark-circle")).toBeTruthy();
  });
});
