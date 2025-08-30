import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import Modal from 'react-native-modal';
import * as Progress from 'react-native-progress';

// A single answer option
export interface Option {
  text: string;
  correct: boolean;
}

// A single quiz question
export interface Question {
  id: number | string;
  title: string;
  options: Option[];
  explanation: string;
}

export interface QuizModalProps {
  visible: boolean;
  onClose: () => void;
  questions: Question[];
  onComplete: (scorePercent: number) => void;
}

export default function QuizModal({ visible, onClose, questions, onComplete }: QuizModalProps) {
  const total = questions.length;
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(5);
  const [showResult, setShowResult] = useState(false);

  const currentQuestion = questions[current];

  const handleSelect = (index: any) => {
    setSelected(index);
    if (currentQuestion.options[index].correct) {
      setScore(score + 1);
    } else {
      setLives(lives - 1);
    }
  };

  const handleContinue = () => {
    if (current + 1 < total) {
      setCurrent(current + 1);
      setSelected(null);
    } else {
      setShowResult(true);
    }
  };

  const resetQuiz = () => {
    setCurrent(0);
    setSelected(null);
    setScore(0);
    setLives(5);
    setShowResult(false);
    onClose();
  };

  const finalScore = Math.round((score / total) * 100);

  return (
    <Modal
      isVisible={visible}
      onBackdropPress={resetQuiz}
      animationIn="zoomIn"
      animationOut="zoomOut"
      backdropOpacity={0.4}>
      <View style={styles.container}>
        {showResult ? (
          // ✅ Result Screen
          <View style={{ alignItems: 'center' }}>
            {finalScore >= 80 ? (
              <>
                <Image
                  source={require('../../assets/icons/trophy.png')} // 🎉 put your congrats image
                  style={{ width: 150, height: 150, resizeMode: 'contain' }}
                />
                <Text style={styles.resultTitle}>🎉 Congratulations!</Text>
                <Text style={styles.resultScore}>Score: {finalScore}%</Text>

                <TouchableOpacity
                  style={styles.continueBtn}
                  onPress={() => {
                    resetQuiz();
                    onComplete(finalScore); 
                  }}>
                  <Text style={{ color: '#fff', fontWeight: '600' }}>Continue</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <Image
                  source={require('../../assets/icons/goal.png')} 
                  style={{ width: 150, height: 150, resizeMode: 'contain' }}
                />
                <Text style={[styles.resultTitle, { color: 'red' }]}>Try Again</Text>
                <Text style={styles.resultScore}>Score: {finalScore}%</Text>
                <Text style={styles.lockText}>You need 80% or higher to unlock next test</Text>

                <TouchableOpacity style={styles.retryBtn} onPress={resetQuiz}>
                  <Text style={{ color: '#fff', fontWeight: '600' }}>Retry</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        ) : (
          // 📝 Quiz Screen
          <>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.lives}>{'❤️'.repeat(lives) + '🤍'.repeat(5 - lives)}</Text>
              <Progress.Bar
                progress={(current + 1) / total}
                width={150}
                color="#7209b7"
                borderRadius={8}
              />
              <Text style={styles.progressText}>
                {current + 1}/{total}
              </Text>
            </View>

            {/* Question */}
            <Text style={styles.title}>{currentQuestion?.title}</Text>

            {/* Options */}
            {currentQuestion?.options.map((opt: any, index: any) => {
              const isSelected = selected === index;
              const isCorrect = opt.correct;
              const isWrong = isSelected && !isCorrect;

              return (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.option,
                    isCorrect && selected !== null ? styles.correct : null,
                    isWrong ? styles.wrong : null,
                  ]}
                  onPress={() => handleSelect(index)}
                  disabled={selected !== null}>
                  <Text style={styles.optionText}>{opt.text}</Text>
                </TouchableOpacity>
              );
            })}

            {/* Explanation */}
            {selected !== null && (
              <Text style={styles.explanation}>{currentQuestion.explanation}</Text>
            )}

            {/* Footer */}
            <View style={styles.footer}>
              <TouchableOpacity style={styles.exitBtn} onPress={resetQuiz}>
                <Text style={{ color: '#444', fontWeight: '600' }}>Exit</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.continueBtn, { opacity: selected === null ? 0.5 : 1 }]}
                onPress={handleContinue}
                disabled={selected === null}>
                <Text style={{ color: '#fff', fontWeight: '600' }}>
                  {current + 1 < total ? 'Continue' : 'Finish'}
                </Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  lives: { fontSize: 18 },
  progressText: { fontSize: 14, marginLeft: 8 },
  title: { fontSize: 18, fontWeight: '600', marginBottom: 12 },
  option: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    marginVertical: 6,
  },
  optionText: { fontSize: 16 },
  correct: { backgroundColor: '#d4edda', borderColor: '#28a745' },
  wrong: { backgroundColor: '#f8d7da', borderColor: '#dc3545' },
  explanation: { fontSize: 14, color: '#666', marginTop: 8 },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  exitBtn: {
    padding: 12,
    backgroundColor: '#eee',
    borderRadius: 10,
  },
  continueBtn: {
    padding: 12,
    backgroundColor: '#7209b7',
    borderRadius: 10,
    marginTop: 5,
  },
  retryBtn: {
    marginTop: 16,
    padding: 12,
    backgroundColor: 'red',
    borderRadius: 10,
  },
  resultTitle: { fontSize: 20, fontWeight: '700', marginTop: 12 },
  resultScore: { fontSize: 16, marginTop: 6, fontWeight: 500 },
  lockText: { fontSize: 13, marginTop: 4, color: '#666' },
});
