import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";

const faqs = [
  {
    question: "Introduction",
    answer: "This is a quick introduction about how the app works.",
  },
  {
    question: "How To Access Payil?",
    answer: "Login with your credentials and navigate to the Payil section.",
  },
  {
    question: "About Payil Dashboard",
    answer: "The dashboard gives you a quick overview of all your courses.",
  },
  {
    question: "About Payil Courses",
    answer: "Payil courses are interactive and self-paced for easy learning.",
  },
  {
    question: "How To Access Payil Subject",
    answer: "Select a subject from your dashboard to start learning.",
  },
  {
    question: "How to add a new course?",
    answer: "Go to the courses section and click 'Add New Course'.",
  },
];

export default function FAQScreen() {
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<number | null>(null);

  const toggleExpand = (index: number) => {
    setExpanded(expanded === index ? null : index);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <Text style={styles.title}>FAQ - Frequently Asked Questions</Text>

      {/* Search */}
      <View style={styles.searchBox}>
        <TextInput
          placeholder="Search"
          placeholderTextColor="#888"
          style={styles.searchInput}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* FAQ List */}
      <ScrollView
        style={{ marginBottom: 20 }}
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      >
        {faqs
          .filter((faq) =>
            faq.question.toLowerCase().includes(search.toLowerCase())
          )
          .map((faq, index) => {
            const isOpen = expanded === index;
            return (
              <View key={index} style={styles.card}>
                {/* Question row */}
                <TouchableOpacity
                  onPress={() => toggleExpand(index)}
                  style={styles.cardHeader}
                  activeOpacity={0.8}
                >
                  <Text style={styles.question}>{faq.question}</Text>
                  <Text style={styles.toggleIcon}>{isOpen ? "–" : "+"}</Text>
                </TouchableOpacity>

                {/* Answer */}
                {isOpen && <Text style={styles.answer}>{faq.answer}</Text>}
              </View>
            );
          })}

        {/* Support Section */}
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
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingTop: 50,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 16,
    color: "#111827",
  },
  searchBox: {
    backgroundColor: "#f3f4f6",
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 1,
  },
  searchInput: {
    fontSize: 14,
    color: "#111827",
  },
  card: {
    backgroundColor: "#f3f4f6",
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 14,
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
    flex: 1,
    paddingRight: 8,
  },
  toggleIcon: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#374151",
    paddingLeft: 10,
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
    borderRadius: 16,
    backgroundColor: "#f9fafb",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 1,
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
    backgroundColor: "#e5e7eb",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  btnText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
  },
});
