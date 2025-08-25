import { useNavigation } from '@react-navigation/native';
import { ScrollView, StatusBar, Dimensions, Platform, TouchableOpacity, LayoutAnimation, Image, StyleSheet, Text, View, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '~/constants';
import Svg, { Circle } from 'react-native-svg';
import React, { useState } from 'react';
import LearningPathSteps from "./LearningPathSteps";

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
  { question: 'Introduction', answer: 'This is the introduction answer.' },
  { question: 'How To Access Payil?', answer: 'You can access Payil from the dashboard.' },
  { question: 'About Payil Dashboard', answer: 'The dashboard shows all courses and progress.' },
  { question: 'About Payil Courses', answer: 'Courses include video, notes, and exercises.' },
  { question: 'How To Access Payil Subject', answer: 'Click on a subject to view its content.' },
  { question: 'How to add a new course?', answer: 'Go to the add course section.' },
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

  const toggleExpand = (index: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const [isFilterOpen, setFilterOpen] = useState(false);

  const statsCards = [
    {
      title: 'Total Classes',
      value: '0',
      icon: require('../../assets/home/card1icon.png'),
      color: '#22D3EE',
      bgColor: COLORS.white,
    },
    {
      title: 'Total Completed Claas',
      value: '0',
      icon: require('../../assets/home/card6img.png'),
      color: '#6366F1',
      bgColor: COLORS.white,
    },
    {
      title: 'Completed (Liveclass)',
      value: '0',
      icon: require('../../assets/home/card2icon.png'),
      color: '#10B981',
      bgColor: COLORS.white,
    },
    {
      title: 'Completed (Offline)',
      value: '0',
      icon: require('../../assets/home/card4img.png'),
      color: '#EC4899',
      bgColor: COLORS.white,
    }
  ];

  return (
    <>
      <StatusBar backgroundColor={COLORS.black} barStyle="light-content" />
      <SafeAreaView edges={['top']} style={styles.container}>
        <ScrollView
          style={styles.scrollContainer}
          contentContainerStyle={{ paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}>
          
          {/* Header */}
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
              <Text style={styles.cardTitle}>Choose Your Language</Text>
            </View>

            <View>
              {faqs
                .filter((i) => i.question.toLowerCase().includes(search.toLowerCase()))
                .map((item, index) => {
                  const open = expandedIndex === index;
                  return (
                    <React.Fragment key={index}>
                      {/* Row – RAISED (popped-out) */}
                      <View style={[styles.scrollcard, styles.insetBox]}>
                        <View style={{ flex: 1 }}>
                          <Text style={styles.cardText}>{item.question}</Text>
                        </View>
                        <TouchableOpacity activeOpacity={0.8} onPress={() => toggleExpand(index)}>
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
            </View>
          </View>
        </ScrollView>
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