import React, { useEffect, useMemo, useState } from "react";
import {
  StatusBar, Text, View, TextInput, TouchableOpacity, ScrollView,
  StyleSheet, LayoutAnimation, Platform, UIManager,
  ViewStyle, TextStyle
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import { fetchFaqThunk } from "../../features/faq/reducer/FaqThunk";
import type { FaqItem } from "../../features/faq/reducer/faqSlice";
import type { RootState, AppDispatch } from "../../store/store";

/*  Palette */
const UI = {
  bg: "#EAEFF5",
  surface: "#F2F5F9",
  chip: "#EDF2F7",
  text: "#1F2937",
  sub: "#6B7280",
  primary: "#5B84F8",
  dark: "#C1CADC",
  light: "#FFFFFF",
};

// Enable LayoutAnimation on Android
if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

/* Plus/Minus */
const PlusMinusIcon = ({ open }: { open: boolean }) => (
  <View style={[styles.pmWrap, styles.insetBox]}>
    <View style={styles.hBar} />
    {!open && <View style={styles.vBar} />}
  </View>
);

/* Intro block */
const IntroContent = () => (
  <View style={{ marginTop: 10, marginBottom: 14 }}>
    <View style={[styles.bigCard, styles.raisedBoxStrong]}>
      <Text style={styles.bigCardText}>
        Thanks For Your Interest In Teaching Your{"\n"}Courses Through Payil.
      </Text>
    </View>
    <View style={[styles.smallCard, styles.insetBox, { backgroundColor: UI.chip }]}>
      <Text style={styles.smallCardText}>
        Payil Is Designed To Help You Manage Your Courses Effectively.
      </Text>
    </View>
    <View style={[styles.smallCard, styles.insetBox, { backgroundColor: UI.chip }]}>
      <Text style={styles.smallCardText}>
        You Can Track Student Progress And Manage Assignments Easily.
      </Text>
    </View>
  </View>
);

const FAQ = () => {
  const dispatch = useDispatch<AppDispatch>();

  const faqData = useSelector((s: RootState) => s.faq.faqData);
  const loading = useSelector((s: RootState) => s.faq.loading);
  const error   = useSelector((s: RootState) => s.faq.error);

  const [search, setSearch] = useState("");
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  
  useEffect(() => {
    dispatch(fetchFaqThunk());
  }, [dispatch]);

  
  useEffect(() => {
    console.log(" faqData:", faqData, "loading:", loading, "error:", error);
  }, [faqData, loading, error]);

  const filteredFaqs = useMemo<FaqItem[]>(() => {
    const list = faqData ?? [];
    const q = search.trim().toLowerCase();
    if (!q) return list;
    return list.filter((i) =>
      i.question?.toLowerCase().includes(q) || i.category?.toLowerCase().includes(q)
    );
  }, [faqData, search]);

  const toggleExpand = (index: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <>
      <StatusBar backgroundColor={"#000"} barStyle="light-content" />
      {/* Changed from ImageBackground → View to remove warning */}
      <View style={styles.background}>
        <SafeAreaView style={styles.container}>
          <Text style={styles.header}>FAQ - Frequently Asked Questions</Text>

          <View style={[styles.searchBox, styles.insetBox]}>
            <TextInput
              placeholder="Search"
              placeholderTextColor="#98A2B3"
              style={styles.searchInput}
              value={search}
              onChangeText={setSearch}
            />
          </View>

          {loading && (
            <Text style={{ color: UI.sub, marginBottom: 10 }}>Loading…</Text>
          )}
          {error && (
            <Text style={{ color: "red", marginBottom: 10 }}>{error}</Text>
          )}

          <ScrollView
            style={{ marginBottom: 20 }}
            contentContainerStyle={{ paddingBottom: 20 }}
            showsVerticalScrollIndicator={false}
          >
            {/* fallback message if no FAQs */}
            {!loading && !error && filteredFaqs.length === 0 && (
              <Text style={{ textAlign: "center", color: UI.sub, marginTop: 12 }}>
                No FAQs found
              </Text>
            )}

            {filteredFaqs.map((item, index) => {
              const open = expandedIndex === index;
              return (
                <React.Fragment key={item.id ?? index}>
                  <View style={[styles.card, styles.insetBox]}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.cardText}>{item.question}</Text>
                    </View>
                    <TouchableOpacity activeOpacity={0.8} onPress={() => toggleExpand(index)}>
                      <PlusMinusIcon open={open} />
                    </TouchableOpacity>
                  </View>

                  {open &&
                    (item.question?.trim() === "Introduction" ? (
                      <IntroContent />
                    ) : (
                      <View style={[styles.answerWrap, styles.insetBox]}>
                        <Text style={styles.answerText}>{item.answer}</Text>
                      </View>
                    ))}
                </React.Fragment>
              );
            })}
          </ScrollView>

          <Text style={styles.helpTitle}>Need More Help?</Text>
          <Text style={styles.helpText}>
            If You Have Any Further Questions, Feel Free To Reach Out To Our Support Team.
          </Text>

          <TouchableOpacity style={[styles.supportBtn, styles.insetBox]} activeOpacity={0.9}>
            <Text style={styles.supportBtnText}>Contact Support</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </View>
    </>
  );
};

export default FAQ;

/* -------- styles -------- */
type Styles = {
  background: ViewStyle;
  container: ViewStyle;
  header: TextStyle;
  searchBox: ViewStyle;
  searchInput: TextStyle;
  card: ViewStyle;
  cardText: TextStyle;
  answerWrap: ViewStyle;
  answerText: TextStyle;
  pmWrap: ViewStyle;
  hBar: ViewStyle;
  vBar: ViewStyle;
  helpTitle: TextStyle;
  helpText: TextStyle;
  supportBtn: ViewStyle;
  supportBtnText: TextStyle;
  bigCard: ViewStyle;
  bigCardText: TextStyle;
  smallCard: ViewStyle;
  smallCardText: TextStyle;
  insetBox: ViewStyle;
  raisedBox: ViewStyle;
  raisedBoxStrong: ViewStyle;
};

const commonRaisedShadow = {
  shadowColor: UI.dark,
  shadowOffset: { width: 8, height: 8 },
  shadowOpacity: 1,
  shadowRadius: 10,
  ...(Platform.OS === "android" ? { elevation: 8 } : null),
};
const commonLightRim = {
  borderWidth: 1,
  borderColor: UI.light,
};

const styles = StyleSheet.create<Styles>({
  background: { flex: 1, backgroundColor: UI.bg },
  container: { flex: 1, paddingHorizontal: 16, paddingTop: 20 },
  header: { fontSize: 18, fontWeight: "800", color: UI.text, textAlign: "left", marginBottom: 16 },
  insetBox: {
    backgroundColor: UI.surface,
    borderRadius: 16,
    borderTopWidth: 2, borderLeftWidth: 2, borderBottomWidth: 2, borderRightWidth: 2,
    borderTopColor: UI.dark, borderLeftColor: UI.dark, borderBottomColor: UI.light, borderRightColor: UI.light,
  },
  raisedBox: { backgroundColor: UI.surface, borderRadius: 16, ...commonRaisedShadow, ...commonLightRim },
  raisedBoxStrong: {
    backgroundColor: UI.surface, borderRadius: 18,
    shadowColor: UI.dark, shadowOffset: { width: 12, height: 12 }, shadowOpacity: 1, shadowRadius: 14,
    ...(Platform.OS === "android" ? { elevation: 10 } : null), ...commonLightRim,
  },
  searchBox: { borderRadius: 16, paddingHorizontal: 16, paddingVertical: 12, marginBottom: 16 },
  searchInput: { fontSize: 14, color: UI.text },
  card: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    paddingVertical: 14, paddingHorizontal: 16, borderRadius: 16, marginBottom: 14, backgroundColor: UI.surface,
  },
  cardText: { fontSize: 14, color: UI.text, fontWeight: "600" },
  answerWrap: { borderRadius: 16, paddingVertical: 12, paddingHorizontal: 14, marginBottom: 14, backgroundColor: UI.surface },
  answerText: { fontSize: 13, color: UI.sub },
  pmWrap: { width: 40, height: 40, borderRadius: 12, alignItems: "center", justifyContent: "center", backgroundColor: UI.surface },
  hBar: { position: "absolute", width: 16, height: 2.6, borderRadius: 2, backgroundColor: "#6B7280" },
  vBar: { position: "absolute", width: 2.6, height: 16, borderRadius: 2, backgroundColor: "#6B7280" },
  helpTitle: { fontSize: 14, fontWeight: "800", color: UI.primary, textAlign: "center", marginTop: 6, marginBottom: 6 },
  helpText: { fontSize: 12, color: UI.sub, textAlign: "center", marginBottom: 14, paddingHorizontal: 20 },
  supportBtn: { borderRadius: 16, paddingVertical: 14, alignItems: "center", marginBottom: 20 },
  supportBtnText: { color: UI.text, fontSize: 14, fontWeight: "700" },
  bigCard: { padding: 16, marginBottom: 12, borderRadius: 18, backgroundColor: UI.surface },
  bigCardText: { fontSize: 16, lineHeight: 22, color: UI.sub, fontWeight: "800" },
  smallCard: { paddingVertical: 14, paddingHorizontal: 14, marginBottom: 12, borderRadius: 14 },
  smallCardText: { fontSize: 13, color: UI.sub, fontWeight: "600" },
});
