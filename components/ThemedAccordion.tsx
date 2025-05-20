import { useColorScheme, View, StyleSheet } from "react-native";
import { Colours } from "@/constants/Globals";
import { Ionicons } from "@expo/vector-icons";
import Accordion, { AccordionProps } from "react-native-collapsible/Accordion";
import ThemedText from "@/components/ThemedText";
import { useEffect, useState } from "react";

const ThemedAccordion = <T extends { name: string }>({
  renderHeader,
  renderContent,
  subSection = false,
  defaultActiveSectionIndex,
  ...props
}: Omit<AccordionProps<T>, "renderHeader" | "renderContent" | "activeSections" | "onChange"> & {
  renderHeader?: AccordionProps<T>["renderHeader"];
  renderContent?: AccordionProps<T>["renderContent"];
  subSection?: boolean;
  defaultActiveSectionIndex?: number | null;
}) => {
  const colourScheme = useColorScheme();
  const theme = Colours[colourScheme ?? "light"];

  const [activeSections, setActiveSections] = useState<number[]>([]);

  useEffect(() => {
    if (props.sections && props.sections.length > 0 && renderContent) {
      if (typeof defaultActiveSectionIndex === "number") {
        setActiveSections([defaultActiveSectionIndex]);
      } else {
        setActiveSections([]);
      }
    }
  }, [props.sections, renderContent, defaultActiveSectionIndex]);

  const defaultRenderHeader = (section: T, _index: number, isActive: boolean) => {
    return (
      <View
        style={[
          styles.header,
          {
            backgroundColor: theme.backgroundColour,
            borderColor: theme.borderColour,
          },
        ]}
      >
        <ThemedText
          style={[
            subSection ? styles.subTitle : styles.title,
            { fontFamily: Colours.fontFamilyBold },
          ]}
        >
          {section.name}
        </ThemedText>
        <View style={{ transform: [{ rotate: isActive ? "0deg" : "270deg" }] }}>
          <Ionicons name="chevron-down" size={32} color={Colours.primary} />
        </View>
      </View>
    );
  };

  // return nothing if renderContent is not set
  if (!renderContent) return null;

  return (
    <View style={!subSection && { paddingHorizontal: 20, marginVertical: 20 }}>
      <View style={{ borderBottomWidth: 1, borderColor: theme.borderColour }}>
        <Accordion
          {...props}
          activeSections={activeSections}
          onChange={setActiveSections}
          renderHeader={renderHeader ?? defaultRenderHeader}
          renderContent={renderContent}
          underlayColor="transparent"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    padding: 16,
    borderTopWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  subTitle: {
    fontSize: 18,
  },
  title: {
    fontSize: 22,
    marginLeft: 15,
  },
});

export default ThemedAccordion;
