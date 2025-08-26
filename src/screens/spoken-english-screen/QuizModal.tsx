import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Modal from "react-native-modal";

type Option = {
  text: string;
  correct: boolean;
};

type Question = {
  title: string;
  options: Option[];
  explanation: string;
};

type QuizModalProps = {
  visible: boolean;
  onClose: () => void;
  questions: Question[];
  onComplete: () => void;
};

const QuizModal: React.FC<QuizModalProps> = ({
  visible,
  onClose,
  questions,
  onComplete,
}) => {
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);

  if (!questions || questions.length === 0) {
    return null;
  }

  const currentQ = questions[currentQIndex];

  const handleSelect = (idx: number) => {
    if (answered) return;
    setSelected(idx);
    setAnswered(true);
  };

  const handleContinue = () => {
    if (currentQIndex < questions.length - 1) {
      setCurrentQIndex(currentQIndex + 1);
      setSelected(null);
      setAnswered(false);
    } else {
      onClose();
      onComplete();
      setCurrentQIndex(0);
      setSelected(null);
      setAnswered(false);
    }
  };

  return (
    <Modal
      isVisible={visible}
      onBackdropPress={onClose}
      animationIn="zoomIn"
      animationOut="zoomOut"
      backdropOpacity={0.4}
    >
      <View style={styles.container}>
        {/* Question Title */}
        <Text style={styles.title}>
          {`Q${currentQIndex + 1}: ${currentQ.title}`}
        </Text>

        {/* Options */}
        {currentQ.options.map((opt, index) => {
          const isCorrect = opt.correct;
          const isSelected = selected === index;

          let bgStyle = {};
          if (answered) {
            if (isSelected && isCorrect) bgStyle = styles.correct;
            else if (isSelected && !isCorrect) bgStyle = styles.wrong;
            else if (isCorrect) bgStyle = styles.correct;
          }

          return (
            <TouchableOpacity
              key={index}
              style={[styles.option, bgStyle]}
              onPress={() => handleSelect(index)}
              disabled={answered}
            >
              <Text style={styles.optionText}>{opt.text}</Text>
            </TouchableOpacity>
          );
        })}

        {/* Explanation */}
        {answered && (
          <Text style={styles.explanation}>{currentQ.explanation}</Text>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.exitBtn} onPress={onClose}>
            <Text style={{ color: "#444" }}>Exit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.continueBtn,
              { opacity: answered ? 1 : 0.5 },
            ]}
            disabled={!answered}
            onPress={handleContinue}
          >
            <Text style={{ color: "#fff" }}>
              {currentQIndex === questions.length - 1
                ? "Finish"
                : "Continue"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 16,
    color: "#333",
  },
  option: {
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: "#f5f5f5",
  },
  correct: {
    backgroundColor: "#d1fadf",
  },
  wrong: {
    backgroundColor: "#ffe0e0",
  },
  optionText: {
    fontSize: 14,
    fontWeight: "500",
  },
  explanation: {
    marginTop: 12,
    fontSize: 12,
    color: "#666",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  exitBtn: {
    backgroundColor: "#eee",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  continueBtn: {
    backgroundColor: "#7209b7",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
});

export default QuizModal;