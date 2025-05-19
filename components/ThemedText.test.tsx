import React from "react";
import { render } from "@testing-library/react-native";
import ThemedText from "./ThemedText";
import { Colours } from "../constants/Globals";
import { useColorScheme } from "react-native";

// unmock the default jest.setup.js <View> component
jest.unmock("@/components/ThemedText");

describe("<ThemedText>", () => {
  it("renders with colours based on theme", () => {
    // test dark theme
    (useColorScheme as jest.Mock).mockReturnValue("dark");

    const darkTheme = render(<ThemedText testID="themed-view-dark" />);
    const lightView = darkTheme.getByTestId("themed-view-dark");

    expect(lightView.props.style).toEqual(
      expect.arrayContaining([expect.objectContaining({ color: Colours.dark.textColour })])
    );

    // test light theme
    (useColorScheme as jest.Mock).mockReturnValue("light");

    const lightTheme = render(<ThemedText testID="themed-view-light" />);
    const darkView = lightTheme.getByTestId("themed-view-light");

    expect(darkView.props.style).toEqual(
      expect.arrayContaining([expect.objectContaining({ color: Colours.light.textColour })])
    );
  });

  it("passes style prop and children correctly", () => {
    (useColorScheme as jest.Mock).mockReturnValue("light");

    const style = { margin: 5 };
    const { getByTestId } = render(<ThemedText testID="themed-view" style={style} />);

    const view = getByTestId("themed-view");
    expect(view.props.style).toEqual(expect.arrayContaining([expect.objectContaining(style)]));
  });
});
