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
  Keyboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Auth, COLORS, FONTS, icons } from '~/constants';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { EvilIcons, MaterialIcons } from '@expo/vector-icons';
import toast from '~/utils/toasts';
import { getStudentLoginClient } from '~/features/Authentication/services';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Login = () => {
  const navigation = useNavigation<any>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({
    email: '',
    password: '',
  });

  const validateForm = () => {
    let valid = true;
    const newErrors = {
      email: '',
      password: '',
    };

    // Email validation
    if (!email.trim()) {
      newErrors.email = 'Email is required';
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
      valid = false;
    }

    // Password validation
    if (!password.trim()) {
      newErrors.password = 'Password is required';
      valid = false;
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSignIn = async () => {
    if (validateForm()) {
      try {
        const data = { email, password };
        const response = await getStudentLoginClient(data, {});
        if (response && response?.status === 'success') {
          if (response?.data?.step === 'otp') {
            navigation.navigate('OtpVerification' as never, { data: response?.data, email });
          } else {
            await AsyncStorage.setItem('AuthStudentToken', response?.data?.token);
            await AsyncStorage.setItem('StudentData', JSON.stringify(response?.data?.user));
            toast.success('Success', 'Login successful!');
            navigation.reset({
              index: 0,
              routes: [{ name: 'Student' }],
            });
          }
        } else {
          toast.error('Error', 'Failed to login');
        }
      } catch (error) {
        toast.error('Error', 'Failed to login');
      }
    }
  };

  const handleForgotPassword = () => {
    navigation.navigate('ForgetPassword' as never);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const clearError = (field: string) => {
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <>
      <StatusBar backgroundColor={COLORS.black} barStyle="light-content" />
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}>
          {/* <TouchableWithoutFeedback onPress={dismissKeyboard}> */}
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
                  <Image source={icons.security} style={styles.headerImage} />
                </View>
              </LinearGradient>

              <View style={{ alignItems: 'center' }}>
                <Image source={Auth.loading} style={{ width: 75, height: 75 }} />
                <Text
                  style={{
                    ...FONTS.h3,
                    textAlign: 'center',
                    color: COLORS.text_title,
                    marginTop: 10,
                  }}>
                  Join & Connect The Fastest Growing Online Community
                </Text>
              </View>

              {/* Form Section */}
              <View style={styles.formSection}>
                {/* Email Input */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Email</Text>
                  <TextInput
                    style={[styles.input, errors.email && styles.inputError]}
                    value={email}
                    onChangeText={(text) => {
                      setEmail(text);
                      clearError('email');
                    }}
                    placeholder="Enter your email"
                    placeholderTextColor={COLORS.shadow_01}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    editable={true}
                    selectTextOnFocus={true}
                    returnKeyType="next"
                    onSubmitEditing={() => {}}
                  />
                  {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}
                </View>

                {/* Password Input */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Password</Text>
                  <View style={[styles.passwordContainer, errors.password && styles.inputError]}>
                    <TextInput
                      style={styles.passwordInput}
                      value={password}
                      onChangeText={(text) => {
                        setPassword(text);
                        clearError('password');
                      }}
                      placeholder="Enter your password"
                      placeholderTextColor={COLORS.shadow_01}
                      secureTextEntry={!showPassword}
                      autoCapitalize="none"
                      autoCorrect={false}
                      editable={true}
                      selectTextOnFocus={true}
                      returnKeyType="done"
                      onSubmitEditing={handleSignIn}
                    />
                    <TouchableOpacity style={styles.eyeIcon} onPress={togglePasswordVisibility}>
                      <MaterialIcons
                        name={showPassword ? 'visibility' : 'visibility-off'}
                        size={24}
                        color={COLORS.text_desc}
                      />
                    </TouchableOpacity>
                  </View>
                  {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}
                </View>

                {/* Remember Me and Forgot Password */}
                <View style={styles.optionsRow}>
                  <View style={styles.rememberMeContainer}></View>
                  <TouchableOpacity onPress={handleForgotPassword}>
                    <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                  </TouchableOpacity>
                </View>

                {/* Sign In Button */}
                <TouchableOpacity onPress={handleSignIn}>
                  <LinearGradient colors={['#7B00FF', '#B200FF']} style={styles.signInButton}>
                    <Text style={styles.signInButtonText}>Sign In</Text>
                  </LinearGradient>
                </TouchableOpacity>

                <View style={{ flexDirection: 'row', gap: 3, marginTop: 18, alignItems: 'center' }}>
                  <EvilIcons name="exclamation" size={20} color={COLORS.text_desc} />
                  <Text style={{ ...FONTS.body4, color: COLORS.text_desc }}>
                    Enter the mail ID & Password given by LMS
                  </Text>
                </View>
              </View>
            </View>
          </ScrollView>
          {/* </TouchableWithoutFeedback> */}
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  );
};

export default Login;

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
  input: {
    borderWidth: 0.5,
    borderColor: COLORS.text_desc,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: COLORS.white,
    color: COLORS.text_title,
    height: 48,
    textAlignVertical: 'center',
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
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 30,
    flexWrap: 'wrap',
  },
  rememberMeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: COLORS.text_desc,
    fontWeight: '500',
  },
  signInButton: {
    borderRadius: 18,
    paddingVertical: 15,
    alignItems: 'center',
  },
  signInButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.white,
  },
});
