import React, { useRef, useState } from 'react';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import PagerView from 'react-native-pager-view';
import { LinearGradient } from 'expo-linear-gradient';
import Header from '~/components/shared/Header';
import { COLORS } from '~/constants';

// Import components
import EmailHelp from '~/components/HelpCenter/EmailHelp';
import ProfileHelp from '~/components/HelpCenter/ProfileHelp';
import PasswordHelp from '~/components/HelpCenter/PasswordHelp';
import AttendanceHelp from '~/components/HelpCenter/Attendencehelp';
import PaymentHelp from '~/components/HelpCenter/PayementHelp';
import LoginHelp from '~/components/HelpCenter/LoginHelp';
import ClassessHelp from '~/components/HelpCenter/ClassessHelp';

const HelpCenter = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const pagerRef = useRef<PagerView>(null);
  const scrollViewRef = useRef<ScrollView>(null);

  const tabData = [
    { key: 'Mail', count: 0, component: <EmailHelp /> },
    { key: 'Profile', count: 1, component: <ProfileHelp /> },
    { key: 'Classes', count: 0, component: <ClassessHelp /> },
    { key: 'Password', count: 2, component: <PasswordHelp /> },
    { key: 'Attendance', count: 3, component: <AttendanceHelp /> },
    { key: 'Payment', count: 1, component: <PaymentHelp /> },
    { key: 'Login & Sign Up', count: 0, component: <LoginHelp /> },
  ];

  const scrollToTab = (index: number) => {
    const tabWidth = 200;
    const screenOffset = index * tabWidth - tabWidth;
    scrollViewRef.current?.scrollTo({
      x: screenOffset > 0 ? screenOffset : 0,
      animated: true,
    });
  };

  return (
    <>
      <StatusBar backgroundColor={COLORS.black} barStyle="light-content" />
      <SafeAreaView edges={['top']} style={styles.container}>
        <Header />
        <View>
          <Text style={styles.headerText}>Help Centre</Text>

          <ScrollView
            ref={scrollViewRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {tabData.map(({ key, count }, index) => {
              const isActive = selectedTab === index;
              return (
                <TouchableOpacity
                  key={key}
                  onPress={() => {
                    setSelectedTab(index);
                    pagerRef.current?.setPage(index);
                    scrollToTab(index);
                  }}
                  activeOpacity={0.9}
                >
                  {isActive ? (
                    <LinearGradient
                      colors={['#7B00FF', '#B200FF']}
                      start={{ x: 0.134, y: 0.021 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.activeBoxGradient}
                    >
                      <Text style={[styles.boxText, styles.activeBoxText]}>
                        {key}
                      </Text>
                      <View style={[styles.countBadge, styles.activeBadge]}>
                        <Text
                          style={[styles.countText, styles.activeCountText]}
                        >
                          {count}
                        </Text>
                      </View>
                    </LinearGradient>
                  ) : (
                    <View style={[styles.box, styles.inactiveBox]}>
                      <Text style={[styles.boxText, styles.inactiveBoxText]}>
                        {key}
                      </Text>
                      <View style={[styles.countBadge, styles.inactiveBadge]}>
                        <Text
                          style={[styles.countText, styles.inactiveCountText]}
                        >
                          {count}
                        </Text>
                      </View>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        <View style={styles.searchContainer}>
          <TextInput placeholder="Search" style={styles.searchInput} />
        </View>

        <PagerView
          ref={pagerRef}
          style={{ flex: 1 }}
          initialPage={selectedTab}
          onPageSelected={(e) => {
            const index = e.nativeEvent.position;
            setSelectedTab(index);
            scrollToTab(index);
          }}
        >
          {tabData.map((item, index) => (
            <View key={index} style={styles.contentArea}>
              {item.component}
            </View>
          ))}
        </PagerView>
      </SafeAreaView>
    </>
  );
};

export default HelpCenter;

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    paddingTop: 10, 
    backgroundColor: COLORS.white 
  },
  headerText: { 
    paddingHorizontal: 20, 
    paddingVertical: 10, 
    fontSize: 22, 
    fontWeight: 'bold' 
  },
  scrollContent: { 
    paddingHorizontal: 10, 
    gap: 10 
  },
  box: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingHorizontal: 15, 
    height: 45, 
    width: 200, 
    justifyContent: 'space-between', 
    borderRadius: 8 
  },

  activeBoxGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    height: 45,
    width: 200,
    justifyContent: 'space-between',
    borderRadius: 8,
    // Closest approximation to multiple shadows - using the most prominent one
    shadowColor: '#BDC2C7',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.75,
    shadowRadius: 8,
    elevation: 8,
  },

  inactiveBox: {
    backgroundColor: '#EBEFF3',
    borderRadius: 8,
    // Inactive shadow styling
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.75,
    shadowRadius: 8,
    elevation: 5,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    height: 45,
    width: 200,
  },

  boxText: { 
    fontSize: 16, 
    fontWeight: '600' 
  },
  activeBoxText: { 
    color: '#FFF' 
  },
  inactiveBoxText: { 
    color: '#333' 
  },

  countBadge: { 
    marginLeft: 8, 
    minWidth: 22, 
    height: 22, 
    borderRadius: 6, 
    justifyContent: 'center', 
    alignItems: 'center', 
    paddingHorizontal: 6 
  },
  activeBadge: { 
    backgroundColor: '#FFF',
    shadowColor: '#9C01FF',
    shadowOffset: { width: -2, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  inactiveBadge: {
    backgroundColor: '#EBEFF3',
    shadowColor: '#BDC2C7',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.6,
    shadowRadius: 4,
    elevation: 3,
    borderRadius: 6,
    minWidth: 22,
    height: 22,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },

  countText: { 
    fontSize: 12, 
    fontWeight: 'bold' 
  },
  activeCountText: { 
    color: '#B200FF' 
  },
  inactiveCountText: { 
    color: '#333' 
  },

  contentArea: { 
    flex: 1, 
    padding: 15 
  },
  searchContainer: { 
    paddingHorizontal: 15, 
    marginVertical: 10 
  },
  searchInput: { 
    borderWidth: 1, 
    borderColor: '#ccc', 
    borderRadius: 10, 
    paddingHorizontal: 12, 
    paddingVertical: 8, 
    fontSize: 16, 
    backgroundColor: '#fff' 
  },
});