import React, { useState } from 'react';
import { ScrollView, StatusBar, StyleSheet, Text, View, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '~/components/shared/Header';
import { COLORS } from '~/constants';

// Import your separate components
import EmailHelp from '~/components/HelpCenter/EmailHelp';
import ProfileHelp from '~/components/HelpCenter/ProfileHelp';
import PasswordHelp from '~/components/HelpCenter/PasswordHelp';
import AttendanceHelp from '~/components/HelpCenter/Attendencehelp';
import PaymentHelp from '~/components/HelpCenter/PayementHelp';
import LoginHelp from '~/components/HelpCenter/LoginHelp';
import ClassessHelp from '~/components/HelpCenter/ClassessHelp';

const HelpCenter = () => {
  const [selectedTab, setSelectedTab] = useState('Mail');

  const tabData = [
    { key: 'Mail', count: 0 },
    { key: 'Profile', count: 1 },
    { key: 'Classes', count: 0 },
    { key: 'Password', count: 2 },
    { key: 'Attendance', count: 3 },
    { key: 'Payment', count: 1 },
    { key: 'Login & Sign Up', count: 0 },
  ];

  const renderContent = () => {
    switch (selectedTab) {
      case 'Mail':
        return <EmailHelp />;
      case 'Profile':
        return <ProfileHelp />;
      case 'Password':
        return <PasswordHelp />;
      case 'Attendance':
        return <AttendanceHelp />;
      case 'Payment':
        return <PaymentHelp />;
      case 'Login':
        return <LoginHelp />;
      case 'Classes':
        return <ClassessHelp />;
      default:
        return <Text>Select a section</Text>;
    }
  };

  return (
    <>
      <StatusBar backgroundColor={COLORS.black} barStyle="light-content" />
      <SafeAreaView edges={['top']} style={styles.container}>
        <Header />
        <View>
          <Text style={styles.headerText}>Help Centre</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {tabData.map(({ key, count }) => (
              <TouchableOpacity
                key={key}
                style={[
                  styles.box,
                  selectedTab === key ? styles.activeBox : styles.inactiveBox,
                ]}
                onPress={() => setSelectedTab(key)}
              >
                <Text
                  style={[
                    styles.boxText,
                    selectedTab === key ? styles.activeBoxText : styles.inactiveBoxText,
                  ]}
                >
                  {key}
                </Text>
                <View
                  style={[
                    styles.countBadge,
                    selectedTab === key ? styles.activeBadge : styles.inactiveBadge,
                  ]}
                >
                  <Text
                    style={[
                      styles.countText,
                      selectedTab === key ? styles.activeCountText : styles.inactiveCountText,
                    ]}
                  >
                    {count}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <TextInput placeholder="Search" style={styles.searchInput} />
        </View>

        {/* Content area */}
        <View style={styles.contentArea}>{renderContent()}</View>
      </SafeAreaView>
    </>
  );
};

export default HelpCenter;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
    backgroundColor: COLORS.white,
  },
  headerText: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    fontSize: 22,
    fontWeight: 'bold',
  },
  scrollContent: {
    paddingHorizontal: 10,
    gap: 10,
  },
  box: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    height: 45,
    width: 200,
    justifyContent: 'space-between',
    borderRadius: 8,
  },
  activeBox: {
    backgroundColor: '#FF00FF', 
  },
  inactiveBox: {
    backgroundColor: '#F0F0F0',
  },
  boxText: {
    fontSize: 16,
    fontWeight: '600',
  },
  activeBoxText: {
    color: '#FFF',
  },
  inactiveBoxText: {
    color: '#333',
  },
  countBadge: {
    marginLeft: 8,
    minWidth: 22,
    height: 22,
    borderRadius: 2,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  activeBadge: {
    backgroundColor: '#FFF',  
    shadowColor: '#000',
  },
  inactiveBadge: {
    backgroundColor: '#DDD',
  },
  countText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  activeCountText: {
    color: '#FF00FF',
  },
  inactiveCountText: {
    color: '#333',
  },
  contentArea: {
    flex: 1,
    padding: 15,
  },
   searchContainer: {
    paddingHorizontal: 15,
    marginVertical: 10,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    backgroundColor: '#fff',
  },
});
