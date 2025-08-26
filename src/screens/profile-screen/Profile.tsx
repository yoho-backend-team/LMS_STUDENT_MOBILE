import React, { useState } from 'react';
import {
  StatusBar,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  TextInput,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Pencil, Download, Eye } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';

const COLORS = {
  black: '#000000',
  white: '#ffffff',
  primary: '#8b5cf6',
  secondary: '#7c3aed',
  gray: '#6b7280',
  lightGray: '#f3f4f6',
  darkGray: '#374151',
  background: '#f9fafb',
};

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [profileData, setProfileData] = useState({
    mailAddress: 'albert@gmail.com',
    name: 'Albert Einstein',
    gender: 'Male',
    contactNumber: '6754789856',
    dateOfBirth: '12/03/1984',
    pinCode: '675423',
    address: 'No.8,Library Road',
    course: 'React',
    batch: '2023',
    rollNumber: '675434567898',
    studentID: 'LMS173N221',
  });

  const tabs = [
    {
      id: 'profile',
      label: 'Profile Information',
      icon: require('../../assets/profile/profile.png'),
    },
    { id: 'certificate', label: 'Certificate', icon: require('../../assets/profile/certi.png') },
    { id: 'idcard', label: 'ID Card', icon: require('../../assets/profile/id.png') },
  ];
  const tabTitles: Record<string, string> = {
    profile: 'Profile',
    certificate: 'Certificate',
    idcard: 'ID Card',
  };

  const handleInputChange = (field: any, value: any) => {
    setProfileData({
      ...profileData,
      [field]: value,
    });
  };

  const handleSubmit = () => {
    console.log('Profile data submitted:', profileData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const renderProfileContent = () => (
    <>
      <View style={styles.certificateContainer}>
        {/* Personal Info Section */}
        <Text style={styles.sectionTitle}>Personal Information</Text>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Mail Address</Text>
          <TextInput
            style={styles.input}
            value={profileData.mailAddress}
            onChangeText={(text) => handleInputChange('mailAddress', text)}
            placeholder="Enter here..."
            editable={isEditing}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Name</Text>
          <TextInput
            style={styles.input}
            value={profileData.name}
            onChangeText={(text) => handleInputChange('name', text)}
            placeholder="Enter here..."
            editable={isEditing}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Gender</Text>
          <TextInput
            style={styles.input}
            value={profileData.gender}
            onChangeText={(text) => handleInputChange('gender', text)}
            placeholder="Enter here..."
            editable={isEditing}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Contact Number</Text>
          <TextInput
            style={styles.input}
            value={profileData.contactNumber}
            onChangeText={(text) => handleInputChange('contactNumber', text)}
            placeholder="Enter here..."
            editable={isEditing}
            keyboardType="phone-pad"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Date Of Birth</Text>
          <TextInput
            style={styles.input}
            value={profileData.dateOfBirth}
            onChangeText={(text) => handleInputChange('dateOfBirth', text)}
            placeholder="Enter here..."
            editable={isEditing}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Pin Code</Text>
          <TextInput
            style={styles.input}
            value={profileData.pinCode}
            onChangeText={(text) => handleInputChange('pinCode', text)}
            placeholder="Enter here..."
            editable={isEditing}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Address</Text>
          <TextInput
            style={[styles.input, { height: 80, textAlignVertical: 'top' }]}
            value={profileData.address}
            onChangeText={(text) => handleInputChange('address', text)}
            placeholder="Enter here..."
            editable={isEditing}
            multiline={true}
          />
        </View>

        {/* Institute Info Section */}
        <Text style={styles.sectionTitle}>Institute Information</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Course</Text>
          <TextInput
            style={styles.input}
            value={profileData.course}
            onChangeText={(text) => handleInputChange('course', text)}
            placeholder="Enter here..."
            editable={isEditing}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Batch</Text>
          <TextInput
            style={styles.input}
            value={profileData.batch}
            onChangeText={(text) => handleInputChange('batch', text)}
            placeholder="Enter here..."
            editable={isEditing}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Roll Number</Text>
          <TextInput
            style={styles.input}
            value={profileData.rollNumber}
            onChangeText={(text) => handleInputChange('rollNumber', text)}
            placeholder="Enter here..."
            editable={isEditing}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Student ID</Text>
          <TextInput
            style={styles.input}
            value={profileData.studentID}
            onChangeText={(text) => handleInputChange('studentID', text)}
            placeholder="Enter here..."
            editable={isEditing}
          />
        </View>
      </View>

      {/* Action Buttons - Only show when editing */}
      {isEditing && (
        <View style={styles.btnRow}>
          <TouchableOpacity style={styles.cancelBtn} onPress={handleCancel}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
            <Text style={styles.submitText}>Submit</Text>
          </TouchableOpacity>
        </View>
      )}
    </>
  );

  const renderCertificateContent = () => (
    <View style={styles.certificateContainer}>
      {/* Card 1 */}
      <View style={styles.card}>
        <Image source={require('../../assets/profile/card1.png')} style={styles.cardImage} />

        <View style={styles.contentRow}>
          <View style={styles.textContainer}>
            <Text style={styles.cardText}>Course Name: HTML, CSS</Text>
            <Text style={styles.cardText}>Duration: 3 Month</Text>
          </View>

          <Image source={require('../../assets/profile/down.png')} style={styles.downIcon} />
        </View>
      </View>

      {/* Card 2 */}
      <View style={styles.card}>
        <Image source={require('../../assets/profile/card2.png')} style={styles.cardImage} />

        <View style={styles.contentRow}>
          <View style={styles.textContainer}>
            <Text style={styles.cardText}>Course Name: Java Script</Text>
            <Text style={styles.cardText}>Duration: 3 Month</Text>
          </View>

          <Image source={require('../../assets/profile/down.png')} style={styles.downIcon} />
        </View>
      </View>
    </View>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'certificate':
        return renderCertificateContent();

      case 'idcard':
        return (
          <View style={styles.certificateContainer}>
            <View style={styles.card}>
              {/* Left side: Profile image */}
              <Image source={require('../../assets/profile/grl.png')} style={styles.cardImag} />

              {/* Middle: Texts + Right: Download icon */}
              <View style={styles.contentRow}>
                <View style={styles.textContainer}>
                  <Text style={styles.cardText}>Name: Musk</Text>
                  <Text style={styles.cardText}>Course Name: HTML, CSS</Text>
                  <Text style={styles.cardText}>Institute Name: Anna Uni</Text>
                </View>

                <Image source={require('../../assets/profile/down.png')} style={styles.downIcon} />
              </View>
            </View>
          </View>
        );

      default:
        return renderProfileContent();
    }
  };

  // const renderTabItem = ({ item }) => (
  //   <TouchableOpacity
  //     style={[styles.tabBtn, activeTab === item.id && styles.activeTab]}
  //     onPress={() => setActiveTab(item.id)}>
  //     <Text style={[styles.tabBtnText, activeTab === item.id && styles.activeTabText]}>
  //       {item.label}
  //     </Text>
  //   </TouchableOpacity>
  // );

  const navigation = useNavigation();

  return (
    <>
      <StatusBar backgroundColor={COLORS.black} barStyle="light-content" />
      <SafeAreaView edges={['top']} style={styles.container}>
        {/* Fixed Profile Section */}
        <View style={styles.fixedSection}>
          {/* Title */}
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Image source={require('../../assets/profile/back.png')} style={styles.backbutton} />
            </TouchableOpacity>
            <Text style={styles.title}>{tabTitles[activeTab]}</Text>
          </View>

          {/* Profile Card */}
          <View style={styles.certificateContainer}>
            <View style={styles.card}>
              <View style={styles.profileInfo}>
                <View style={styles.avatarContainer}>
                  <Image source={require('../../assets/profile/man.png')} style={styles.avatar} />
                  {/* Instagram-style edit icon */}
                  <TouchableOpacity
                    style={styles.editBtn}
                    activeOpacity={0.7}
                    onPress={() => setIsEditing(!isEditing)}>
                    <Pencil size={16} color="black" />
                  </TouchableOpacity>
                </View>
                <Text style={styles.name}>{profileData.name}</Text>
                <Text style={styles.subText}>Trainee ID: {profileData.studentID}</Text>
              </View>
            </View>

            {/* Horizontal Scrollable Tab Buttons */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.tabScrollView}
              contentContainerStyle={styles.tabScrollContent}>
              {tabs.map((tab) => (
                <TouchableOpacity
                  key={tab.id}
                  style={[styles.tabBtn, activeTab === tab.id && styles.activeTab]}
                  onPress={() => setActiveTab(tab.id)}>
                  <Image source={tab.icon} style={styles.tabIcon} />
                  <Text style={[styles.tabBtnText, activeTab === tab.id && styles.activeTabText]}>
                    {tab.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>

        {/* Scrollable Content Section */}
        <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollSection}>
          {renderContent()}
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ebeff3',
  },
  fixedSection: {
    padding: 16,
  },
  scrollSection: {
    flex: 1,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.darkGray,
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#ebeff3',
    borderRadius: 16,
    padding: 16,

    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
    position: 'relative',
    marginBottom: 16,
  },
  editBtn: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#e5e5e5', // light gray
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#ebeff3', // white border
  },

  profileInfo: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    width: 100,
    height: 100,
    marginBottom: 12,
    borderRadius: 100 / 2,
    resizeMode: 'cover',
  },
  avatarContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },

  name: {
    fontSize: 20,
    fontWeight: '700',
    color: '#7B00FF',
    marginBottom: 4,
  },
  subText: {
    fontSize: 16,
    color: '#716F6F',
    fontWeight: '500',
  },
  // Tab Scroll View
  tabScrollView: {},
  tabScrollContent: {
    paddingHorizontal: 4,
  },
  tabBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    marginHorizontal: 6,
    backgroundColor: '#ebeff3',
    width: 271,
    height: 72,

    // 👇 Add border
    borderWidth: 1,
    borderColor: '#d1d5db',
  },

  activeTab: {
    backgroundColor: '#7B00FF',
  },
  tabBtnText: {
    color: COLORS.gray,
    fontWeight: '600',
    fontSize: 18,
    textAlign: 'center',
  },
  activeTabText: {
    color: COLORS.white,
  },
  // Section Titles
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2A2A2A',
    marginBottom: 10,
  },
  // Input Groups
  inputGroup: {
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    color: '#2A2A2A',
    fontWeight: '700',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    fontWeight: '500',
    color: '#716F6F',
    backgroundColor: '#ebeff3',
  },
  // Buttons
  btnRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
    marginBottom: 40,
  },
  cancelBtn: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    backgroundColor: COLORS.lightGray,
    marginRight: 8,
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#716F6F',
  },
  submitBtn: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    backgroundColor: '#7B00FF',
    marginLeft: 8,
    alignItems: 'center',
  },
  submitText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.white,
  },
  // Certificate Styles
  certificateContainer: {
    backgroundColor: '#ebeff3',
    borderRadius: 16,
    padding: 15,
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  certificateHeader: {
    borderBottomWidth: 2,
    borderBottomColor: COLORS.primary,
    paddingBottom: 16,
    marginBottom: 16,
    alignItems: 'center',
  },
  certificateTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.darkGray,
    marginBottom: 8,
  },
  certificateSubtitle: {
    fontSize: 16,
    color: COLORS.gray,
    marginBottom: 4,
  },
  certificateInstructor: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
  },
  certificateDetails: {
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: COLORS.gray,
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 14,
    color: COLORS.darkGray,
    fontWeight: '600',
  },
  certificateFooter: {
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
    paddingTop: 16,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: COLORS.gray,
    marginBottom: 8,
  },
  footerInstructor: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.darkGray,
  },
  certificateActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.secondary,
    padding: 12,
    borderRadius: 10,
    gap: 8,
  },
  actionButtonText: {
    color: COLORS.white,
    fontWeight: '600',
    fontSize: 14,
  },
  comingSoon: {
    textAlign: 'center',
    fontSize: 18,
    color: COLORS.gray,
    marginTop: 40,
    fontWeight: '600',
  },

  cardImage: {
    width: '100%',
    height: 180,
    borderRadius: 8,
    resizeMode: 'cover',
  },
  cardText: {
    marginTop: 6,
    fontSize: 16,
    fontWeight: '700',
    color: '#716F6F',
  },
  cardImag: {
    width: 250,
    height: 250,
    borderRadius: 8,
    resizeMode: 'cover',
    marginBottom: 10,
  },
  backbutton: {
    width: 48,
    height: 48,
    resizeMode: 'contain',
  },
  tabIcon: {
    width: 48,
    height: 48,
    resizeMode: 'contain',
  },
  contentRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
  },
  downIcon: {
    width: 48,
    height: 48,
    marginLeft: 12,
    resizeMode: 'contain',
  },
});
