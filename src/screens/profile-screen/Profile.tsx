import { useEffect, useState } from 'react';
import {
  StatusBar,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  ActivityIndicator,
  RefreshControl,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Pencil, Camera } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { getStudentProfileThunk } from '~/features/Profile/reducer/thunks';
import { selectProfile } from '~/features/Profile/reducer/selectors';
import { getImageUrl } from '~/utils/imageUtils';
import { updateStudentProfile, uploadProfileImage } from '~/features/Profile/services';
import * as ImagePicker from 'expo-image-picker';
import toast from '~/utils/toasts';
import DateTimePicker from '@react-native-community/datetimepicker';

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

// Helper function to format date as DD-MM-YYYY
const formatDateToDDMMYYYY = (date: Date | string | null): string => {
  if (!date) return '';

  const dateObj = typeof date === 'string' ? new Date(date) : date;

  if (isNaN(dateObj.getTime())) return '';

  const day = dateObj.getDate().toString().padStart(2, '0');
  const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
  const year = dateObj.getFullYear();

  return `${day}-${month}-${year}`;
};

// Helper function to convert DD-MM-YYYY to timestamp
const convertDDMMYYYYToTimestamp = (dateString: string): string | null => {
  if (!dateString) return null;

  const [day, month, year] = dateString.split('-').map(Number);

  if (isNaN(day) || isNaN(month) || isNaN(year)) return null;

  const date = new Date(year, month - 1, day);

  if (isNaN(date.getTime())) return null;

  return date.toISOString();
};

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [profileData, setProfileData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    gender: '',
    dateOfBirth: '',
    contact_info: {
      phone_number: '',
      alternate_phone_number: '',
      address1: '',
      address2: '',
      pincode: '',
    },
    course: '',
    batch: '',
    rollNumber: '',
    studentID: '',
  });

  const [originalProfileData, setOriginalProfileData] = useState({ ...profileData });

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

  const dispatch = useDispatch<any>();
  const profileDetails = useSelector(selectProfile);

  useEffect(() => {
    dispatch(getStudentProfileThunk({}));
  }, [dispatch]);

  useEffect(() => {
    if (profileDetails && profileDetails.data) {
      const data = profileDetails.data;
      const userDetail = data.userDetail || {};
      const course = userDetail.course || {};

      const newProfileData = {
        first_name: data.first_name || '',
        last_name: data.last_name || '',
        email: data.email || '',
        gender: data.gender || '',
        dateOfBirth: data.dob ? formatDateToDDMMYYYY(data.dob) : '',
        contact_info: {
          phone_number: data.contact_info?.phone_number || '',
          alternate_phone_number: data.contact_info?.alternate_phone_number || '',
          address1: data.contact_info?.address1 || '',
          address2: data.contact_info?.address2 || '',
          pincode: data.contact_info?.pincode?.toString() || '',
        },
        course: course.course_name || '',
        batch: 'Batch 2024-25',
        rollNumber: data.roll_no?.toString() || '',
        studentID: userDetail.studentId || '',
      };

      setProfileData(newProfileData);
      setOriginalProfileData(JSON.parse(JSON.stringify(newProfileData)));
    }
  }, [profileDetails]);

  const onRefresh = () => {
    setRefreshing(true);
    dispatch(getStudentProfileThunk({})).then(() => {
      setRefreshing(false);
    });
  };

  const handleImageUpload = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (permissionResult.status !== 'granted') {
        toast.error('Permission Denied', 'You need to allow access to your gallery!');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const imageUri = result.assets[0].uri;
        await uploadImageToServer(imageUri);
      }
    } catch (error) {
      console.error('Error in image upload:', error);
      toast.error('Error', 'Failed to select image. Please try again.');
    }
  };

  const uploadImageToServer = async (imageUri: string) => {
    setIsUploadingImage(true);

    try {
      const formData = new FormData();
      formData.append('file', {
        uri: imageUri,
        type: 'image/jpeg',
        name: `${profileData?.first_name}_${Date.now()}.jpg`,
      } as any);

      const response = await uploadProfileImage(formData);

      if (response && response?.data) {
        const updateResponse = await updateStudentProfile({
          image: response?.data?.data?.file,
        });

        console.log(updateResponse, 'profile update response');

        if (updateResponse) {
          setIsEditing(false);
          dispatch(getStudentProfileThunk({}));
          toast.success('Success', 'Profile image updated successfully!');
        }
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Upload Error', 'Failed to upload image. Please try again.');
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');

      setProfileData((prev: any) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setProfileData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);

    if (selectedDate) {
      const formattedDate = formatDateToDDMMYYYY(selectedDate);
      setProfileData((prev) => ({
        ...prev,
        dateOfBirth: formattedDate,
      }));
    }
  };

  const showDatepicker = () => {
    setShowDatePicker(true);
  };

  const hasChanges = () => {
    return JSON.stringify(profileData) !== JSON.stringify(originalProfileData);
  };

  const handleSubmit = async () => {
    if (!hasChanges()) {
      toast.info('Info', 'No changes detected to save.');
      return;
    }

    setIsSaving(true);

    try {
      const dobTimestamp = convertDDMMYYYYToTimestamp(profileData.dateOfBirth);

      const transformedData = {
        contact_info: {
          phone_number: profileData.contact_info.phone_number,
          alternate_phone_number: profileData.contact_info.alternate_phone_number,
          address1: profileData.contact_info.address1,
          address2: profileData.contact_info.address2,
          pincode: Number.parseInt(profileData.contact_info.pincode) || null,
        },
        first_name: profileData.first_name,
        last_name: profileData.last_name,
        full_name: `${profileData.first_name} ${profileData.last_name}`,
        gender: profileData.gender,
        dob: dobTimestamp,
      };

      const response = await updateStudentProfile(transformedData);

      if (response) {
        dispatch(getStudentProfileThunk({}));
        toast.success('Success', 'Profile updated successfully!');
        setIsEditing(false);
      } else {
        toast.error('Error', 'Failed to update profile. Please try again.');
      }
    } catch (error) {
      console.error('Failed to update profile:', error);
      toast.error('Error', 'Failed to update profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (hasChanges()) {
      Alert.alert(
        'Discard Changes',
        'You have unsaved changes. Are you sure you want to discard them?',
        [
          {
            text: 'Keep Editing',
            style: 'cancel',
          },
          {
            text: 'Discard',
            style: 'destructive',
            onPress: () => {
              setProfileData(JSON.parse(JSON.stringify(originalProfileData)));
              setIsEditing(false);
            },
          },
        ]
      );
      return;
    }

    setIsEditing(false);
  };

  const handleEditClick = () => {
    if (!isEditing) {
      setOriginalProfileData(JSON.parse(JSON.stringify(profileData)));
    }
    setIsEditing(!isEditing);
  };

  const renderProfileContent = () => (
    <>
      <View style={styles.certificateContainer}>
        <Text style={styles.sectionTitle}>Personal Information</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>First Name*</Text>
          <TextInput
            style={styles.input}
            value={profileData.first_name}
            onChangeText={(text) => handleInputChange('first_name', text)}
            placeholder="Enter first name..."
            editable={isEditing}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Last Name*</Text>
          <TextInput
            style={styles.input}
            value={profileData.last_name}
            onChangeText={(text) => handleInputChange('last_name', text)}
            placeholder="Enter last name..."
            editable={isEditing}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email Address</Text>
          <TextInput
            style={[styles.input, { backgroundColor: '#e5e5e5' }]}
            value={profileData.email}
            placeholder="Email address"
            editable={false}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Gender</Text>
          <TextInput
            style={styles.input}
            value={profileData.gender}
            onChangeText={(text) => handleInputChange('gender', text)}
            placeholder="Enter gender..."
            editable={isEditing}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Date Of Birth</Text>
          <TouchableOpacity onPress={isEditing ? showDatepicker : undefined} disabled={!isEditing}>
            <TextInput
              style={[styles.input, !isEditing && { backgroundColor: '#e5e5e5' }]}
              value={profileData.dateOfBirth}
              placeholder="DD-MM-YYYY"
              editable={false}
              pointerEvents="none"
            />
          </TouchableOpacity>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            style={styles.input}
            value={profileData.contact_info.phone_number}
            onChangeText={(text) => handleInputChange('contact_info.phone_number', text)}
            placeholder="Enter phone number..."
            editable={isEditing}
            keyboardType="phone-pad"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Alternate Phone Number</Text>
          <TextInput
            style={styles.input}
            value={profileData.contact_info.alternate_phone_number}
            onChangeText={(text) => handleInputChange('contact_info.alternate_phone_number', text)}
            placeholder="Enter alternate phone number..."
            editable={isEditing}
            keyboardType="phone-pad"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Address Line 1</Text>
          <TextInput
            style={[styles.input, { height: 80, textAlignVertical: 'top' }]}
            value={profileData.contact_info.address1}
            onChangeText={(text) => handleInputChange('contact_info.address1', text)}
            placeholder="Enter address line 1..."
            editable={isEditing}
            multiline={true}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Address Line 2</Text>
          <TextInput
            style={[styles.input, { height: 80, textAlignVertical: 'top' }]}
            value={profileData.contact_info.address2}
            onChangeText={(text) => handleInputChange('contact_info.address2', text)}
            placeholder="Enter address line 2..."
            editable={isEditing}
            multiline={true}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Pin Code</Text>
          <TextInput
            style={styles.input}
            value={profileData.contact_info.pincode}
            onChangeText={(text) => handleInputChange('contact_info.pincode', text)}
            placeholder="Enter pin code..."
            editable={isEditing}
            keyboardType="numeric"
          />
        </View>

        <Text style={styles.sectionTitle}>Institute Information</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Course</Text>
          <TextInput
            style={[styles.input, { backgroundColor: '#e5e5e5' }]}
            value={profileData.course}
            placeholder="Course"
            editable={false}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Batch</Text>
          <TextInput
            style={[styles.input, { backgroundColor: '#e5e5e5' }]}
            value={profileData.batch}
            placeholder="Batch"
            editable={false}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Roll Number</Text>
          <TextInput
            style={[styles.input, { backgroundColor: '#e5e5e5' }]}
            value={profileData.rollNumber}
            placeholder="Roll number"
            editable={false}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Student ID</Text>
          <TextInput
            style={[styles.input, { backgroundColor: '#e5e5e5' }]}
            value={profileData.studentID}
            placeholder="Student ID"
            editable={false}
          />
        </View>
      </View>

      {showDatePicker && (
        <DateTimePicker
          value={
            profileData.dateOfBirth
              ? new Date(convertDDMMYYYYToTimestamp(profileData.dateOfBirth) || new Date())
              : new Date()
          }
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleDateChange}
          maximumDate={new Date()}
        />
      )}

      {isEditing && (
        <View style={styles.btnRow}>
          <TouchableOpacity style={styles.cancelBtn} onPress={handleCancel}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.submitBtn, isSaving && styles.disabledBtn]}
            onPress={handleSubmit}
            disabled={isSaving}>
            <Text style={styles.submitText}>{isSaving ? 'Saving...' : 'Submit'}</Text>
          </TouchableOpacity>
        </View>
      )}
    </>
  );

  const renderCertificateContent = () => {
    const completedCourses = profileDetails?.data?.userDetail?.completed_courses || [];
    const currentCourse = profileDetails?.data?.userDetail?.course;

    const allCourses = [];

    if (currentCourse) {
      allCourses.push({
        ...currentCourse,
        status: 'In Progress',
        cardImage: require('../../assets/profile/card1.png'),
      });
    }

    if (completedCourses.length > 0) {
      completedCourses.forEach((course: any) => {
        allCourses.push({
          ...course,
          status: 'Completed',
          cardImage: require('../../assets/profile/card2.png'),
        });
      });
    }

    return (
      <View style={styles.certificateContainer}>
        {allCourses.length > 0 ? (
          allCourses.map((course, index) => (
            <View key={index} style={styles.card}>
              <Image source={course.cardImage} style={styles.cardImage} />
              <View style={styles.contentRow}>
                <View style={styles.textContainer}>
                  <Text style={styles.cardText}>Course Name: {course.course_name}</Text>
                  <Text style={styles.cardText}>Duration: {course.duration}</Text>
                  <Text style={styles.cardText}>Status: {course.status}</Text>
                </View>
                <Image source={require('../../assets/profile/down.png')} style={styles.downIcon} />
              </View>
            </View>
          ))
        ) : (
          <View style={styles.card}>
            <Text style={styles.cardText}>No courses available</Text>
          </View>
        )}
      </View>
    );
  };

  const renderIDCardContent = () => (
    <View style={styles.certificateContainer}>
      <View style={[styles.card, { alignItems: 'center', padding: 20 }]}>
        <Text style={[styles.sectionTitle, { marginBottom: 20 }]}>Student ID Card</Text>

        {profileDetails?.data?.image ? (
          <Image
            source={{ uri: getImageUrl(profileDetails.data.image) }}
            style={styles.idCardImage}
          />
        ) : (
          <Image source={require('../../assets/profile/man.png')} style={styles.idCardImage} />
        )}

        <View style={styles.idCardInfo}>
          <Text style={styles.idCardName}>
            {profileData.first_name} {profileData.last_name}
          </Text>
          <Text style={styles.idCardText}>Student ID: {profileData.studentID}</Text>
          <Text style={styles.idCardText}>Roll No: {profileData.rollNumber}</Text>
          <Text style={styles.idCardText}>Course: {profileData.course}</Text>
          <Text style={styles.idCardText}>Batch: {profileData.batch}</Text>
        </View>
      </View>
    </View>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'certificate':
        return renderCertificateContent();
      case 'idcard':
        return renderIDCardContent();
      default:
        return renderProfileContent();
    }
  };

  const navigation = useNavigation();

  return (
    <>
      <StatusBar backgroundColor={COLORS.black} barStyle="light-content" />
      <SafeAreaView edges={['top']} style={styles.container}>
        <View style={styles.fixedSection}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Image source={require('../../assets/profile/back.png')} style={styles.backbutton} />
            </TouchableOpacity>
            <Text style={styles.title}>{tabTitles[activeTab]}</Text>
          </View>

          <View style={styles.certificateContainer}>
            <View style={styles.card}>
              <View style={styles.profileInfo}>
                <View style={styles.avatarContainer}>
                  {profileDetails?.data?.image ? (
                    <Image
                      source={{ uri: getImageUrl(profileDetails.data.image) }}
                      style={styles.avatar}
                    />
                  ) : (
                    <Image source={require('../../assets/profile/man.png')} style={styles.avatar} />
                  )}

                  {isEditing && (
                    <TouchableOpacity
                      style={styles.cameraBtn}
                      activeOpacity={0.7}
                      onPress={handleImageUpload}
                      disabled={isUploadingImage}>
                      {isUploadingImage ? (
                        <ActivityIndicator size="small" color="white" />
                      ) : (
                        <Camera size={16} color="white" />
                      )}
                    </TouchableOpacity>
                  )}

                  {!isEditing && activeTab === 'profile' && (
                    <TouchableOpacity
                      style={styles.editBtn}
                      activeOpacity={0.7}
                      onPress={handleEditClick}>
                      <Pencil size={16} color="black" />
                    </TouchableOpacity>
                  )}
                </View>
                <Text style={styles.name}>
                  {profileData.first_name} {profileData.last_name}
                </Text>
                <Text style={styles.subText}>Trainee ID: {profileData.studentID}</Text>
              </View>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.tabScrollView}
              contentContainerStyle={styles.tabScrollContent}>
              {tabs.map((tab) => (
                <TouchableOpacity
                  key={tab.id}
                  style={[styles.tabBtn, activeTab === tab.id && styles.activeTab]}
                  onPress={() => {
                    if (isEditing && tab.id !== 'profile') {
                      setIsEditing(false);
                    }
                    setActiveTab(tab.id);
                  }}>
                  <Image source={tab.icon} style={styles.tabIcon} />
                  <Text style={[styles.tabBtnText, activeTab === tab.id && styles.activeTabText]}>
                    {tab.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          style={styles.scrollSection}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
          {renderProfileContent()}
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
    backgroundColor: '#e5e5e5',
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#ebeff3',
  },
  cameraBtn: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#7B00FF',
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#ebeff3',
  },
  profileInfo: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    width: 100,
    height: 100,
    marginBottom: 12,
    borderRadius: 50,
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2A2A2A',
    marginBottom: 10,
  },
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
  disabledBtn: {
    backgroundColor: '#9CA3AF',
  },
  submitText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.white,
  },
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
  idCardImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
    resizeMode: 'cover',
  },
  idCardInfo: {
    alignItems: 'center',
  },
  idCardName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#7B00FF',
    marginBottom: 10,
  },
  idCardText: {
    fontSize: 16,
    color: '#716F6F',
    marginBottom: 5,
    fontWeight: '500',
  },
});
