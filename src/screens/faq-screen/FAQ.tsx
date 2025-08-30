import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { Image } from 'react-native';
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
  ViewStyle,
  TextStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { selectFaq } from '~/features/faq/reducers/selectors';
import { getFaqThunk } from '~/features/faq/reducers/thunks';

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

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

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

const FAQ = () => {
  const [search, setSearch] = useState('');
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const navigation = useNavigation<any>();
  const dispatch = useDispatch<any>();
  const selectData = useSelector(selectFaq)?.data;

  const getFaqData = async () => {
    await dispatch(
      getFaqThunk({
        instituteId: '973195c0-66ed-47c2-b098-d8989d3e4529',
        branchid: '90c93163-01cf-4f80-b88b-4bc5a5dd8ee4',
      })
    );
  };

  useEffect(() => {
    getFaqData();
  }, [dispatch]);

  const toggleExpand = (index: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <>
      <StatusBar backgroundColor={'#000'} barStyle="light-content" />
      <ImageBackground style={styles.background} resizeMode="cover">
        <SafeAreaView style={styles.container}>
          {/* Header */}
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Image source={require('../../assets/profile/back.png')} style={styles.backbutton} />
            </TouchableOpacity>
            <Text style={styles.header}>FAQ - Frequently Asked Questions</Text>
          </View>

          {/* Search – INSET (sunken look) */}
          <View style={[styles.searchBox, styles.insetBox]}>
            <TextInput
              placeholder="Search"
              placeholderTextColor="#98A2B3"
              style={styles.searchInput}
              value={search}
              onChangeText={setSearch}
            />
          </View>

          {/* FAQ List */}
          <ScrollView
            style={{ marginBottom: 20 }}
            contentContainerStyle={{ paddingBottom: 20 }}
            showsVerticalScrollIndicator={false}>
            {selectData
              ?.filter((i: any) => i.title.toLowerCase().includes(search.toLowerCase()))
              .map((item: any, index: any) => {
                const open = expandedIndex === index;
                return (
                  <React.Fragment key={index}>
                    {/* Row – RAISED (popped-out) */}
                    <View style={[styles.card, styles.insetBox]}>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.cardText}>{item.title}</Text>
                      </View>
                      <TouchableOpacity activeOpacity={0.8} onPress={() => toggleExpand(index)}>
                        <PlusMinusIcon open={open} />
                      </TouchableOpacity>
                    </View>

                    {/* Inline expanded content (same page) */}
                    {open &&
                      (item.description === 'Introduction' ? (
                        <IntroContent />
                      ) : (
                        <View style={[styles.answerWrap, styles.insetBox]}>
                          <Text style={styles.answerText}>{item.description}</Text>
                        </View>
                      ))}
                  </React.Fragment>
                );
              })}
          </ScrollView>

          {/* Help + CTA */}
          <Text style={styles.helpTitle}>Need More Help?</Text>
          <Text style={styles.helpText}>
            If You Have Any Further Questions, Feel Free To Reach Out To Our Support Team.
          </Text>

          {/* CTA – RAISED */}
          <TouchableOpacity style={[styles.supportBtn, styles.insetBox]} activeOpacity={0.9}>
            <Text style={styles.supportBtnText}>Contact Support</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </ImageBackground>
    </>
  );
};

export default FAQ;

/* ---------------- Typesafe Styles ---------------- */
type Styles = {
  background: ViewStyle;
  container: ViewStyle;
  backbutton: ViewStyle;
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

  /* helpers */
  insetBox: ViewStyle;
  raisedBox: ViewStyle;
  raisedBoxStrong: ViewStyle;
};

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

const styles = StyleSheet.create<any>({
  background: { flex: 1, backgroundColor: UI.bg },
  container: { flex: 1, paddingHorizontal: 16, paddingTop: 20 },

  backbutton: {
    width: 48,
    height: 48,
  },

  header: {
    fontSize: 18,
    fontWeight: '800',
    color: UI.text,
    textAlign: 'left',
    marginBottom: 16,
  },

  /* INSET helper (sunken look) */
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
  card: {
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
});
