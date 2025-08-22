import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';

const ProfileHelp = () => {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        {/* Tag */}
        <View style={styles.tag}>
          <Text style={styles.tagText}>Profile</Text>
        </View>

        {/* Content */}
        <Text style={styles.title}>ASDF</Text>
        <Text style={styles.description}>ZCV</Text>

        {/* Button with Gradient */}
        <TouchableOpacity style={styles.buttonContainer}>
          <LinearGradient
            colors={['#7B00FF', '#B200FF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.button}
          >
            <Text style={styles.buttonText}>View Details</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ProfileHelp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#F8FAFC',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
  },
  tag: {
    alignSelf: 'flex-start',
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 10,
  },
  tagText: {
    fontSize: 13,
    color: '#333',
    fontWeight: '500',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#111',
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
  },
  buttonContainer: {
    alignSelf: 'flex-end',
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
});