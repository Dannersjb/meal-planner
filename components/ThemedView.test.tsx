import React from "react";
import { render } from "@testing-library/react-native";
import ThemedView from "@/components/ThemedView";
import { Colours } from "@/constants/Globals";
import { useColorScheme } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// unmock the default jest.setup.js <View> component
jest.unmock("@/components/ThemedView");

// Mock useSafeAreaInsets
jest.mock("react-native-safe-area-context", () => ({
  useSafeAreaInsets: jest.fn(),
}));

describe("<ThemedView>", () => {
  it("renders with background color based on light theme", () => {
    (useColorScheme as jest.Mock).mockReturnValue("light");

    const { getByTestId } = render(<ThemedView testID="themed-view" />);

    const view = getByTestId("themed-view");
    expect(view.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ backgroundColor: Colours.light.backgroundColour }),
      ])
    );
  });

  it("renders with background color based on dark theme", () => {
    (useColorScheme as jest.Mock).mockReturnValue("dark");

    const { getByTestId } = render(<ThemedView testID="themed-view" />);

    const view = getByTestId("themed-view");
    expect(view.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ backgroundColor: Colours.dark.backgroundColour }),
      ])
    );
  });

  it("applies safe area insets padding when safe=true", () => {
    (useColorScheme as jest.Mock).mockReturnValue("light");
    (useSafeAreaInsets as jest.Mock).mockReturnValue({
      top: 10,
      bottom: 20,
      left: 0,
      right: 0,
    });

    const { getByTestId } = render(<ThemedView testID="themed-view" safe />);

    const view = getByTestId("themed-view");
    expect(view.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          backgroundColor: Colours.light.backgroundColour,
          paddingTop: 10,
          paddingBottom: 20,
        }),
      ])
    );
  });

  it("passes style prop and children correctly", () => {
    (useColorScheme as jest.Mock).mockReturnValue("light");

    const style = { margin: 5 };
    const { getByTestId } = render(<ThemedView testID="themed-view" style={style} />);

    const view = getByTestId("themed-view");
    expect(view.props.style).toEqual(expect.arrayContaining([expect.objectContaining(style)]));
  });
});
