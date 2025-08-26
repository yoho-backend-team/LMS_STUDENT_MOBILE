import { useState } from 'react';
import {
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Auth, COLORS, FONTS, icons } from '~/constants';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import toast from '~/utils/toasts';
import { resetpasswordClient } from '~/features/Authentication/services';
import { RouteProp } from '@react-navigation/native';

type ResetPasswordRouteProp = RouteProp<{ params: { email: string } }, 'params'>;

const ResetPassword = ({ route }: { route: ResetPasswordRouteProp }) => {
  const navigation = useNavigation();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({
    newPassword: '',
    confirmPassword: '',
  });
  const { email } = route?.params;

  const validateForm = () => {
    let valid = true;
    const newErrors = {
      newPassword: '',
      confirmPassword: '',
    };

    // New Password validation
    if (!newPassword.trim()) {
      newErrors.newPassword = 'New password is required';
      valid = false;
    } else if (newPassword.length < 6) {
      newErrors.newPassword = 'Password must be at least 6 characters';
      valid = false;
    }

    // Confirm Password validation
    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = 'Please confirm your password';
      valid = false;
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleResetPassword = async () => {
    if (validateForm()) {
      try {
        const response = await resetpasswordClient({
          email,
          new_password: newPassword,
          confirm_password: confirmPassword,
        });
        if (response) {
          toast.success('Success', 'Password reset successfully!');
          navigation.navigate('login' as never);
        } else {
          toast.error('Error', 'Failed to change password');
        }
      } catch (error) {
        toast.error('Error', 'Failed to change password');
      }
    }
  };

  const togglePasswordVisibility = (field: 'new' | 'confirm') => {
    switch (field) {
      case 'new':
        setShowNewPassword(!showNewPassword);
        break;
      case 'confirm':
        setShowConfirmPassword(!showConfirmPassword);
        break;
    }
  };

  const clearError = (field: string) => {
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  return (
    <>
      <StatusBar backgroundColor={COLORS.black} barStyle="light-content" />
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}>
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}>
            <View style={styles.contentWrapper}>
              {/* Header Section with Icon */}
              <LinearGradient
                colors={['#7B00FF', '#B200FF', '#7B00FF']}
                style={styles.headerSection}>
                <View style={styles.content}>
                  <Image source={icons.security2} style={styles.headerImage} />
                </View>
              </LinearGradient>

              <View style={{ alignItems: 'center', marginTop: 10 }}>
                <Image source={Auth.loading} style={{ width: 75, height: 75 }} />
              </View>

              {/* Form Section */}
              <View style={styles.formSection}>
                {/* New Password Input */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>New Password</Text>
                  <View style={[styles.passwordContainer, errors.newPassword && styles.inputError]}>
                    <TextInput
                      style={styles.passwordInput}
                      value={newPassword}
                      onChangeText={(text) => {
                        setNewPassword(text);
                        clearError('newPassword');
                      }}
                      placeholder="Enter your new password"
                      placeholderTextColor={COLORS.shadow_01}
                      secureTextEntry={!showNewPassword}
                      autoCapitalize="none"
                      autoCorrect={false}
                      editable={true}
                      selectTextOnFocus={true}
                      returnKeyType="next"
                    />
                    <TouchableOpacity
                      style={styles.eyeIcon}
                      onPress={() => togglePasswordVisibility('new')}>
                      <MaterialIcons
                        name={showNewPassword ? 'visibility' : 'visibility-off'}
                        size={24}
                        color={COLORS.text_desc}
                      />
                    </TouchableOpacity>
                  </View>
                  {errors.newPassword ? (
                    <Text style={styles.errorText}>{errors.newPassword}</Text>
                  ) : null}
                </View>

                {/* Confirm Password Input */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Confirm Password</Text>
                  <View
                    style={[styles.passwordContainer, errors.confirmPassword && styles.inputError]}>
                    <TextInput
                      style={styles.passwordInput}
                      value={confirmPassword}
                      onChangeText={(text) => {
                        setConfirmPassword(text);
                        clearError('confirmPassword');
                      }}
                      placeholder="Confirm your new password"
                      placeholderTextColor={COLORS.shadow_01}
                      secureTextEntry={!showConfirmPassword}
                      autoCapitalize="none"
                      autoCorrect={false}
                      editable={true}
                      selectTextOnFocus={true}
                      returnKeyType="done"
                      onSubmitEditing={handleResetPassword}
                    />
                    <TouchableOpacity
                      style={styles.eyeIcon}
                      onPress={() => togglePasswordVisibility('confirm')}>
                      <MaterialIcons
                        name={showConfirmPassword ? 'visibility' : 'visibility-off'}
                        size={24}
                        color={COLORS.text_desc}
                      />
                    </TouchableOpacity>
                  </View>
                  {errors.confirmPassword ? (
                    <Text style={styles.errorText}>{errors.confirmPassword}</Text>
                  ) : null}
                </View>

                {/* Reset Password Button */}
                <TouchableOpacity onPress={handleResetPassword} style={styles.resetButton}>
                  <LinearGradient
                    colors={['#7B00FF', '#B200FF']}
                    style={styles.resetButtonGradient}>
                    <Text style={styles.resetButtonText}>Change Password</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  );
};

export default ResetPassword;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  contentWrapper: {
    flex: 1,
  },
  headerSection: {
    paddingHorizontal: 24,
    paddingVertical: 40,
    alignItems: 'center',
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  content: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerImage: {
    height: 200,
  },
  formSection: {
    flex: 1,
    paddingHorizontal: 24,
    marginTop: 12,
    paddingBottom: 40,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.text_title,
    marginBottom: 8,
  },
  inputError: {
    borderColor: COLORS.light_red,
  },
  errorText: {
    color: COLORS.light_red,
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.text_desc,
    borderRadius: 8,
    backgroundColor: COLORS.white,
    height: 48,
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: 16,
    fontSize: 16,
    color: COLORS.text_title,
    height: '100%',
    textAlignVertical: 'center',
  },
  eyeIcon: {
    padding: 12,
  },
  resetButton: {
    width: '100%',
    marginTop: 10,
  },
  resetButtonGradient: {
    borderRadius: 18,
    paddingVertical: 15,
    alignItems: 'center',
  },
  resetButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.white,
  },
});
