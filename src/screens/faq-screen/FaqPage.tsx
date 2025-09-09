import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { selectFaq } from "../../features/faq/reducers/FAQSelector";
import { getFaqThunk } from "../../features/faq/reducers/FAQThunks";

type FAQ = {
  id: string | number;
  question: string;
  answer: string;
};

export default function FAQScreen() {
  const dispatch = useDispatch<any>();
  const faqs: FAQ[] = useSelector(selectFaq);

  const [expanded, setExpanded] = useState<string | number | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    dispatch(getFaqThunk({})); 
  }, [dispatch]);

  const toggleExpand = (id: number | string) => {
    setExpanded(expanded === id ? null : id);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>FAQ - Frequently Asked Questions</Text>

      <View style={styles.searchBox}>
        <TextInput
          placeholder="Search"
          placeholderTextColor="#9ca3af"
          style={styles.searchInput}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {faqs
          ?.filter((faq) =>
            faq.question?.toLowerCase().includes(search.toLowerCase())
          )
          .map((faq) => (
            <View key={faq.id} style={styles.card}>
              <TouchableOpacity
                style={styles.cardHeader}
                onPress={() => toggleExpand(faq.id)}
              >
                <Text style={styles.question}>{faq.question}</Text>
                <Text style={styles.icon}>
                  {expanded === faq.id ? "-" : "+"}
                </Text>
              </TouchableOpacity>

              {expanded === faq.id && (
                <Text style={styles.answer}>{faq.answer}</Text>
              )}
            </View>
          ))}

        <View style={styles.supportBox}>
          <Text style={styles.supportTitle}>Need More Help?</Text>
          <Text style={styles.supportText}>
            If you have any further questions, feel free to reach out to our
            support team.
          </Text>
          <TouchableOpacity style={styles.supportBtn}>
            <Text style={styles.btnText}>Contact Support</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
    padding: 16,
    paddingTop: 60,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 16,
    color: "#111827",
  },
  searchBox: {
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    marginBottom: 16,
  },
  searchInput: {
    fontSize: 14,
    color: "#111827",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  question: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1f2937",
  },
  icon: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#374151",
  },
  answer: {
    marginTop: 8,
    fontSize: 14,
    color: "#4b5563",
    lineHeight: 20,
  },
  supportBox: {
    marginTop: 24,
    padding: 16,
    borderRadius: 14,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
    alignItems: "center",
  },
  supportTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#2563eb",
    marginBottom: 6,
  },
  supportText: {
    textAlign: "center",
    fontSize: 13,
    color: "#6b7280",
    marginBottom: 14,
  },
  supportBtn: {
    backgroundColor: "#2563eb",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  btnText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
  },
});
