import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { Image } from "react-native";
import {
  StatusBar,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  StyleSheet,
  LayoutAnimation,
  Platform,
  UIManager,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import { selectFaq } from "~/features/faq/reducers/selectors";
import { getFaqThunk } from "~/features/faq/reducers/thunks";
import { getStudentData } from "~/utils/storage";

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

if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const PlusMinusIcon = ({ open }: { open: boolean }) => (
  <View style={[styles.pmWrap, styles.insetBox]}>
    <View style={styles.hBar} />
    {!open && <View style={styles.vBar} />}
  </View>
);

const faqs = [
  {
    title: "Introduction",
    description:
      "Thanks For Your Interest In Teaching Your Courses Through Payil.\n\nPayil is designed to help you manage your courses effectively and track student progress with ease.",
  },
  {
    title: "How To Access Payil?",
    description:
      "You can access Payil via the official website or mobile application provided by your institute.",
  },
  {
    title: "About Payil Dashboard",
    description:
      "The dashboard provides an overview of your courses, student activities, and assignments.",
  },
  {
    title: "About Payil Courses",
    description:
      "You can add, edit, and manage multiple courses seamlessly in Payil.",
  },
  {
    title: "How To Access Payil Subject",
    description:
      "Navigate to the course section, then click on a subject to view its details and assignments.",
  },
  {
    title: "How to add a new course?",
    description:
      "Go to your dashboard → select 'Add Course' → enter details → save.",
  },
];

const FAQ = () => {
  const [search, setSearch] = useState("");
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const navigation = useNavigation<any>();
  const dispatch = useDispatch<any>();
  const selectData = useSelector(selectFaq)?.data;
  const [student, setStudent] = useState<any>(null);

  useEffect(() => {
    (async () => {
      const data = await getStudentData();
      setStudent(data);
    })();
  }, []);

  const getFaqData = async () => {
    await dispatch(
      getFaqThunk({
        instituteId: student?.institute_id?.uuid,
        branchid: student?.branch_id?.uuid,
      })
    );
  };

  useEffect(() => {
    if (student) {
      getFaqData();
    }
  }, [dispatch, student]);

  const toggleExpand = (index: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const allFaqs = [
    ...(selectData ?? []),
    ...faqs,
  ];

  return (
    <>
      <StatusBar backgroundColor={"#000"} barStyle="light-content" />
      <ImageBackground style={styles.background} resizeMode="cover">
        <SafeAreaView style={styles.container}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 3 }}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Image
                source={require("../../assets/profile/back.png")}
                style={styles.backbutton}
              />
            </TouchableOpacity>
            <Text style={styles.header}>FAQ - Frequently Asked Questions</Text>
          </View>

          <View style={[styles.searchBox, styles.insetBox]}>
            <TextInput
              placeholder="Search"
              placeholderTextColor="#98A2B3"
              style={styles.searchInput}
              value={search}
              onChangeText={setSearch}
            />
          </View>

          <ScrollView
            style={{ marginBottom: 20 }}
            contentContainerStyle={{ paddingBottom: 20 }}
            showsVerticalScrollIndicator={false}
          >
            {allFaqs
              ?.filter((i: any) =>
                (i.title || i).toLowerCase().includes(search.toLowerCase())
              )
              .map((item: any, index: number) => {
                const title = item.title || item;
                const description = item.description || "";
                const open = expandedIndex === index;

                return (
                  <React.Fragment key={index}>
                    <View style={[styles.card, styles.insetBox]}>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.cardText}>{title}</Text>
                      </View>
                      <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => toggleExpand(index)}
                      >
                        <PlusMinusIcon open={open} />
                      </TouchableOpacity>
                    </View>

                    {open && (
                      <View style={[styles.answerWrap, styles.insetBox]}>
                        <Text style={styles.answerText}>
                          {description || "No description available."}
                        </Text>
                      </View>
                    )}
                  </React.Fragment>
                );
              })}
          </ScrollView>

          <Text style={styles.helpTitle}>Need More Help?</Text>
          <Text style={styles.helpText}>
            If You Have Any Further Questions, Feel Free To Reach Out To Our
            Support Team.
          </Text>

          <TouchableOpacity
            style={[styles.supportBtn, styles.insetBox]}
            activeOpacity={0.9}
          >
            <Text style={styles.supportBtnText}>Contact Support</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </ImageBackground>
    </>
  );
};

export default FAQ;

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

const styles = StyleSheet.create<any>({
  background: { flex: 1, backgroundColor: UI.bg },
  container: { flex: 1, paddingHorizontal: 16, paddingTop: 20 },

  backbutton: { width: 48, height: 48 },

  header: {
    fontSize: 18,
    fontWeight: "800",
    color: UI.text,
    textAlign: "left",
    marginBottom: 16,
  },

  insetBox: {
    backgroundColor: UI.surface,
    borderRadius: 16,
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderBottomWidth: 2,
    borderRightWidth: 2,
    borderTopColor: UI.dark,
    borderLeftColor: UI.dark,
    borderBottomColor: UI.light,
    borderRightColor: UI.light,
  },

  raisedBox: {
    backgroundColor: UI.surface,
    borderRadius: 16,
    ...commonRaisedShadow,
    ...commonLightRim,
  },
  raisedBoxStrong: {
    backgroundColor: UI.surface,
    borderRadius: 18,
    shadowColor: UI.dark,
    shadowOffset: { width: 12, height: 12 },
    shadowOpacity: 1,
    shadowRadius: 14,
    ...(Platform.OS === "android" ? { elevation: 10 } : null),
    ...commonLightRim,
  },

  searchBox: {
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 3,
    marginBottom: 16,
  },
  searchInput: { fontSize: 14, color: UI.text },

  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 16,
    marginBottom: 14,
    backgroundColor: UI.surface,
  },
  cardText: { fontSize: 14, color: UI.text, fontWeight: "600" },

  answerWrap: {
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 14,
    backgroundColor: UI.surface,
  },
  answerText: { fontSize: 12, color: UI.sub },

  pmWrap: {
    width: 30,
    height: 30,
    borderRadius: 2,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: UI.surface,
  },
  hBar: {
    position: "absolute",
    width: 12,
    height: 2.6,
    borderRadius: 2,
    backgroundColor: "#6B7280",
  },
  vBar: {
    position: "absolute",
    width: 2.6,
    height: 12,
    borderRadius: 2,
    backgroundColor: "#6B7280",
  },

  helpTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: UI.primary,
    textAlign: "center",
    marginTop: 6,
    marginBottom: 6,
  },
  helpText: {
    fontSize: 12,
    color: UI.sub,
    textAlign: "center",
    marginBottom: 14,
    paddingHorizontal: 20,
  },
  supportBtn: {
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: "center",
    marginBottom: 20,
  },
  supportBtnText: { color: UI.text, fontSize: 14, fontWeight: "700" },
});
