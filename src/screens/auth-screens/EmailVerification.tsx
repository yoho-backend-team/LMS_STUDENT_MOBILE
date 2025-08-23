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

const EmailVerification = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
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

    setErrors(newErrors);
    return valid;
  };

  const handleEmailVerify = () => {
    if (validateForm()) {
      console.log('verify pressed', email);
      toast.success('Success', 'Email verified successful!');
      navigation.navigate('OtpVerification' as never);
    }
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
                  Enter your registered Email Address
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

                {/* Sign In Button */}
                <TouchableOpacity onPress={handleEmailVerify}>
                  <LinearGradient colors={['#7B00FF', '#B200FF']} style={styles.verifyButton}>
                    <Text style={styles.verifyButtonText}>Verify</Text>
                  </LinearGradient>
                </TouchableOpacity>

                <View style={{ alignItems: 'center', marginTop: 25 }}>
                  <TouchableOpacity onPress={() => navigation.navigate('login' as never)}>
                    <Text
                      style={{
                        textDecorationLine: 'underline',
                        ...FONTS.body4,
                        color: COLORS.blue_01,
                        fontWeight: 500,
                      }}>
                      Back to Login
                    </Text>
                  </TouchableOpacity>
                </View>

                <View
                  style={{
                    flexDirection: 'row',
                    gap: 3,
                    marginTop: 25,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <EvilIcons name="exclamation" size={20} color={COLORS.text_desc} />
                  <Text style={{ ...FONTS.body4, color: COLORS.text_desc }}>
                    Enter the mail ID given by LMS
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

export default EmailVerification;

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
  verifyButton: {
    borderRadius: 18,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 15,
  },
  verifyButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.white,
  },
});
