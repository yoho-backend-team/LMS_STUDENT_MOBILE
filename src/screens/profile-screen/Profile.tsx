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
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Pencil, Camera, X } from 'lucide-react-native';
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
import { COLORS } from '~/constants';

const COLORS1 = {
  black: '#000000',
  white: '#ffffff',
  primary: '#8b5cf6',
  secondary: '#7c3aed',
  gray: '#6b7280',
  lightGray: '#f3f4f6',
  darkGray: '#374151',
  background: '#f9fafb',
  error: '#FF6B6B',
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

// Phone number formatting functions
const formatPhoneNumber = (phone: string): string => {
  if (!phone) return '';
  
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '');
  
  // If it's already 10 digits and starts with 6-9, add +91-
  if (cleaned.length === 10 && /^[6-9]/.test(cleaned)) {
    return `+91-${cleaned}`;
  }
  
  // If it already has +91- prefix, keep it as is
  if (phone.startsWith('+91-') && phone.length > 4) {
    const digits = phone.replace('+91-', '').replace(/\D/g, '');
    if (digits.length === 10 && /^[6-9]/.test(digits)) {
      return `+91-${digits}`;
    }
  }
  
  return phone;
};

const extractPhoneDigits = (phone: string): string => {
  if (!phone) return '';
  
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '');
  
  // If it starts with 91 and has 12 digits, remove the 91
  if (cleaned.length === 12 && cleaned.startsWith('91')) {
    return cleaned.slice(2);
  }
  
  // If it starts with +91 and has 13 characters with +, remove +91
  if (phone.startsWith('+91') && cleaned.length === 12) {
    return cleaned.slice(2);
  }
  
  return cleaned;
};

// Validation functions
const validateField = (field: string, value: string): string => {
  switch (field) {
    case 'first_name':
      return value.trim() ? '' : 'First name is required';
    case 'last_name':
      return value.trim() ? '' : 'Last name is required';
    case 'phone_number':
      if (!value.trim()) return 'Phone number is required';
      
      const phoneDigits = extractPhoneDigits(value);
      if (phoneDigits.length !== 10) return 'Phone number must be 10 digits';
      if (!/^[6-9]/.test(phoneDigits)) return 'Phone number must start with 6, 7, 8, or 9';
      return '';
      
    case 'alternate_phone_number':
      if (!value.trim()) return ''; // Optional field
      
      const altPhoneDigits = extractPhoneDigits(value);
      if (altPhoneDigits.length !== 10) return 'Alternate phone must be 10 digits';
      if (!/^[6-9]/.test(altPhoneDigits)) return 'Alternate phone must start with 6, 7, 8, or 9';
      return '';
      
    case 'pincode':
      return value.trim() && /^[0-9]{6}$/.test(value) ? '' : 'Valid 6-digit pincode is required';
    case 'address1':
      return value.trim() ? '' : 'Address line 1 is required';
    default:
      return '';
  }
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
  const [showEditModal, setShowEditModal] = useState(false);
  const [downloadingCertificate, setDownloadingCertificate] = useState<string | null>(null);

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
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});

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

  const handlePhoneNumberChange = (field: string, value: string) => {
    // Remove any existing formatting for processing
    const cleanedValue = value.replace(/\D/g, '');
    
    // Allow only digits and limit to 10 digits
    if (cleanedValue.length <= 10) {
      handleInputChange(field, cleanedValue);
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

    // Clear validation error when user starts typing
    if (validationErrors[field]) {
      setValidationErrors(prev => ({
        ...prev,
        [field]: ''
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

  const validateForm = (): boolean => {
    const errors: {[key: string]: string} = {};

    // Validate all required fields
    errors.first_name = validateField('first_name', profileData.first_name);
    errors.last_name = validateField('last_name', profileData.last_name);
    errors.phone_number = validateField('phone_number', profileData.contact_info.phone_number);
    errors.alternate_phone_number = validateField('alternate_phone_number', profileData.contact_info.alternate_phone_number);
    errors.pincode = validateField('pincode', profileData.contact_info.pincode);
    errors.address1 = validateField('address1', profileData.contact_info.address1);

    setValidationErrors(errors);

    // Check if any errors exist
    return Object.values(errors).every(error => error === '');
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.error('Validation Error', 'Please fix the errors before submitting.');
      return;
    }

    if (!hasChanges()) {
      toast.info('Info', 'No changes detected to save.');
      return;
    }

    setIsSaving(true);

    try {
      const dobTimestamp = convertDDMMYYYYToTimestamp(profileData.dateOfBirth);

      // Format phone numbers before sending to API
      const formattedPhone = formatPhoneNumber(profileData.contact_info.phone_number);
      const formattedAltPhone = profileData.contact_info.alternate_phone_number 
        ? formatPhoneNumber(profileData.contact_info.alternate_phone_number)
        : '';

      const transformedData = {
        contact_info: {
          phone_number: formattedPhone,
          alternate_phone_number: formattedAltPhone,
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
        setOriginalProfileData(JSON.parse(JSON.stringify(profileData)));
        toast.success('Success', 'Profile updated successfully!');
        setShowEditModal(false);
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
              setShowEditModal(false);
              setValidationErrors({});
            },
          },
        ]
      );
      return;
    }

    setShowEditModal(false);
    setValidationErrors({});
  };

  const handleEditClick = () => {
    setShowEditModal(true);
  };

  const handleDownloadCertificate = async (certificate: any) => {
    try {
      setDownloadingCertificate(certificate._id);
      
      // Check if certificate has a downloadable URL
      if (certificate.certificate_url) {
        const supported = await Linking.canOpenURL(certificate.certificate_url);
        
        if (supported) {
          await Linking.openURL(certificate.certificate_url);
          toast.success('Success', 'Certificate download started!');
        } else {
          toast.error('Error', 'Cannot open certificate URL');
        }
      } else {
        // If no URL, generate PDF
        await generatePDF(certificate);
      }
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Error', 'Failed to download certificate. Please try again.');
    } finally {
      setDownloadingCertificate(null);
    }
  };

  const generatePDF = async (certificate: any) => {
    try {
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; padding: 40px; }
                .certificate { border: 2px solid #7B00FF; padding: 40px; text-align: center; }
                .title { color: #7B00FF; font-size: 32px; margin-bottom: 20px; }
                .student-name { font-size: 24px; margin: 20px 0; }
                .course-name { font-size: 18px; margin: 10px 0; }
                .date { margin-top: 30px; color: #666; }
            </style>
        </head>
        <body>
            <div class="certificate">
                <h1 class="title">Certificate of Completion</h1>
                <p>This certifies that</p>
                <h2 class="student-name">${profileData.first_name} ${profileData.last_name}</h2>
                <p>has successfully completed the course</p>
                <h3 class="course-name">${certificate.certificate_name}</h3>
                <p class="date">Issued on: ${new Date().toLocaleDateString()}</p>
            </div>
        </body>
        </html>
      `;

      const { uri } = await Print.printToFileAsync({
        html: htmlContent,
        base64: false,
      });
      
      await shareAsync(uri, { UTI: '.pdf', mimeType: 'application/pdf' });
      
    } catch (error) {
      console.error('PDF generation error:', error);
      toast.error('Error', 'Failed to generate certificate PDF.');
    }
  };

  const renderEditModal = () => (
    <Modal
      visible={showEditModal}
      animationType="slide"
      transparent={true}
      onRequestClose={handleCancel}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Edit Profile</Text>
            <TouchableOpacity onPress={handleCancel} style={styles.closeButton}>
              <X size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
            {/* Profile Image Section */}
            <View style={styles.avatarSection}>
              <View style={styles.avatarContainer}>
                {profileDetails?.data?.image ? (
                  <Image
                    source={{ uri: getImageUrl(profileDetails.data.image) }}
                    style={styles.avatar}
                  />
                ) : (
                  <Image source={require('../../assets/profile/man.png')} style={styles.avatar} />
                )}
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
              </View>
              <Text style={styles.avatarText}>Tap to change photo</Text>
            </View>

            {/* Personal Information */}
            <Text style={styles.sectionTitle}>Personal Information</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>First Name*</Text>
              <TextInput
                style={[styles.input, validationErrors.first_name && styles.inputError]}
                value={profileData.first_name}
                onChangeText={(text) => handleInputChange('first_name', text)}
                placeholder="Enter first name..."
              />
              {validationErrors.first_name ? (
                <Text style={styles.errorText}>{validationErrors.first_name}</Text>
              ) : null}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Last Name*</Text>
              <TextInput
                style={[styles.input, validationErrors.last_name && styles.inputError]}
                value={profileData.last_name}
                onChangeText={(text) => handleInputChange('last_name', text)}
                placeholder="Enter last name..."
              />
              {validationErrors.last_name ? (
                <Text style={styles.errorText}>{validationErrors.last_name}</Text>
              ) : null}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email Address</Text>
              <TextInput
                style={[styles.input, styles.disabledInput]}
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
                  onValueChange={(itemValue) => handleInputChange('gender', itemValue)}
                  style={styles.picker}>
                  <Picker.Item label="Select Gender" value="" />
                  <Picker.Item label="Male" value="Male" />
                  <Picker.Item label="Female" value="Female" />
                  <Picker.Item label="Other" value="Other" />
                </Picker>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Date Of Birth</Text>
              <TouchableOpacity onPress={showDatepicker}>
                <TextInput
                  style={styles.input}
                  value={profileData.dateOfBirth}
                  placeholder="DD-MM-YYYY"
                  editable={false}
                  pointerEvents="none"
                />
              </TouchableOpacity>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Phone Number*</Text>
              <View style={styles.phoneInputContainer}>
                <View style={styles.countryCode}>
                  <Text style={styles.countryCodeText}>+91</Text>
                </View>
                <TextInput
                  style={[styles.phoneInput, validationErrors.phone_number && styles.inputError]}
                  value={profileData.contact_info.phone_number}
                  onChangeText={(text) => handlePhoneNumberChange('contact_info.phone_number', text)}
                  placeholder="Enter 10-digit phone number"
                  keyboardType="phone-pad"
                  maxLength={10}
                />
              </View>
              {validationErrors.phone_number ? (
                <Text style={styles.errorText}>{validationErrors.phone_number}</Text>
              ) : (
                <Text style={styles.helperText}>Must start with 6, 7, 8, or 9</Text>
              )}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Alternate Phone Number</Text>
              <View style={styles.phoneInputContainer}>
                <View style={styles.countryCode}>
                  <Text style={styles.countryCodeText}>+91</Text>
                </View>
                <TextInput
                  style={[styles.phoneInput, validationErrors.alternate_phone_number && styles.inputError]}
                  value={profileData.contact_info.alternate_phone_number}
                  onChangeText={(text) => handlePhoneNumberChange('contact_info.alternate_phone_number', text)}
                  placeholder="Enter 10-digit alternate phone number"
                  keyboardType="phone-pad"
                  maxLength={10}
                />
              </View>
              {validationErrors.alternate_phone_number ? (
                <Text style={styles.errorText}>{validationErrors.alternate_phone_number}</Text>
              ) : (
                <Text style={styles.helperText}>Must start with 6, 7, 8, or 9</Text>
              )}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Address Line 1*</Text>
              <TextInput
                style={[styles.input, styles.textArea, validationErrors.address1 && styles.inputError]}
                value={profileData.contact_info.address1}
                onChangeText={(text) => handleInputChange('contact_info.address1', text)}
                placeholder="Enter address line 1..."
                multiline={true}
                numberOfLines={3}
              />
              {validationErrors.address1 ? (
                <Text style={styles.errorText}>{validationErrors.address1}</Text>
              ) : null}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Address Line 2</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={profileData.contact_info.address2}
                onChangeText={(text) => handleInputChange('contact_info.address2', text)}
                placeholder="Enter address line 2..."
                multiline={true}
                numberOfLines={3}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Pin Code*</Text>
              <TextInput
                style={[styles.input, validationErrors.pincode && styles.inputError]}
                value={profileData.contact_info.pincode}
                onChangeText={(text) => handleInputChange('contact_info.pincode', text)}
                placeholder="Enter 6-digit pin code..."
                keyboardType="numeric"
                maxLength={6}
              />
              {validationErrors.pincode ? (
                <Text style={styles.errorText}>{validationErrors.pincode}</Text>
              ) : null}
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

            {/* Added marginBottom to ensure buttons are visible */}
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.saveButton, isSaving && styles.disabledButton]}
                onPress={handleSubmit}
                disabled={isSaving}>
                {isSaving ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Text style={styles.saveButtonText}>Save Changes</Text>
                )}
              </TouchableOpacity>
            </View>
            
            {/* Extra space at bottom to ensure buttons are fully visible */}
            <View style={styles.bottomSpacer} />
          </ScrollView>
        </View>
      </View>
    </Modal>
  ); 

  const renderProfileContent = () => (
    <View style={styles.certificateContainer}>
      <Text style={styles.sectionTitle}>Personal Information</Text>

      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>First Name:</Text>
        <Text style={styles.infoValue}>{profileData.first_name || 'Not provided'}</Text>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Last Name:</Text>
        <Text style={styles.infoValue}>{profileData.last_name || 'Not provided'}</Text>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Email:</Text>
        <Text style={styles.infoValue}>{profileData.email}</Text>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Gender:</Text>
        <Text style={styles.infoValue}>{profileData.gender || 'Not provided'}</Text>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Date of Birth:</Text>
        <Text style={styles.infoValue}>{profileData.dateOfBirth || 'Not provided'}</Text>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Phone Number:</Text>
        <Text style={styles.infoValue}>
          {profileData.contact_info.phone_number || 'Not provided'}
        </Text>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Alternate Phone:</Text>
        <Text style={styles.infoValue}>
          {profileData.contact_info.alternate_phone_number || 'Not provided'}
        </Text>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Address:</Text>
        <Text style={styles.infoValue}>
          {[profileData.contact_info.address1, profileData.contact_info.address2]
            .filter(Boolean)
            .join(', ') || 'Not provided'}
        </Text>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Pincode:</Text>
        <Text style={styles.infoValue}>{profileData.contact_info.pincode || 'Not provided'}</Text>
      </View>

      <Text style={styles.sectionTitle}>Institute Information</Text>

      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Course:</Text>
        <Text style={styles.infoValue}>{profileData.course || 'Not provided'}</Text>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Batch:</Text>
        <Text style={styles.infoValue}>{profileData.batch || 'Not provided'}</Text>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Roll Number:</Text>
        <Text style={styles.infoValue}>{profileData.rollNumber || 'Not provided'}</Text>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Student ID:</Text>
        <Text style={styles.infoValue}>{profileData.studentID || 'Not provided'}</Text>
      </View>
    </View>
  );

  const renderCertificateContent = () => {
    return (
      <View style={styles.certificateContainer}>
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
                <TouchableOpacity
                  onPress={() => handleDownloadCertificate(certificate)}
                  disabled={downloadingCertificate === certificate._id}>
                  {downloadingCertificate === certificate._id ? (
                    <ActivityIndicator size="small" color="#7B00FF" />
                  ) : (
                    <Image
                      source={require('../../assets/profile/down.png')}
                      style={styles.downIcon}
                    />
                  )}
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

                  {activeTab === 'profile' && (
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

        <ScrollView
          showsVerticalScrollIndicator={false}
          style={styles.scrollSection}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
          {renderContent()}
        </ScrollView>

        {/* Edit Profile Modal */}
        {renderEditModal()}

        {/* Certificate Modal */}
        <Modal
          visible={showCertificateModal}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setShowCertificateModal(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Certificate</Text>
                <TouchableOpacity
                  onPress={() => setShowCertificateModal(false)}
                  style={styles.closeButton}>
                  <X size={24} color="#666" />
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.modalContent}>
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

                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={styles.downloadButton}
                    onPress={() =>
                      selectedCertificate && handleDownloadCertificate(selectedCertificate)
                    }>
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
    color: COLORS1.darkGray,
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#fff',
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
    backgroundColor: COLORS.bg_Colour,
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
    marginBottom: 16,
    marginTop: 8,
  },
  inputGroup: {
    marginBottom: 16,
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
    backgroundColor: '#fff',
  },
  inputError: {
    borderColor: COLORS1.error,
    backgroundColor: '#FFF5F5',
  },
  disabledInput: {
    backgroundColor: '#e5e5e5',
    color: '#666',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  errorText: {
    color: COLORS1.error,
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  helperText: {
    color: '#6b7280',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
    fontStyle: 'italic',
  },
  // Phone Input Styles
  phoneInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  countryCode: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRightWidth: 0,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  countryCodeText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#716F6F',
  },
  phoneInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderLeftWidth: 0,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    padding: 12,
    fontSize: 16,
    fontWeight: '500',
    color: '#716F6F',
    backgroundColor: '#fff',
  },
  certificateContainer: {
    backgroundColor: '#fff',
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
    backgroundColor: COLORS.bg_Colour,
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
    backgroundColor: COLORS.bg_Colour,
  },
  idCardInfo: {
    alignItems: 'center',
    width: '100%',
  },
  idRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    marginBottom: 8,
    paddingHorizontal: 20,
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
    borderColor: '#d1d5db',
    borderRadius: 10,
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  picker: {
    height: 50,
    width: '100%',
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
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    width: '100%',
    maxHeight: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2A2A2A',
  },
  closeButton: {
    padding: 4,
  },
  modalContent: {
    padding: 20,
    maxHeight: '80%',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 30, // Added marginBottom to ensure buttons are visible
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6b7280',
  },
  saveButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#7B00FF',
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#9CA3AF',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  downloadButton: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#7B00FF',
    alignItems: 'center',
    width: '100%',
  },
  downloadButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  // Avatar Section in Modal
  avatarSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarText: {
    marginTop: 8,
    fontSize: 14,
    color: '#666',
  },
  // Info Row Styles for Read-only Profile
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2A2A2A',
    flex: 1,
  },
  infoValue: {
    fontSize: 16,
    color: '#716F6F',
    flex: 1,
    textAlign: 'right',
  },
  bottomSpacer: {
    height: 20, // Extra space at bottom
  },
});
