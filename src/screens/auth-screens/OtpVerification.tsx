import React, { useState, useRef, useEffect } from 'react';
import {
  StatusBar,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  NativeSyntheticEvent,
  TextInputKeyPressEventData,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Auth, COLORS, FONTS, icons } from '~/constants';
import AntDesign from '@expo/vector-icons/AntDesign';
import toast from '~/utils/toasts';

const OTPVerification = () => {
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  const inputRefs = useRef<Array<TextInput | null>>([]);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0]?.focus();
    }
  }, []);

  useEffect(() => {
    if (timer > 0 && !canResend) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else if (timer === 0) {
      setCanResend(true);
    }
  }, [timer, canResend]);

  const handleOtpChange = (text: string, index: number) => {
    const numericText = text.replace(/[^0-9]/g, '');

    if (numericText.length <= 1) {
      const newOtp = [...otp];
      newOtp[index] = numericText;
      setOtp(newOtp);

      if (numericText !== '' && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }

      if (numericText.length > 1) {
        handlePaste(numericText);
      }
    }
  };

  const handlePaste = (pastedText: string) => {
    const digits = pastedText.slice(0, 6).split('');
    const newOtp = [...otp];
    digits.forEach((digit, index) => {
      if (index < 6) {
        newOtp[index] = digit;
      }
    });
    setOtp(newOtp);

    const lastFilledIndex = Math.min(digits.length - 1, 5);
    inputRefs.current[lastFilledIndex]?.focus();
  };

  const handleKeyPress = (e: NativeSyntheticEvent<TextInputKeyPressEventData>, index: number) => {
    if (e.nativeEvent.key === 'Backspace') {
      if (otp[index] === '' && index > 0) {
        inputRefs.current[index - 1]?.focus();
        const newOtp = [...otp];
        newOtp[index - 1] = '';
        setOtp(newOtp);
      } else {
        const newOtp = [...otp];
        newOtp[index] = '';
        setOtp(newOtp);
      }
    }
  };

  const handleInputFocus = (index: number) => {
    const isAllFilled = otp.every((digit) => digit !== '');
    if (isAllFilled && index < 5) {
      inputRefs.current[5]?.focus();
    }
  };

  const handleVerify = () => {
    const otpString = otp.join('');
    if (otpString.length === 6) {
      toast.success('Success', `OTP Verified: ${otpString}`);
    } else {
      toast.error('Error', 'Please enter complete OTP');
    }
  };

  const handleResendOtp = () => {
    if (canResend) {
      setTimer(60);
      setCanResend(false);
      setOtp(['', '', '', '', '', '']);
      inputRefs.current.forEach((ref) => ref?.clear());
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 100);
      toast.success('OTP Sent', 'New OTP has been sent to your mobile number');
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const isOtpComplete = otp.every((digit) => digit !== '');

  return (
    <>
      <StatusBar backgroundColor={COLORS.black} barStyle="light-content" />
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <ScrollView
              contentContainerStyle={styles.scrollContainer}
              keyboardShouldPersistTaps="handled">
              <View style={styles.content}>
                {/* Header */}
                <LinearGradient
                  colors={['#7B00FF', '#B200FF', '#7B00FF']}
                  style={styles.headerSection}>
                  <View style={styles.content}>
                    <Image source={icons.security2} style={styles.headerImage} />
                  </View>
                </LinearGradient>

                {/* Title */}
                <View style={{ alignItems: 'center' }}>
                  <Image source={Auth.loading} style={{ width: 75, height: 75 }} />
                  <Text
                    style={{
                      ...FONTS.h3,
                      textAlign: 'center',
                      color: COLORS.text_title,
                      marginVertical: 10,
                    }}>
                    Enter the 6 digit OTP sent to your Email Address
                  </Text>
                </View>

                {/* OTP Inputs */}
                <View style={styles.otpContainer}>
                  {otp.map((digit, index) => (
                    <TextInput
                      key={index}
                      ref={(ref: any) => (inputRefs.current[index] = ref)}
                      style={[
                        styles.otpInput,
                        digit !== '' && styles.otpInputFilled,
                        isOtpComplete && styles.otpInputComplete,
                      ]}
                      value={digit}
                      onChangeText={(text) => handleOtpChange(text, index)}
                      onKeyPress={(e) => handleKeyPress(e, index)}
                      onFocus={() => handleInputFocus(index)}
                      keyboardType="number-pad"
                      maxLength={1}
                      selectTextOnFocus={true}
                      textContentType="oneTimeCode"
                      editable={!isOtpComplete || index === 5}
                    />
                  ))}
                </View>

                {/* Timer */}
                <Text style={styles.timerText}>
                  {canResend ? 'OTP expired' : `Resend OTP in ${formatTime(timer)}`}
                </Text>

                {/* Verify Button */}
                <TouchableOpacity
                  onPress={handleVerify}
                  style={styles.verifyButton}
                  disabled={!isOtpComplete}>
                  <LinearGradient
                    colors={isOtpComplete ? ['#7B00FF', '#B200FF'] : ['#CCCCCC', '#999999']}
                    style={styles.verifyGradient}>
                    <Text style={styles.verifyText}>
                      {isOtpComplete ? 'Verify OTP' : 'Enter OTP'}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>

                {/* Resend OTP */}
                <TouchableOpacity
                  onPress={handleResendOtp}
                  disabled={!canResend}
                  style={[styles.resendButton, !canResend && styles.resendButtonDisabled]}>
                  <Text style={[styles.resendText, !canResend && styles.resendTextDisabled]}>
                    Resend OTP
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  headerSection: {
    paddingHorizontal: 35,
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
  header: {
    width: 150,
    height: 150,
    borderRadius: 75,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    ...FONTS.h2,
    color: COLORS.text_title,
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    ...FONTS.body3,
    color: COLORS.text_desc,
    textAlign: 'center',
    marginVertical: 40,
    lineHeight: 20,
    fontWeight: 500,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 30,
    gap: 10,
  },
  otpInput: {
    width: 50,
    height: 60,
    borderWidth: 1,
    borderColor: COLORS.text_desc,
    borderRadius: 10,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text_title,
    backgroundColor: COLORS.white,
  },
  otpInputFilled: {
    borderColor: '#7B00FF',
    backgroundColor: '#F5F0FF',
  },
  otpInputComplete: {
    borderColor: '#4CAF50',
    backgroundColor: '#F0FFF4',
  },
  timerText: {
    ...FONTS.body4,
    color: COLORS.text_desc,
    marginBottom: 30,
    alignSelf: 'flex-end',
  },
  verifyButton: {
    width: '100%',
    marginBottom: 20,
  },
  verifyGradient: {
    borderRadius: 25,
    paddingVertical: 15,
    alignItems: 'center',
  },
  verifyText: {
    ...FONTS.h4,
    color: COLORS.white,
    fontWeight: 'bold',
  },
  resendButton: {
    padding: 10,
  },
  resendButtonDisabled: {
    opacity: 0.5,
  },
  resendText: {
    ...FONTS.body3,
    color: '#7B00FF',
    fontWeight: '600',
  },
  resendTextDisabled: {
    color: COLORS.text_desc,
  },
});

export default OTPVerification;
