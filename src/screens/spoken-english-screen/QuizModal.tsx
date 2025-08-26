// import React, { useState } from "react";
// import { Image } from "react-native";
// import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
// import Modal from "react-native-modal";
// import * as Progress from 'react-native-progress';

// type Option = {
//   text: string;
//   correct?: boolean;
// };

// type Question = {
//   title: string;
//   options: Option[];
//   explanation: string;
// };

// type QuizModalProps = {
//   visible: boolean;
//   onClose: () => void;
//   questions: Question[];
//   onComplete: (scorePercent: number) => void;
// };

// const QuizModal: React.FC<QuizModalProps> = ({ visible, onClose, questions, onComplete }) => {
//   const [current, setCurrent] = useState(0);
//   const [selected, setSelected] = useState<number | null>(null);
//   const [score, setScore] = useState(0);
//   const [lives, setLives] = useState(3);
//   const [showResult, setShowResult] = useState(false);
//   const [finalScore, setFinalScore] = useState<number | null>(null);

//   const currentQuestion = questions[current];
//   const total = questions.length;

//   const handleSelect = (index: number) => {
//     if (selected !== null) return; // prevent double click

//     setSelected(index);
//     const option = currentQuestion.options[index];

//     if (option.correct) {
//       setScore((prev) => prev + 1);
//     } else {
//       setLives((prev) => prev - 1);
//     }
//   };

//   const handleContinue = () => {
//     if (selected === null) return;

//     if (current + 1 < total) {
//       setCurrent((prev) => prev + 1);
//       setSelected(null);
//     } else {
//       const percent = Math.round((score / total) * 100);
//     setFinalScore(percent);
//     setShowResult(true); // show result modal
//     onComplete(percent);
//     }
//   };

//   const resetQuiz = () => {
//     setCurrent(0);
//     setSelected(null);
//     setScore(0);
//     setLives(3);
//     setShowResult(false);
//     setFinalScore(null);
//     onClose();
//   };

//   return (
//   <Modal
//     isVisible={visible}
//     onBackdropPress={resetQuiz}
//     animationIn="zoomIn"
//     animationOut="zoomOut"
//     backdropOpacity={0.4}
//   >
//     <View style={styles.container}>
//       {showResult ? (
//         // 🎯 Result screen
//         <View style={{ alignItems: "center" }}>
//           {finalScore >= 80 ? (
//             <>
//               <Image
//                 source={require("./../../assets/icons/filter.png")} // 👈 put your uploaded image here
//                 style={{ width: 250, height: 250, resizeMode: "contain" }}
//               />
//               <Text style={{ fontSize: 18, fontWeight: "600", marginTop: 12, color: "green" }}>
//                 🎉 Congratulations!
//               </Text>
//               <Text style={{ fontSize: 16, marginTop: 8 }}>Score: {finalScore}%</Text>
//             </>
//           ) : (
//             <>
//               <Text style={{ fontSize: 18, fontWeight: "600", marginTop: 12, color: "red" }}>
//                 Keep Practicing!
//               </Text>
//               <Text style={{ fontSize: 16, marginTop: 8 }}>Score: {finalScore}%</Text>
//               <Text style={{ fontSize: 12, marginTop: 4, color: "#666" }}>
//                 You need 80% or higher to unlock speaking practice.
//               </Text>
//             </>
//           )}

//           {/* Buttons */}
//           <View style={{ flexDirection: "row", marginTop: 20 }}>
//             <TouchableOpacity style={styles.exitBtn} onPress={resetQuiz}>
//               <Text style={{ color: "#444", fontWeight: "600" }}>Exit</Text>
//             </TouchableOpacity>
//             <TouchableOpacity
//               style={[styles.continueBtn, { marginLeft: 10 }]}
//               onPress={resetQuiz}
//             >
//               <Text style={{ color: "#fff", fontWeight: "600" }}>
//                 {finalScore >= 80 ? "Continue" : "Try Again"}
//               </Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       ) : (
//         // 📝 Quiz screen (your current code)
//         <>
//           {/* Header: Lives + Progress */}
//           <View style={styles.header}>
//             <Text style={styles.lives}>
//               {"❤️".repeat(lives) + "🤍".repeat(3 - lives)}
//             </Text>
//             <Progress.Bar
//               progress={(current + 1) / total}
//               width={180}
//               color="#7209b7"
//               borderRadius={8}
//             />
//             <Text style={styles.progressText}>
//               {current + 1}/{total}
//             </Text>
//           </View>

//           {/* Question */}
//           <Text style={styles.title}>{currentQuestion?.title}</Text>

//           {/* Options */}
//           {currentQuestion?.options.map((opt, index) => {
//             const isSelected = selected === index;
//             const isCorrect = opt.correct;
//             const isWrong = isSelected && !isCorrect;

//             return (
//               <TouchableOpacity
//                 key={index}
//                 style={[
//                   styles.option,
//                   isCorrect && selected !== null ? styles.correct : null,
//                   isWrong ? styles.wrong : null,
//                 ]}
//                 onPress={() => handleSelect(index)}
//                 disabled={selected !== null}
//               >
//                 <Text style={styles.optionText}>{opt.text}</Text>
//               </TouchableOpacity>
//             );
//           })}

//           {/* Explanation */}
//           {selected !== null && (
//             <Text style={styles.explanation}>
//               {currentQuestion.explanation}
//             </Text>
//           )}

//           {/* Footer */}
//           <View style={styles.footer}>
//             <TouchableOpacity style={styles.exitBtn} onPress={resetQuiz}>
//               <Text style={{ color: "#444", fontWeight: "600" }}>Exit</Text>
//             </TouchableOpacity>

//             <TouchableOpacity
//               style={[
//                 styles.continueBtn,
//                 { opacity: selected === null ? 0.5 : 1 },
//               ]}
//               onPress={handleContinue}
//               disabled={selected === null}
//             >
//               <Text style={{ color: "#fff", fontWeight: "600" }}>
//                 {current + 1 < total ? "Continue" : "Finish"}
//               </Text>
//             </TouchableOpacity>
//           </View>
//         </>
//       )}
//     </View>
//   </Modal>
// );

// };

// export default QuizModal;

// const styles = StyleSheet.create({
//   container: {
//     backgroundColor: "#fff",
//     borderRadius: 16,
//     padding: 20,
//   },
//   header: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     marginBottom: 16,
//   },
//   lives: {
//     fontSize: 18,
//   },
//   progressText: {
//     fontSize: 12,
//     color: "#666",
//     marginLeft: 8,
//   },
//   title: {
//     fontSize: 16,
//     fontWeight: "600",
//     marginBottom: 16,
//     color: "#333",
//   },
//   option: {
//     padding: 12,
//     borderRadius: 10,
//     marginBottom: 10,
//     backgroundColor: "#f3f3f3",
//   },
//   correct: {
//     backgroundColor: "#d1fadf",
//     borderWidth: 1,
//     borderColor: "#16a34a",
//   },
//   wrong: {
//     backgroundColor: "#ffe0e0",
//     borderWidth: 1,
//     borderColor: "#dc2626",
//   },
//   optionText: {
//     fontSize: 14,
//     fontWeight: "500",
//   },
//   explanation: {
//     marginTop: 12,
//     fontSize: 12,
//     color: "#666",
//   },
//   footer: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginTop: 20,
//   },
//   exitBtn: {
//     backgroundColor: "#eee",
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//     borderRadius: 10,
//   },
//   continueBtn: {
//     backgroundColor: "#7209b7",
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//     borderRadius: 10,
//   },
// });

import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import Modal from "react-native-modal";
import * as Progress from "react-native-progress";

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



export default function QuizModal({ visible, onClose, questions, onComplete }) {
  const total = questions.length;
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(5);
  const [showResult, setShowResult] = useState(false);

  const currentQuestion = questions[current];

  const handleSelect = (index: number) => {
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
      backdropOpacity={0.4}
    >
      <View style={styles.container}>
        {showResult ? (
          // ✅ Result Screen
          <View style={{ alignItems: "center" }}>
            {finalScore >= 80 ? (
              <>
                <Image
                  source={require("../../assets/icons/filter.png")} // 🎉 put your congrats image
                  style={{ width: 250, height: 250, resizeMode: "contain" }}
                />
                <Text style={styles.resultTitle}>🎉 Congratulations!</Text>
                <Text style={styles.resultScore}>Score: {finalScore}%</Text>

                <TouchableOpacity
                  style={styles.continueBtn}
                  onPress={() => {
                    resetQuiz();
                    onComplete(finalScore); // ✅ notify parent that quiz is passed
                  }}
                >
                  <Text style={{ color: "#fff", fontWeight: "600" }}>
                    Continue
                  </Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <Image
                  source={require("../../assets/icons/filter.png")} // ❌ put your retry image
                  style={{ width: 250, height: 250, resizeMode: "contain" }}
                />
                <Text style={[styles.resultTitle, { color: "red" }]}>
                  Try Again
                </Text>
                <Text style={styles.resultScore}>Score: {finalScore}%</Text>
                <Text style={styles.lockText}>
                  You need 80% or higher to unlock next test
                </Text>

                <TouchableOpacity style={styles.retryBtn} onPress={resetQuiz}>
                  <Text style={{ color: "#fff", fontWeight: "600" }}>
                    Retry
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        ) : (
          // 📝 Quiz Screen
          <>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.lives}>
                {"❤️".repeat(lives) + "🤍".repeat(5 - lives)}
              </Text>
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
            {currentQuestion?.options.map((opt, index) => {
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
                  disabled={selected !== null}
                >
                  <Text style={styles.optionText}>{opt.text}</Text>
                </TouchableOpacity>
              );
            })}

            {/* Explanation */}
            {selected !== null && (
              <Text style={styles.explanation}>
                {currentQuestion.explanation}
              </Text>
            )}

            {/* Footer */}
            <View style={styles.footer}>
              <TouchableOpacity style={styles.exitBtn} onPress={resetQuiz}>
                <Text style={{ color: "#444", fontWeight: "600" }}>Exit</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.continueBtn,
                  { opacity: selected === null ? 0.5 : 1 },
                ]}
                onPress={handleContinue}
                disabled={selected === null}
              >
                <Text style={{ color: "#fff", fontWeight: "600" }}>
                  {current + 1 < total ? "Continue" : "Finish"}
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
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  lives: { fontSize: 18 },
  progressText: { fontSize: 14, marginLeft: 8 },
  title: { fontSize: 18, fontWeight: "600", marginBottom: 12 },
  option: {
    padding: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    marginVertical: 6,
  },
  optionText: { fontSize: 16 },
  correct: { backgroundColor: "#d4edda", borderColor: "#28a745" },
  wrong: { backgroundColor: "#f8d7da", borderColor: "#dc3545" },
  explanation: { fontSize: 14, color: "#666", marginTop: 8 },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  exitBtn: {
    padding: 12,
    backgroundColor: "#eee",
    borderRadius: 10,
  },
  continueBtn: {
    padding: 12,
    backgroundColor: "#7209b7",
    borderRadius: 10,
  },
  retryBtn: {
    marginTop: 16,
    padding: 12,
    backgroundColor: "red",
    borderRadius: 10,
  },
  resultTitle: { fontSize: 20, fontWeight: "700", marginTop: 12 },
  resultScore: { fontSize: 16, marginTop: 6 },
  lockText: { fontSize: 13, marginTop: 4, color: "#666" },
});

