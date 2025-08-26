import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import MealsList from "@/components/MealsList"; // adjust path
import { useDatabase } from "@/providers/DatabaseProvider";
import { useNavigation } from "expo-router";

// mock DB provider
jest.mock("@/providers/DatabaseProvider", () => ({
  useDatabase: jest.fn(),
}));

// mock navigation
jest.mock("expo-router", () => ({
  useNavigation: jest.fn(),
}));

jest.mock("@/components/forms/AddMealForm", () => (props: any) => {
  const React = require("react");
  const { Text } = require("react-native");

  return <Text>Add Meal</Text>;
});

describe("<MealsList />", () => {
  const mockGetAllSync = jest.fn();
  const mockNavigate = jest.fn();

  beforeEach(() => {
    (useDatabase as jest.Mock).mockReturnValue({
      getAllSync: mockGetAllSync,
    });
    (useNavigation as jest.Mock).mockReturnValue({
      navigate: mockNavigate,
    });
    jest.clearAllMocks();
  });

  it("renders recipes from the database", () => {
    mockGetAllSync.mockReturnValueOnce([
      { id: 1, name: "Pizza" },
      { id: 2, name: "Pasta" },
    ]);

    const { getByText } = render(<MealsList scheduledDate="2025-08-24" />);

    expect(getByText("Pizza")).toBeTruthy();
    expect(getByText("Pasta")).toBeTruthy();
  });

  it("navigates when pressing a recipe", () => {
    mockGetAllSync.mockReturnValueOnce([{ id: 1, name: "Pizza" }]);

    const { getByText } = render(<MealsList scheduledDate="2025-08-24" />);

    fireEvent.press(getByText("Pizza"));
    expect(mockNavigate).toHaveBeenCalledWith("recipes", {
      screen: "RecipeView",
      params: { recipeId: 1 },
    });
  });

  it("opens modal when pressing add button", () => {
    mockGetAllSync.mockReturnValueOnce([
      { id: 1, name: "Pizza" },
      { id: 2, name: "Pasta" },
    ]);

    const { getByTestId, queryByText } = render(<MealsList scheduledDate="2025-08-24" />);

    expect(queryByText(/add meal/i)).toBeNull();
    const addButton = getByTestId("add-meal-button");

    fireEvent.press(addButton);

    expect(queryByText(/add meal/i)).toBeTruthy();
  });
});
