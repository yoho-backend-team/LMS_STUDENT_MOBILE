// import { useNavigation } from '@react-navigation/native';
// import { ScrollView, StatusBar, Dimensions, Platform, TouchableOpacity, LayoutAnimation, Image, StyleSheet, Text, View, Modal } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { COLORS } from '~/constants';
// import Svg, { Circle } from 'react-native-svg';
// import React, { useState } from 'react';
// import LearningPathSteps from "./LearningPathSteps";
// import { LinearGradient } from 'expo-linear-gradient';
// import * as Progress from 'react-native-progress';

// const UI = {
//   bg: '#EAEFF5', // page background
//   surface: '#F2F5F9', // main surface (cards/rows)
//   chip: '#EDF2F7', // inner chips
//   text: '#1F2937',
//   sub: '#6B7280',
//   primary: '#5B84F8',
//   dark: '#C1CADC', // dark rim (bottom/right)
//   light: '#FFFFFF', // light rim (top/left)
// };

// const { width } = Dimensions.get("window");

// const PlusMinusIcon = ({ open }: { open: boolean }) => (
//   <View style={[styles.pmWrap, styles.insetBox]}>
//     <View style={styles.hBar} />
//     {!open && <View style={styles.vBar} />}
//   </View>
// );

// const IntroContent = () => (
//   <View style={{ marginTop: 10, marginBottom: 14 }}>
//     <View style={[styles.bigCard, styles.raisedBoxStrong]}>
//       <Text style={styles.bigCardText}>
//         Thanks For Your Interest In Teaching Your{'\n'}Courses Through Payil.
//       </Text>
//     </View>

//     <View style={[styles.smallCard, styles.insetBox, { backgroundColor: UI.chip }]}>
//       <Text style={styles.smallCardText}>
//         Payil Is Designed To Help You Manage Your Courses Effectively.
//       </Text>
//     </View>

//     <View style={[styles.smallCard, styles.insetBox, { backgroundColor: UI.chip }]}>
//       <Text style={styles.smallCardText}>
//         You Can Track Student Progress And Manage Assignments Easily.
//       </Text>
//     </View>
//   </View>
// );

// const faqs = [
//   { question: "What is a noun?", answer: "A noun is a word that names a person, place, thing, or idea." },
//   { question: "What is a verb?", answer: "A verb is a word that shows action or a state of being." },
//   { question: "What is an adjective?", answer: "An adjective is a word that describes a noun or pronoun." },
//   { question: "What is an adverb?", answer: "An adverb modifies a verb, adjective, or another adverb and often ends in -ly." },
//   { question: "What is a pronoun?", answer: "A pronoun is a word that replaces a noun, such as he, she, it, or they." },
//   { question: "What is a preposition?", answer: "A preposition shows the relationship between a noun or pronoun and another word in a sentence." },
//   { question: "What is a conjunction?", answer: "A conjunction joins words, phrases, or clauses. Examples: and, but, or." },
//   { question: "What is an interjection?", answer: "An interjection is a word that expresses sudden emotion, such as Oh!, Wow!, or Oops!" },
//   { question: "What is a sentence?", answer: "A sentence is a group of words that expresses a complete thought." },
//   { question: "What is a subject in a sentence?", answer: "The subject is the person, place, or thing that the sentence is about." },
//   { question: "What is a predicate in a sentence?", answer: "The predicate tells what the subject does or is." },
//   { question: "What is a clause?", answer: "A clause is a group of words with a subject and a predicate." },
//   { question: "What is a phrase?", answer: "A phrase is a group of words without a subject-verb combination." },
//   { question: "What is the difference between a clause and a phrase?", answer: "A clause has a subject and verb, while a phrase does not." },
//   { question: "What is an article?", answer: "An article is a word that defines a noun as specific or unspecific (a, an, the)." },
//   { question: "What is subject-verb agreement?", answer: "It means the subject and verb must agree in number, singular or plural." },
//   { question: "What are tenses?", answer: "Tenses indicate the time of an action, such as past, present, or future." },
//   { question: "What is the present tense?", answer: "The present tense describes actions happening now or general truths." },
//   { question: "What is the past tense?", answer: "The past tense describes actions that already happened." },
//   { question: "What is the future tense?", answer: "The future tense describes actions that will happen later." },
//   { question: "What is a simple sentence?", answer: "A simple sentence has one independent clause." },
//   { question: "What is a compound sentence?", answer: "A compound sentence has two or more independent clauses joined by a conjunction." },
//   { question: "What is a complex sentence?", answer: "A complex sentence has one independent clause and at least one dependent clause." },
//   { question: "What is passive voice?", answer: "In passive voice, the subject receives the action (e.g., The cake was eaten)." },
//   { question: "What is active voice?", answer: "In active voice, the subject performs the action (e.g., She ate the cake)." },
//   { question: "What is direct speech?", answer: "Direct speech shows the exact words spoken, usually in quotes." },
//   { question: "What is indirect speech?", answer: "Indirect speech reports what someone said without quoting them exactly." },
//   { question: "What is a synonym?", answer: "A synonym is a word with a similar meaning to another word." },
//   { question: "What is an antonym?", answer: "An antonym is a word with the opposite meaning of another word." },
//   { question: "What is a modal verb?", answer: "Modal verbs express ability, possibility, necessity, or permission (can, could, must, should)." },
// ];


// type ProgressCircleProps = {
//   percentage: number;
//   size?: number;
//   strokeWidth?: number;
//   color?: string;
// };

// const ProgressCircle = ({
//   percentage,
//   size = 80,
//   strokeWidth = 8,
//   color = '#8A2BE2',
// }: ProgressCircleProps) => {
//   const radius = (size - strokeWidth) / 2;
//   const circumference = 2 * Math.PI * radius;
//   const strokeDasharray = circumference;
//   const strokeDashoffset = circumference - (percentage / 100) * circumference;

//   return (
//     <View style={{ width: size, height: size, position: 'relative' }}>
//       <Svg width={size} height={size} style={{ position: 'absolute' }}>
//         {/* Background Circle */}
//         <Circle
//           cx={size / 2}
//           cy={size / 2}
//           r={radius}
//           stroke="#E5E7EB"
//           strokeWidth={strokeWidth}
//           fill="transparent"
//         />
//         {/* Progress Circle */}
//         <Circle
//           cx={size / 2}
//           cy={size / 2}
//           r={radius}
//           stroke={color}
//           strokeWidth={strokeWidth}
//           fill="transparent"
//           strokeDasharray={strokeDasharray}
//           strokeDashoffset={strokeDashoffset}
//           strokeLinecap="round"
//           transform={`rotate(-90 ${size / 2} ${size / 2})`}
//         />
//       </Svg>
//       <View style={[styles.progressText, { width: size, height: size }]}>
//         <Text style={[styles.percentageText, { color }]}>{percentage}%</Text>
//       </View>
//     </View>
//   );
// };

// const SpokenEnglish = () => {
//   const navigation = useNavigation<any>();
//   const [search, setSearch] = useState('');
//   const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
//   const [currentPage, setCurrentPage] = useState(0);
//   const itemsPerPage = 10;

//   const toggleExpand = (index: number) => {
//     LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
//     setExpandedIndex(expandedIndex === index ? null : index);
//   };

//   const [isFilterOpen, setFilterOpen] = useState(false);

//   // Calculate pagination
//   const totalPages = Math.ceil(faqs.length / itemsPerPage);
//   const startIndex = currentPage * itemsPerPage;
//   const endIndex = startIndex + itemsPerPage;
//   const currentFaqs = faqs.slice(startIndex, endIndex);

//   const goToNextPage = () => {
//     if (currentPage < totalPages - 1) {
//       setCurrentPage(currentPage + 1);
//       setExpandedIndex(null); // Close any expanded items when changing pages
//     }
//   };

//   const goToPrevPage = () => {
//     if (currentPage > 0) {
//       setCurrentPage(currentPage - 1);
//       setExpandedIndex(null); // Close any expanded items when changing pages
//     }
//   };

//   const statsCards = [
//     {
//       title: 'Total Classes',
//       value: '0',
//       icon: require('../../assets/home/card1icon.png'),
//       color: '#22D3EE',
//       bgColor: COLORS.white,
//     },
//     {
//       title: 'Total Completed Claas',
//       value: '0',
//       icon: require('../../assets/home/card6img.png'),
//       color: '#6366F1',
//       bgColor: COLORS.white,
//     },
//     {
//       title: 'Completed (Liveclass)',
//       value: '0',
//       icon: require('../../assets/home/card2icon.png'),
//       color: '#10B981',
//       bgColor: COLORS.white,
//     },
//     {
//       title: 'Completed (Offline)',
//       value: '0',
//       icon: require('../../assets/home/card4img.png'),
//       color: '#EC4899',
//       bgColor: COLORS.white,
//     }
//   ];

//   return (
//     <>
//       <StatusBar backgroundColor={COLORS.black} barStyle="light-content" />
//       <SafeAreaView edges={['top']} style={styles.container}>
//         <ScrollView
//           style={styles.scrollContainer}
//           contentContainerStyle={{ paddingBottom: 20 }}
//           showsVerticalScrollIndicator={false}>
          
//           {/* Header */}
//           <View style={{ padding: 10 }}>
//             <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
//               <TouchableOpacity onPress={() => navigation.goBack()}>
//                 <Image source={require('../../assets/profile/back.png')} style={styles.backbutton} />
//               </TouchableOpacity>
//               <Text style={styles.title}>Learning Path</Text>
//               <TouchableOpacity onPress={() => setFilterOpen(true)}>
//                 <Image source={require('../../assets/icons/filter.png')} style={styles.fillterbutton} />
//               </TouchableOpacity>
//             </View>

//             <View style={styles.card}>
//               <Text style={styles.cardTitle}>English Mastery Challenge</Text>
//               <Text style={styles.cardSubtitle}>
//                 Classic Style Grammar And Speaking Practice
//               </Text>
//             </View>

//             <View style={styles.statsGrid}>
//               {statsCards.map((item, index) => (
//                 <View key={index} style={[styles.statsCard, { backgroundColor: item.bgColor }]}>
//                   <View style={styles.statsHeader}>
//                     <Text style={styles.statsTitle}>{item.title}</Text>
//                   </View>
//                   <View style={styles.iconcontent}>
//                     <View style={[styles.iconContainer, { backgroundColor: item.color }]}>
//                       <Image source={item.icon} style={styles.statsIcon} />
//                     </View>
//                   </View>
//                   <View style={styles.progress}>
//                     <ProgressCircle
//                       percentage={parseInt(item.value)}
//                       size={60}
//                       strokeWidth={8}
//                       color={item.color}
//                     />
//                   </View>
//                 </View>
//               ))}
//             </View>

//             <View>
//               <Text style={styles.cardTitle}>Choose Your Language</Text>
//             </View>

//             <View>
//               {currentFaqs
//                 .filter((i) => i.question.toLowerCase().includes(search.toLowerCase()))
//                 .map((item, index) => {
//                   const globalIndex = startIndex + index;
//                   const open = expandedIndex === globalIndex;
//                   return (
//                     <React.Fragment key={globalIndex}>
//                       {/* Row – RAISED (popped-out) */}
//                       <View style={[styles.scrollcard, styles.insetBox]}>
//                         <View style={{ flex: 1 }}>
//                           <Text style={styles.cardText}>{item.question}</Text>
//                         </View>
//                         <TouchableOpacity activeOpacity={0.8} onPress={() => toggleExpand(globalIndex)}>
//                           <PlusMinusIcon open={open} />
//                         </TouchableOpacity>
//                       </View>

//                       {/* Inline expanded content (same page) */}
//                       {open &&
//                         (item.question === 'Introduction' ? (
//                           <IntroContent />
//                         ) : (
//                           <View style={[styles.answerWrap, styles.insetBox]}>
//                             <Text style={styles.answerText}>{item.answer}</Text>
//                           </View>
//                         ))}
//                     </React.Fragment>
//                   );
//                 })}
//             </View>

//             {/* Pagination Controls */}
//             <View style={styles.paginationContainer}>
//               <TouchableOpacity 
//                 onPress={goToPrevPage} 
//                 disabled={currentPage === 0}
//                 style={[styles.paginationButton, currentPage === 0 && styles.disabledButton]}
//               >
//                 <Text style={styles.paginationButtonText}>Previous</Text>
//               </TouchableOpacity>
              
//               <Text style={styles.pageInfo}>
//                 Page {currentPage + 1} of {totalPages}
//               </Text>
              
//               <TouchableOpacity 
//                 onPress={goToNextPage} 
//                 disabled={currentPage === totalPages - 1}
//                 style={[styles.paginationButton, currentPage === totalPages - 1 && styles.disabledButton]}
//               >
//                 <Text style={styles.paginationButtonText}>Next</Text>
//               </TouchableOpacity>
//             </View>

//             <TouchableOpacity 
//               style={styles.startChallengeButton}
//               onPress={() => setFilterOpen(true)}
//             >
//               <LinearGradient
//                 colors={["#a259ff", "#7209b7"]}
//                 style={styles.gradientButton}
//               >
//                 <Text style={styles.startChallengeText}>Start Challenge</Text>
//               </LinearGradient>
//             </TouchableOpacity>
//           </View>
//         </ScrollView>
//         <Modal
//           visible={isFilterOpen}
//           animationType="slide"
//           transparent={true}
//           onRequestClose={() => setFilterOpen(false)}
//         >
//           <View style={styles.modal}>
//             <View style={styles.modalContent}>
//               <LearningPathSteps onClose={() => setFilterOpen(false)} />
//             </View>
//           </View>
//         </Modal>
//       </SafeAreaView>
//     </>
//   );
// };

// export default SpokenEnglish;

// const commonRaisedShadow = {
//   shadowColor: UI.dark,
//   shadowOffset: { width: 8, height: 8 },
//   shadowOpacity: 1,
//   shadowRadius: 10,
//   ...(Platform.OS === 'android' ? { elevation: 8 } : null),
// };
// const commonLightRim = {
//   borderWidth: 1,
//   borderColor: UI.light,
// };

// const styles = StyleSheet.create({
//   container: { flex: 1, paddingTop: 10, backgroundColor: COLORS.white },
//   scrollContainer: {
//     flex: 1,
//   },
//   title: {
//     fontSize: 22,
//     fontWeight: '700',
//     color: COLORS.text_title,
//   },
//   backbutton: {
//     width: 48,
//     height: 48,
//     resizeMode: 'contain',
//   },
//   fillterbutton : {
//     width: 28,
//     height: 28,
//     resizeMode: 'contain',
//   },
//   headerBox: {
//     backgroundColor: '#BDC2C740',
//     paddingVertical: 10,
//     paddingHorizontal: 15,
//     borderRadius: 10,
//     marginBottom: 20,
//     marginTop: 10,
//   },
//   header: {
//     fontSize: 18,
//     fontWeight: '700',
//     color: '#000',
//     paddingLeft: 12,
//     marginBottom: 15,
//   },
//   card: {
//     backgroundColor: '#fff',
//     borderRadius: 16,
//     padding: 20,
//     shadowColor: '#000',
//     shadowOpacity: 0.05,
//     shadowRadius: 6,
//     elevation: 3,
//     marginBottom: 20,
//   },
//   cardTitle: {
//     fontSize: 18,
//     fontWeight: '700',
//     color: '#222',
//     marginBottom: 6,
//   },
//   cardSubtitle: {
//     fontSize: 14,
//     color: '#777',
//   },
//   imageStyle: {
//     width: 55,
//     height: 55,
//     borderRadius: 8,
//   },
//   info: {
//     flex: 1,
//     marginLeft: 8,
//   },
//   name: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#2C3E50',
//   },
//   id: {
//     fontSize: 14,
//     color: '#7F8C8D',
//     marginTop: 4,
//   },
//   button: {
//     backgroundColor: '#8A2BE2',
//     paddingVertical: 8,
//     paddingHorizontal: 14,
//     borderRadius: 5,
//   },
//   buttonText: {
//     color: '#fff',
//     fontWeight: '600',
//     fontSize: 13,
//   },

//   // Stats Grid Styles
//   statsGrid: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     justifyContent: 'space-between',
//     marginBottom: 20,
//   },
//   statsCard: {
//     width: '48%',
//     padding: 8,
//     borderRadius: 12,
//     marginBottom: 10,
//     alignItems: 'center',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   statsHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     width: '100%',
//   },
//   iconcontent: {
//     position: 'absolute',
//     top: 50,
//     left: 15,
//   },
//   progress: {
//     paddingLeft: 80,
//   },
//   iconContainer: {
//     width: 32,
//     height: 32,
//     borderRadius: 8,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   statsIcon: {
//     width: 20,
//     height: 20,
//     tintColor: '#fff',
//   },
//   statsValue: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: '#1F2937',
//   },
//   statsTitle: {
//     fontSize: 12,
//     color: '#6B7280',
//     textAlign: 'center',
//     marginBottom: 10,
//   },

//   // Progress Section Styles
//   progressText: {
//     position: 'absolute',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   percentageText: {
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   insetBox: {
//     backgroundColor: UI.surface,
//     borderRadius: 16,
//     // fake inner shadow by opposing borders
//     borderTopWidth: 2,
//     borderLeftWidth: 2,
//     borderBottomWidth: 2,
//     borderRightWidth: 2,
//     borderTopColor: UI.dark,
//     borderLeftColor: UI.dark,
//     borderBottomColor: UI.light,
//     borderRightColor: UI.light,
//   },

//   /* RAISED helper (popped-out) */
//   raisedBox: {
//     backgroundColor: UI.surface,
//     borderRadius: 16,
//     ...commonRaisedShadow,
//     ...commonLightRim,
//   },

//   /* stronger lift for big intro card */
//   raisedBoxStrong: {
//     backgroundColor: UI.surface,
//     borderRadius: 18,
//     shadowColor: UI.dark,
//     shadowOffset: { width: 12, height: 12 },
//     shadowOpacity: 1,
//     shadowRadius: 14,
//     ...(Platform.OS === 'android' ? { elevation: 10 } : null),
//     ...commonLightRim,
//   },

//   /* Search */
//   searchBox: {
//     borderRadius: 16,
//     paddingHorizontal: 16,
//     paddingVertical: 3,
//     marginBottom: 16,
//   },
//   searchInput: { fontSize: 14, color: UI.text },

//   /* Row */
//   scrollcard: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingVertical: 6,
//     paddingHorizontal: 16,
//     borderRadius: 16,
//     marginBottom: 14,
//     backgroundColor: UI.surface,
//   },
//   cardText: { fontSize: 14, color: UI.text, fontWeight: '600' },

//   /* Expanded */
//   answerWrap: {
//     borderRadius: 16,
//     paddingVertical: 12,
//     paddingHorizontal: 14,
//     marginBottom: 14,
//     backgroundColor: UI.surface,
//   },
//   answerText: { fontSize: 12, color: UI.sub },

//   /* Plus/Minus */
//   pmWrap: {
//     width: 30,
//     height: 30,
//     borderRadius: 2,
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: UI.surface,
//   },
//   hBar: {
//     position: 'absolute',
//     width: 12,
//     height: 2.6,
//     borderRadius: 2,
//     backgroundColor: '#6B7280',
//   },
//   vBar: {
//     position: 'absolute',
//     width: 2.6,
//     height: 12,
//     borderRadius: 2,
//     backgroundColor: '#6B7280',
//   },

//   /* Pagination Styles */
//   paginationContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginVertical: 20,
//     paddingHorizontal: 10,
//   },
//   paginationButton: {
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//     borderRadius: 8,
//     backgroundColor: '#7209b7',
//   },
//   paginationButtonText: {
//     color: '#fff',
//     fontWeight: '600',
//     fontSize: 14,
//   },
//   disabledButton: {
//     backgroundColor: '#cccccc',
//     opacity: 0.5,
//   },
//   pageInfo: {
//     fontSize: 14,
//     color: '#666',
//     fontWeight: '500',
//   },

//   /* Start Challenge Button */
//   startChallengeButton: {
//     marginTop: 10,
//     borderRadius: 12,
//     overflow: 'hidden',
//   },
//   gradientButton: {
//     paddingVertical: 15,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   startChallengeText: {
//     color: '#fff',
//     fontWeight: '600',
//     fontSize: 16,
//   },

//   /* Help + CTA */
//   helpTitle: {
//     fontSize: 14,
//     fontWeight: '800',
//     color: UI.primary,
//     textAlign: 'center',
//     marginTop: 6,
//     marginBottom: 6,
//   },
//   helpText: {
//     fontSize: 12,
//     color: UI.sub,
//     textAlign: 'center',
//     marginBottom: 14,
//     paddingHorizontal: 20,
//   },
//   supportBtn: { borderRadius: 16, paddingVertical: 14, alignItems: 'center', marginBottom: 20 },
//   supportBtnText: { color: UI.text, fontSize: 14, fontWeight: '700' },

//   /* Intro content */
//   bigCard: { padding: 16, marginBottom: 12, borderRadius: 18, backgroundColor: UI.surface },
//   bigCardText: { fontSize: 16, lineHeight: 22, color: UI.sub, fontWeight: '800' },
//   smallCard: { paddingVertical: 14, paddingHorizontal: 14, marginBottom: 12, borderRadius: 14 },
//   smallCardText: { fontSize: 13, color: UI.sub, fontWeight: '600' },

//   //Modal 
//   modal: {
//     flex: 1,
//     backgroundColor: 'rgba(0,0,0,0.5)',
//     justifyContent: 'flex-end',
//     alignItems: 'flex-end',
//   },
//   modalContent: {
//     width: width * 0.75,   // 3/4 screen width
//     height: '100%',
//     backgroundColor: '#fff',
//     borderTopLeftRadius: 16,
//     borderBottomLeftRadius: 16,
//     overflow: 'hidden',
//   },
// });

import { useNavigation } from '@react-navigation/native';
import { ScrollView, StatusBar, Dimensions, Platform, TouchableOpacity, LayoutAnimation, Image, StyleSheet, Text, View, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '~/constants';
import Svg, { Circle } from 'react-native-svg';
import React, { useState } from 'react';
import LearningPathSteps from "./LearningPathSteps";
import { LinearGradient } from 'expo-linear-gradient';
import * as Progress from 'react-native-progress';

const UI = {
  bg: '#EAEFF5', // page background
  surface: '#F2F5F9', // main surface (cards/rows)
  chip: '#EDF2F7', // inner chips
  text: '#1F2937',
  sub: '#6B7280',
  primary: '#5B84F8',
  dark: '#C1CADC', // dark rim (bottom/right)
  light: '#FFFFFF', // light rim (top/left)
};

const { width } = Dimensions.get("window");

const PlusMinusIcon = ({ open }: { open: boolean }) => (
  <View style={[styles.pmWrap, styles.insetBox]}>
    <View style={styles.hBar} />
    {!open && <View style={styles.vBar} />}
  </View>
);

const IntroContent = () => (
  <View style={{ marginTop: 10, marginBottom: 14 }}>
    <View style={[styles.bigCard, styles.raisedBoxStrong]}>
      <Text style={styles.bigCardText}>
        Thanks For Your Interest In Teaching Your{'\n'}Courses Through Payil.
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

const faqs = [
  { question: "What is a noun?", answer: "A noun is a word that names a person, place, thing, or idea." },
  { question: "What is a verb?", answer: "A verb is a word that shows action or a state of being." },
  { question: "What is an adjective?", answer: "An adjective is a word that describes a noun or pronoun." },
  { question: "What is an adverb?", answer: "An adverb modifies a verb, adjective, or another adverb and often ends in -ly." },
  { question: "What is a pronoun?", answer: "A pronoun is a word that replaces a noun, such as he, she, it, or they." },
  { question: "What is a preposition?", answer: "A preposition shows the relationship between a noun or pronoun and another word in a sentence." },
  { question: "What is a conjunction?", answer: "A conjunction joins words, phrases, or clauses. Examples: and, but, or." },
  { question: "What is an interjection?", answer: "An interjection is a word that expresses sudden emotion, such as Oh!, Wow!, or Oops!" },
  { question: "What is a sentence?", answer: "A sentence is a group of words that expresses a complete thought." },
  { question: "What is a subject in a sentence?", answer: "The subject is the person, place, or thing that the sentence is about." },
  { question: "What is a predicate in a sentence?", answer: "The predicate tells what the subject does or is." },
  { question: "What is a clause?", answer: "A clause is a group of words with a subject and a predicate." },
  { question: "What is a phrase?", answer: "A phrase is a group of words without a subject-verb combination." },
  { question: "What is the difference between a clause and a phrase?", answer: "A clause has a subject and verb, while a phrase does not." },
  { question: "What is an article?", answer: "An article is a word that defines a noun as specific or unspecific (a, an, the)." },
  { question: "What is subject-verb agreement?", answer: "It means the subject and verb must agree in number, singular or plural." },
  { question: "What are tenses?", answer: "Tenses indicate the time of an action, such as past, present, or future." },
  { question: "What is the present tense?", answer: "The present tense describes actions happening now or general truths." },
  { question: "What is the past tense?", answer: "The past tense describes actions that already happened." },
  { question: "What is the future tense?", answer: "The future tense describes actions that will happen later." },
  { question: "What is a simple sentence?", answer: "A simple sentence has one independent clause." },
  { question: "What is a compound sentence?", answer: "A compound sentence has two or more independent clauses joined by a conjunction." },
  { question: "What is a complex sentence?", answer: "A complex sentence has one independent clause and at least one dependent clause." },
  { question: "What is passive voice?", answer: "In passive voice, the subject receives the action (e.g., The cake was eaten)." },
  { question: "What is active voice?", answer: "In active voice, the subject performs the action (e.g., She ate the cake)." },
  { question: "What is direct speech?", answer: "Direct speech shows the exact words spoken, usually in quotes." },
  { question: "What is indirect speech?", answer: "Indirect speech reports what someone said without quoting them exactly." },
  { question: "What is a synonym?", answer: "A synonym is a word with a similar meaning to another word." },
  { question: "What is an antonym?", answer: "An antonym is a word with the opposite meaning of another word." },
  { question: "What is a modal verb?", answer: "Modal verbs express ability, possibility, necessity, or permission (can, could, must, should)." },
];


type ProgressCircleProps = {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
};

const ProgressCircle = ({
  percentage,
  size = 80,
  strokeWidth = 8,
  color = '#8A2BE2',
}: ProgressCircleProps) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <View style={{ width: size, height: size, position: 'relative' }}>
      <Svg width={size} height={size} style={{ position: 'absolute' }}>
        {/* Background Circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#E5E7EB"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Progress Circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      <View style={[styles.progressText, { width: size, height: size }]}>
        <Text style={[styles.percentageText, { color }]}>{percentage}%</Text>
      </View>
    </View>
  );
};

const SpokenEnglish = () => {
  const navigation = useNavigation<any>();
  const [search, setSearch] = useState('');
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10;

  const toggleExpand = (index: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const [isFilterOpen, setFilterOpen] = useState(false);

  // Calculate pagination
  const totalPages = Math.ceil(faqs.length / itemsPerPage);
  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentFaqs = faqs.slice(startIndex, endIndex);

  const goToNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
      setExpandedIndex(null); // Close any expanded items when changing pages
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
      setExpandedIndex(null); // Close any expanded items when changing pages
    }
  };

  const statsCards = [
    {
      title: 'Day Streak',
      value: '0',
      icon: require('../../assets/home/card1icon.png'),
      color: '#22D3EE',
      bgColor: COLORS.white,
    },
    {
      title: 'Total XP',
      value: '0',
      icon: require('../../assets/home/card6img.png'),
      color: '#6366F1',
      bgColor: COLORS.white,
    },
    {
      title: 'Completed ',
      value: '0',
      icon: require('../../assets/home/card2icon.png'),
      color: '#10B981',
      bgColor: COLORS.white,
    },
    {
      title: 'Achievement',
      value: '0',
      icon: require('../../assets/home/card4img.png'),
      color: '#EC4899',
      bgColor: COLORS.white,
    }
  ];

  return (
    <>
      <StatusBar backgroundColor={COLORS.black} barStyle="light-content" />
      // Replace the main ScrollView with this structure:
<SafeAreaView edges={['top']} style={styles.container}>
  {/* Fixed Header */}
  <View style={{ padding: 10 }}>
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Image source={require('../../assets/profile/back.png')} style={styles.backbutton} />
      </TouchableOpacity>
      <Text style={styles.title}>Learning Path</Text>
      <TouchableOpacity onPress={() => setFilterOpen(true)}>
        <Image source={require('../../assets/icons/filter.png')} style={styles.fillterbutton} />
      </TouchableOpacity>
    </View>

    <View style={styles.card}>
      <Text style={styles.cardTitle}>English Mastery Challenge</Text>
      <Text style={styles.cardSubtitle}>
        Classic Style Grammar And Speaking Practice
      </Text>
    </View>

    <View style={styles.statsGrid}>
      {statsCards.map((item, index) => (
        <View key={index} style={[styles.statsCard, { backgroundColor: item.bgColor }]}>
          <View style={styles.statsHeader}>
            <Text style={styles.statsTitle}>{item.title}</Text>
          </View>
          <View style={styles.iconcontent}>
            <View style={[styles.iconContainer, { backgroundColor: item.color }]}>
              <Image source={item.icon} style={styles.statsIcon} />
            </View>
          </View>
          <View style={styles.progress}>
            <ProgressCircle
              percentage={parseInt(item.value)}
              size={60}
              strokeWidth={8}
              color={item.color}
            />
          </View>
        </View>
      ))}
    </View>

    <View>
      <Text style={styles.cardTitle}>Session Recap</Text>
    </View>
  </View>

  {/* Scrollable Questions Section */}
  <ScrollView
    style={styles.questionsScrollView}
    contentContainerStyle={styles.questionsContainer}
    showsVerticalScrollIndicator={false}
  >
    {currentFaqs
      .filter((i) => i.question.toLowerCase().includes(search.toLowerCase()))
      .map((item, index) => {
        const globalIndex = startIndex + index;
        const open = expandedIndex === globalIndex;
        return (
          <React.Fragment key={globalIndex}>
            {/* Row – RAISED (popped-out) */}
            <View style={[styles.scrollcard, styles.insetBox]}>
              <View style={{ flex: 1 }}>
                <Text style={styles.cardText}>{item.question}</Text>
              </View>
              <TouchableOpacity activeOpacity={0.8} onPress={() => toggleExpand(globalIndex)}>
                <PlusMinusIcon open={open} />
              </TouchableOpacity>
            </View>

            {/* Inline expanded content (same page) */}
            {open &&
              (item.question === 'Introduction' ? (
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

  {/* Fixed Footer */}
  <View style={{ padding: 2 }}>
    {/* Pagination Controls */}
    <View style={styles.paginationContainer}>
      <TouchableOpacity 
        onPress={goToPrevPage} 
        disabled={currentPage === 0}
        style={[styles.paginationButton, currentPage === 0 && styles.disabledButton]}
      >
        <Text style={[
          styles.paginationButtonText, 
          currentPage === 0 && styles.disabledButtonText
        ]}>
          Previous
        </Text>
      </TouchableOpacity>
      
      <Text style={styles.pageInfo}>
        Page {currentPage + 1} of {totalPages}
      </Text>
      
      <TouchableOpacity 
        onPress={goToNextPage} 
        disabled={currentPage === totalPages - 1}
        style={[styles.paginationButton, currentPage === totalPages - 1 && styles.disabledButton]}
      >
        <Text style={[
          styles.paginationButtonText, 
          currentPage === totalPages - 1 && styles.disabledButtonText
        ]}>
          Next
        </Text>
      </TouchableOpacity>
    </View>

    <TouchableOpacity 
      style={styles.startChallengeButton}
      onPress={() => setFilterOpen(true)}
    >
      <LinearGradient
        colors={["#a259ff", "#7209b7"]}
        style={styles.gradientButton}
      >
        <Text style={styles.startChallengeText}>Start Challenge</Text>
      </LinearGradient>
    </TouchableOpacity>
  </View>

  <Modal
    visible={isFilterOpen}
    animationType="slide"
    transparent={true}
    onRequestClose={() => setFilterOpen(false)}
  >
    <View style={styles.modal}>
      <View style={styles.modalContent}>
        <LearningPathSteps onClose={() => setFilterOpen(false)} />
      </View>
    </View>
  </Modal>
</SafeAreaView>
    </>
  );
};

export default SpokenEnglish;

const commonRaisedShadow = {
  shadowColor: UI.dark,
  shadowOffset: { width: 8, height: 8 },
  shadowOpacity: 1,
  shadowRadius: 10,
  ...(Platform.OS === 'android' ? { elevation: 8 } : null),
};
const commonLightRim = {
  borderWidth: 1,
  borderColor: UI.light,
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 10, backgroundColor: COLORS.white },
  scrollContainer: {
    flex: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.text_title,
  },
  backbutton: {
    width: 48,
    height: 48,
    resizeMode: 'contain',
  },
  fillterbutton : {
    width: 28,
    height: 28,
    resizeMode: 'contain',
  },
  questionsScrollView: {
  flex: 1,
  marginBottom: 2,
  },
  questionsContainer: {
    paddingHorizontal: 20,
  },
  headerBox: {
    backgroundColor: '#BDC2C740',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    marginBottom: 20,
    marginTop: 10,
  },
  header: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
    paddingLeft: 12,
    marginBottom: 15,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#222',
    marginBottom: 6,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#777',
  },
  imageStyle: {
    width: 55,
    height: 55,
    borderRadius: 8,
  },
  info: {
    flex: 1,
    marginLeft: 8,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
  },
  id: {
    fontSize: 14,
    color: '#7F8C8D',
    marginTop: 4,
  },
  button: {
    backgroundColor: '#8A2BE2',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 13,
  },

  // Stats Grid Styles
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statsCard: {
    width: '48%',
    padding: 8,
    borderRadius: 12,
    marginBottom: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  iconcontent: {
    position: 'absolute',
    top: 50,
    left: 15,
  },
  progress: {
    paddingLeft: 80,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsIcon: {
    width: 20,
    height: 20,
    tintColor: '#fff',
  },
  statsValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  statsTitle: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 10,
  },

  // Progress Section Styles
  progressText: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  percentageText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  insetBox: {
    backgroundColor: UI.surface,
    borderRadius: 16,
    // fake inner shadow by opposing borders
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderBottomWidth: 2,
    borderRightWidth: 2,
    borderTopColor: UI.dark,
    borderLeftColor: UI.dark,
    borderBottomColor: UI.light,
    borderRightColor: UI.light,
  },

  /* RAISED helper (popped-out) */
  raisedBox: {
    backgroundColor: UI.surface,
    borderRadius: 16,
    ...commonRaisedShadow,
    ...commonLightRim,
  },

  /* stronger lift for big intro card */
  raisedBoxStrong: {
    backgroundColor: UI.surface,
    borderRadius: 18,
    shadowColor: UI.dark,
    shadowOffset: { width: 12, height: 12 },
    shadowOpacity: 1,
    shadowRadius: 14,
    ...(Platform.OS === 'android' ? { elevation: 10 } : null),
    ...commonLightRim,
  },

  /* Search */
  searchBox: {
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 3,
    marginBottom: 16,
  },
  searchInput: { fontSize: 14, color: UI.text },

  /* Row */
  scrollcard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 16,
    marginBottom: 14,
    backgroundColor: UI.surface,
  },
  cardText: { fontSize: 14, color: UI.text, fontWeight: '600' },

  /* Expanded */
  answerWrap: {
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 14,
    backgroundColor: UI.surface,
  },
  answerText: { fontSize: 12, color: UI.sub },

  /* Plus/Minus */
  pmWrap: {
    width: 30,
    height: 30,
    borderRadius: 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: UI.surface,
  },
  hBar: {
    position: 'absolute',
    width: 12,
    height: 2.6,
    borderRadius: 2,
    backgroundColor: '#6B7280',
  },
  vBar: {
    position: 'absolute',
    width: 2.6,
    height: 12,
    borderRadius: 2,
    backgroundColor: '#6B7280',
  },

  /* Pagination Styles */
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 20,
    paddingHorizontal: 10,
  },
  paginationButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: '#7209b7',
  },
  paginationButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  disabledButton: {
    backgroundColor: '#cccccc',
    opacity: 0.5,
  },
  disabledButtonText: {
    color: '#000000',
  }
  ,
  pageInfo: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },

  /* Start Challenge Button */
  startChallengeButton: {
    marginBottom: 3,
    borderRadius: 12,
    overflow: 'hidden',
  },
  gradientButton: {
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  startChallengeText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },

  /* Help + CTA */
  helpTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: UI.primary,
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 6,
  },
  helpText: {
    fontSize: 12,
    color: UI.sub,
    textAlign: 'center',
    marginBottom: 14,
    paddingHorizontal: 20,
  },
  supportBtn: { borderRadius: 16, paddingVertical: 14, alignItems: 'center', marginBottom: 20 },
  supportBtnText: { color: UI.text, fontSize: 14, fontWeight: '700' },

  /* Intro content */
  bigCard: { padding: 16, marginBottom: 12, borderRadius: 18, backgroundColor: UI.surface },
  bigCardText: { fontSize: 16, lineHeight: 22, color: UI.sub, fontWeight: '800' },
  smallCard: { paddingVertical: 14, paddingHorizontal: 14, marginBottom: 12, borderRadius: 14 },
  smallCardText: { fontSize: 13, color: UI.sub, fontWeight: '600' },

  //Modal 
  modal: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  modalContent: {
    width: width * 0.75,   // 3/4 screen width
    height: '100%',
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
    overflow: 'hidden',
  },
});
