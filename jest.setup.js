global.setImmediate = (cb) => setTimeout(cb, 0);

jest.mock("@/providers/DatabaseProvider", () => ({
  useDatabase: jest.fn(),
}));

jest.mock("expo-router", () => ({
  useNavigation: () => ({
    setOptions: jest.fn(),
  }),
}));

jest.mock("@/components/IngredientsList", () => "IngredientsList");
jest.mock("@/components/ThemedView", () => {
  const React = require("react");
  const { View } = require("react-native");
  return ({ children }: any) => <View>{children}</View>;
});
jest.mock(
  "@/components/ThemedOverlayView",
  () =>
    ({ children }: any) =>
      children
);
jest.mock("@/components/forms/AddRecipeForm", () => "AddRecipeForm");
jest.mock("@/components/ThemedText", () => {
  const React = require("react");
  const { Text } = require("react-native");
  return ({ children }: any) => <Text>{children}</Text>;
});
jest.mock("@/components/ThemedAccordion", () => "ThemedAccordion");
jest.mock("react-native-draggable-flatlist", () => {
  const { View } = require("react-native");
  const React = require("react");
  return ({ data, renderItem, keyExtractor }) => (
    <>
      {data.map((item, index) => {
        const key = keyExtractor ? keyExtractor(item, index) : item.id?.toString() ?? String(index);
        const rendered = renderItem({
          item,
          index,
          drag: jest.fn(),
          isActive: false,
        });

        return <View key={key}>{rendered}</View>;
      })}
    </>
  );
});

jest.mock("@expo/vector-icons", () => {
  const React = require("react");
  return {
    Ionicons: ({ name, size, color }) => {
      const { Text } = require("react-native");
      return <Text>{name}</Text>; // just render the icon name as text
    },
  };
});
