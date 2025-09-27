import { useEffect, useRef, useState } from 'react';
import { Picker } from '@react-native-picker/picker';
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
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Pencil, Camera } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { getStudentProfileThunk } from '~/features/Profile/reducer/thunks';
import { selectProfile } from '~/features/Profile/reducer/selectors';
import { getImageUrl } from '~/utils/imageUtils';
import {
  getCertificate,
  updateStudentProfile,
  uploadProfileImage,
} from '~/features/Profile/services';
import * as ImagePicker from 'expo-image-picker';
import toast from '~/utils/toasts';
import DateTimePicker from '@react-native-community/datetimepicker';
import { getStudentData } from '~/utils/storage';
import CertificateTemplate from '~/components/profile/CertificateTemplate';
import * as Print from 'expo-print';
import { shareAsync } from 'expo-sharing';

const COLORS1 = {
  black: '#000000',
  white: '#ffffff',
  primary: '#8b5cf6',
  secondary: '#7c3aed',
  gray: '#6b7280',
  lightGray: '#f3f4f6',
  darkGray: '#374151',
  background: '#f9fafb',
};

const formatDateToDDMMYYYY = (date: Date | string | null): string => {
  if (!date) return '';

  const dateObj = typeof date === 'string' ? new Date(date) : date;

  if (isNaN(dateObj.getTime())) return '';

  const day = dateObj.getDate().toString().padStart(2, '0');
  const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
  const year = dateObj.getFullYear();

  return `${day}-${month}-${year}`;
};

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
  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const [selectedCertificate, setSelectedCertificate] = useState<any>(null);

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
  const [studentData, setstudentData] = useState<any>('');
  const certificateRef = useRef<View>(null);
  const [cerificates, setCertificates] = useState<any>('');

  const getStudent = async () => {
    const data = await getStudentData();
    if (data) {
      setstudentData(data);
    }
  };

  const fetchCertificate = async () => {
    try {
      const response = await getCertificate({ studentId: studentData?._id });
      if (response) {
        setCertificates(response?.data?.data || []);
      }
    } catch (error) {
      console.log('error in fetching certificate:', error);
    }
  };

  useEffect(() => {
    fetchCertificate();
  }, [studentData?._id]);

  useEffect(() => {
    getStudent();
    dispatch(getStudentProfileThunk({}));
  }, [dispatch]);

  useEffect(() => {
    if (profileDetails && profileDetails?.data) {
      const data = profileDetails?.data;
      const userDetail = data?.userDetail || {};
      const course = userDetail?.course || {};

      const newProfileData = {
        first_name: data?.first_name || '',
        last_name: data?.last_name || '',
        email: data?.email || '',
        gender: data?.gender || '',
        dateOfBirth: data.dob ? formatDateToDDMMYYYY(data?.dob) : '',
        contact_info: {
          phone_number: data?.contact_info?.phone_number || '',
          alternate_phone_number: data?.contact_info?.alternate_phone_number || '',
          address1: data?.contact_info?.address1 || '',
          address2: data?.contact_info?.address2 || '',
          pincode: data?.contact_info?.pincode?.toString() || '',
        },
        course: course?.course_name || '',
        batch: userDetail?.institute_id?.batch?.batch_name,
        rollNumber: data?.roll_no?.toString() || '',
        studentID: userDetail?.studentId || '',
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
      // ✅ update redux again
      dispatch(getStudentProfileThunk({}));

      // ✅ also sync local state immediately
      setOriginalProfileData(JSON.parse(JSON.stringify(profileData)));

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
<View style={styles.pickerContainer}>
  <Picker
    selectedValue={profileData.gender}
    enabled={isEditing}
    onValueChange={(itemValue) => handleInputChange('gender', itemValue)}
    style={styles.picker}
  >
    <Picker.Item label="Select Gender" value="" />
    <Picker.Item label="Male" value="Male" />
    <Picker.Item label="Female" value="Female" />
    <Picker.Item label="Other" value="Other" />
  </Picker>
</View>
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
            placeholder="Batch name"
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

  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Certificate</title>
    <link href="https://fonts.googleapis.com/css2?family=Italianno&family=Montserrat:wght@400;600;700&family=Pirata+One&family=Inter:ital@1&display=swap" rel="stylesheet">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Montserrat', sans-serif;
            background-color: #f5f5f5;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            padding: 20px;
        }
        
        .certificate-container {
            width: 100%;
            max-width: 600px;
            background-color: white;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }
        
        .certificate-content {
            padding: 30px;
            text-align: center;
        }
        
        .certificate-title {
            font-family: 'PirataOne-Regular', 'Pirata One', cursive;
            font-size: 32px;
            color: #716F6F;
            margin-bottom: 10px;
        }
        
        .completion-subtitle {
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 15px 0;
        }
        
        .arrow {
            width: 40px;
            height: 10px;
            background-color: #ddd; /* Placeholder for actual arrow image */
            margin: 0 10px;
        }
        
        .completion-text {
            color: #716F6F;
            font-weight: 400;
            text-transform: uppercase;
            font-size: 12px;
            letter-spacing: 2px;
        }
        
        .certify-text {
            color: #716F6F;
            font-size: 10px;
            margin-bottom: 10px;
        }
        
        .recipient-name-container {
            margin: 15px 0;
        }
        
        .recipient-name {
            font-family: 'Italianno', cursive;
            font-size: 32px;
            color: #2A2A2A;
        }
        
        .underline {
            width: 200px;
            height: 1px;
            background-color: #716F6F;
            margin: 5px auto 0;
        }
        
        .completion-details {
            margin: 15px 0;
        }
        
        .completion-text-main {
            color: #716F6F;
            font-size: 8px;
            margin-bottom: 5px;
        }
        
        .course-badge {
            position: relative;
            margin: 10px 0;
            display: inline-block;
        }
        
        .course-bg {
            width: 80px;
            height: 40px;
            background-color: #eee; /* Placeholder for actual background image */
        }
        
        .course-title {
            position: absolute;
            left: 12px;
            top: -1px;
            color: #2A2A2A;
            font-weight: 600;
            font-size: 6px;
            text-align: center;
            width: calc(100% - 24px);
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .duration-text {
            color: #716F6F;
            font-size: 8px;
            margin-top: 10px;
        }
        
        .duration-text1 {
            color: #2A2A2A;
            font-weight: 700;
        }
        
        .signature-section {
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 100%;
            max-width: 300px;
            margin: 20px auto 0;
        }
        
        .signature-left, .signature-right {
            flex: 1;
            text-align: center;
        }
        
        .signature-name {
            color: #FF3131;
            font-style: italic;
            font-size: 10px;
            margin-bottom: 2px;
            font-family: 'Inter', sans-serif;
        }
        
        .signature-line {
            width: 60px;
            height: 1px;
            background-color: #d1d5db;
            margin: 4px auto;
        }
        
        .signature-title, .instructor-title {
            color: #2A2A2A;
            font-weight: 700;
            font-size: 8px;
        }
        
        @media (max-width: 480px) {
            .certificate-content {
                padding: 20px;
            }
            
            .certificate-title {
                font-size: 28px;
            }
            
            .recipient-name {
                font-size: 28px;
            }
            
            .signature-section {
                flex-direction: column;
                gap: 15px;
            }
        }
    </style>
</head>
<body>
    <div class="certificate-container">
        <div class="certificate-content">
            <h1 class="certificate-title">Certificate</h1>
            
            <div class="completion-subtitle">
                <div class="arrow"></div>
                <p class="completion-text">OF COMPLETION</p>
                <div class="arrow"></div>
            </div>
            
            <p class="certify-text">This is to Certify that</p>
            
            <div class="recipient-name-container">
                <h2 class="recipient-name" id="student-name">${profileData?.first_name} ${profileData?.last_name}</h2>
                <div class="underline"></div>
            </div>
            
            <div class="completion-details">
                <p class="completion-text-main">has Successfully Completed that</p>
                <p class="completion-text-main">Course</p>
                
                <div class="course-badge">
                    <div class="course-bg"></div>
                    <p class="course-title" id="course-title">${selectedCertificate?.certificate_name}</p>
                </div>
                
                <p class="duration-text">
                    during the period of
                    <span class="duration-text1">July 2025 - December 2025</span>
                </p>
            </div>
            
            <div class="signature-section">
                <div class="signature-left">
                    <p class="signature-name">Abdul Kalam</p>
                    <div class="signature-line"></div>
                    <p class="signature-title">Authorised Signatory</p>
                </div>
                
                <div class="signature-right">
                    <p class="signature-name">Albert Einstein</p>
                    <div class="signature-line"></div>
                    <p class="instructor-title">Course Instructor</p>
                </div>
            </div>
        </div>
    </div>

    <script>
        // Function to populate certificate data
        function populateCertificate(data) {
            if (data.student) {
                document.getElementById('student-name').textContent = data.student;
            }
            
            if (data.title) {
                document.getElementById('course-title').textContent = data.title.substring(0, 15);
            }
            
            // You can add more data population as needed
        }
        
        // Example usage:
        // const certificateData = {
        //     student: "John Doe",
        //     title: "Advanced Web Development"
        // };
        // populateCertificate(certificateData);
    </script>
</body>
</html>`;

  const generatePDF = async () => {
    try {
      const { uri } = await Print.printToFileAsync({
        html: htmlContent,
        base64: false,
      });
      await shareAsync(uri);
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  const handleDownloadCertificate = async (certificate: any) => {
    try {
      // Set the selected certificate and show modal
      setSelectedCertificate(certificate);
      setShowCertificateModal(true);
    } catch (error) {
      console.error('Download error:', error);
      Alert.alert('Error', 'Failed to download certificate. Please try again.', [{ text: 'OK' }]);
    }
  };

  const handleCloseModal = () => {
    setShowCertificateModal(false);
    setSelectedCertificate(null);
  };

  const renderCertificateContent = () => {
    return (
      <View style={styles.certificateContainer}>
        {/* Hidden certificate template for capturing */}
        <View style={{ position: 'absolute', left: -9999 }}>
          <View ref={certificateRef}>
            <CertificateTemplate
              certificate={{
                id: 0,
                title: 'MEAN STACK 2024',
                description: '',
                branch: '',
                batch: '',
                student: `${profileData?.first_name} ${profileData?.last_name}`,
                email: profileData.email,
              }}
            />
          </View>
        </View>

        {cerificates?.length > 0 ? (
          cerificates?.map((certificate: any, index: any) => (
            <View key={index} style={styles.card}>
              <Image
                source={{ uri: getImageUrl(certificate?.course?.image) }}
                style={styles.cardImage}
              />
              <View style={styles.contentRow}>
                <View style={styles.textContainer}>
                  <Text style={styles.cardHeading}>Certificate Name</Text>
                  <Text style={styles.cardValue}>{certificate?.certificate_name || 'N/A'}</Text>

                  <Text style={styles.cardHeading}>Course</Text>
                  <Text style={styles.cardValue}>{certificate?.course?.course_name || 'N/A'}</Text>

                  <Text style={styles.cardHeading}>Duration</Text>
                  <Text style={styles.cardValue}>{certificate?.duration || 'N/A'}</Text>
                </View>
                <TouchableOpacity onPress={() => handleDownloadCertificate(certificate)}>
                  <Image
                    source={require('../../assets/profile/down.png')}
                    style={styles.downIcon}
                  />
                </TouchableOpacity>
              </View>
            </View>
          ))
        ) : (
          <View style={styles.card}>
            <Text style={styles.cardValue}>No certificates available</Text>
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
          <View style={styles.idRow}>
            <Text style={styles.idHeading}>Name:</Text>
            <Text style={styles.idValue}>
              {profileData.first_name} {profileData.last_name}
            </Text>
          </View>
          <View style={styles.idRow}>
            <Text style={styles.idHeading}>Student ID:</Text>
            <Text style={styles.idValue}>{profileData.studentID}</Text>
          </View>
          <View style={styles.idRow}>
            <Text style={styles.idHeading}>Roll No:</Text>
            <Text style={styles.idValue}>{profileData.rollNumber}</Text>
          </View>
          <View style={styles.idRow}>
            <Text style={styles.idHeading}>Course:</Text>
            <Text style={styles.idValue}>{profileData.course}</Text>
          </View>
          <View style={styles.idRow}>
            <Text style={styles.idHeading}>Batch:</Text>
            <Text style={styles.idValue}>{profileData.batch || 'N/A'}</Text>
          </View>
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
      <StatusBar backgroundColor={COLORS1.black} barStyle="light-content" />
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
          {renderContent()}
        </ScrollView>

        {/* Certificate Modal */}
        <Modal
          visible={showCertificateModal}
          animationType="slide"
          transparent={true}
          onRequestClose={handleCloseModal}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Certificate</Text>
                <TouchableOpacity onPress={handleCloseModal} style={styles.closeButton}>
                  <Text style={styles.closeButtonText}>×</Text>
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.modalBody}>
                {selectedCertificate && (
                  <CertificateTemplate
                    certificate={{
                      id: selectedCertificate.id,
                      title: selectedCertificate.certificate_name,
                      description: selectedCertificate.description || '',
                      branch: selectedCertificate.branch_id,
                      batch: selectedCertificate.batch_id,
                      student: `${profileData.first_name} ${profileData.last_name}`,
                      email: profileData.email,
                    }}
                  />
                )}

                <View style={styles.modalActions}>
                  <TouchableOpacity
                    style={styles.downloadButton}
                    onPress={() => {
                      generatePDF();
                    }}>
                    <Text style={styles.downloadButtonText}>Download Certificate</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </>
  );
};

export default Profile;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContent: {
    width: '95%',
    maxHeight: '90%',
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
    backgroundColor: '#f8f9fa',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2A2A2A',
  },
  closeButton: {
    padding: 4,
  },
  closeButtonText: {
    fontSize: 24,
    color: '#716F6F',
    fontWeight: 'bold',
  },
  modalBody: {
    padding: 16,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e5e5',
  },
  downloadButton: {
    backgroundColor: '#7B00FF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 160,
    alignItems: 'center',
  },
  downloadButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  shareButton: {
    backgroundColor: '#8b5cf6',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 100,
    alignItems: 'center',
  },
  shareButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  container: {
    flex: 1,
    // backgroundColor: '#ebeff3',
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
    color: COLORS1.darkGray,
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
    backgroundColor: COLORS1.background

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
    color: COLORS1.gray,
    fontWeight: '600',
    fontSize: 18,
    textAlign: 'center',
  },
  activeTabText: {
    color: COLORS1.white,
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
    backgroundColor: COLORS1.lightGray,
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
    color: COLORS1.white,
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
    backgroundColor: '#d1d5db',
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
  idRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  idHeading: {
    fontWeight: '700',
    color: '#2A2A2A',
    fontSize: 16,
  },
  idValue: {
    fontWeight: '500',
    color: '#716F6F',
    fontSize: 16,
  },
  cardHeading: {
    fontWeight: '700',
    color: '#2A2A2A',
    fontSize: 16,
    marginTop: 6,
  },
  cardValue: {
    fontWeight: '500',
    color: '#716F6F',
    fontSize: 16,
    marginBottom: 4,
  },
  pickerContainer: {
  borderWidth: 1,
  borderColor: '#ccc',
  borderRadius: 8,
  marginBottom: 12,
},
picker: {
  height: 50,
  width: '100%',
},

});
