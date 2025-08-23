import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Auth } from '~/constants';

const COLORS = {
  primary: '#8B5FBF',
  white: '#FFFFFF',
  black: '#000000',
  gray: '#666666',
  inputBorder: '#E0E0E0',
  textDark: '#333333',
};

const ResetPassword = () => {
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');

  const handleSubmit = () => {
    if (newPass !== confirmPass) {
      console.log('Passwords do not match');
      return;
    }
    console.log('Password reset with:', { currentPass, newPass });
  };

  return (
    <SafeAreaView style={styles.container}>
       <View style={styles.headerSection}>
				<Image source={Auth.header} style={styles.headerImage}></Image>
					   </View>
	  
					   <View >
						 <Image source={Auth.loading}></Image>
						
					   </View>
	  

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Current Password</Text>
        <TextInput
          style={styles.input}
          value={currentPass}
          onChangeText={setCurrentPass}
         
          placeholderTextColor={COLORS.gray}
          secureTextEntry={true}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>New Password</Text>
        <TextInput
          style={styles.input}
          value={newPass}
          onChangeText={setNewPass}
          
          placeholderTextColor={COLORS.gray}
          secureTextEntry={true}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Confirm New Password</Text>
        <TextInput
          style={styles.input}
          value={confirmPass}
          onChangeText={setConfirmPass}
          
          placeholderTextColor={COLORS.gray}
          secureTextEntry={true}
        />
      </View>

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitText}>Submit</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default ResetPassword;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: COLORS.white,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: COLORS.textDark,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.textDark,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.inputBorder,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: COLORS.white,
    color: COLORS.textDark,
    height: 48,
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  submitText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.white,
  },
    headerImage: {
    height: 200,
    
  },
   headerSection: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 40,

    alignItems: 'center',
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
});
