import React from 'react';
import {
  StatusBar,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  Linking,
} from 'react-native';
import { COLORS, FONTS, icons } from '~/constants';
import { useRoute, useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { getFileUrl } from '~/utils/imageUtils';
import toast from '~/utils/toasts';
import Icon from 'react-native-vector-icons/Feather';

const TicketDetailScreen = () => {
  const navigation: any = useNavigation(); 
  const route: any = useRoute(); 
  const { ticket } = route.params;

  const handleOpenFile = async (fileUrl: string) => {
    try {
      if (!fileUrl) return;
      const url = fileUrl.startsWith('http') ? fileUrl : getFileUrl(fileUrl);
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        toast.error('Error', "Can't open this file");
      }
    } catch (err: any) {
      toast.error('Error', err.message || 'Failed to open file');
    }
  };

  return (
    <>
      <StatusBar backgroundColor={COLORS.black} barStyle="light-content" />
      <SafeAreaView edges={['top']} style={styles.container}>
       
        <View style={styles.headerRow}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Image source={icons.back_arrow} style={{ width: 25, height: 25 }} />
          </TouchableOpacity>
          <Text style={styles.title}>Ticket Details</Text>
        </View>

       
        <ScrollView contentContainerStyle={styles.formContainer}>
          <Text style={styles.label}>Query</Text>
          <View style={styles.input}>
            <Text style={styles.inputText}>{ticket?.query || '-'}</Text>
          </View>

          <Text style={styles.label}>Description</Text>
          <View style={[styles.input, styles.textarea]}>
            <Text style={styles.inputText}>{ticket?.description || '-'}</Text>
          </View>

          <Text style={styles.label}>Category</Text>
          <View style={styles.input}>
            <Text style={styles.inputText}>{ticket?.category || '-'}</Text>
          </View>

          <Text style={styles.label}>Priority</Text>
          <View style={styles.input}>
            <Text style={styles.inputText}>{ticket?.priority || '-'}</Text>
          </View>

          <Text style={styles.label}>Status</Text>
          <View style={styles.input}>
            <Text style={styles.inputText}>{ticket?.status || '-'}</Text>
          </View>

          <Text style={styles.label}>Attachment</Text>
          {ticket?.file ? (
            <TouchableOpacity
              style={styles.attachmentButton}
              onPress={() => handleOpenFile(ticket.file)}
            >
              <View style={styles.attachmentContent}>
                <Icon name="file" size={24} color={COLORS.blue_01} />
                <Text style={styles.attachmentText}>
                  {ticket?.fileName || ticket?.file}
                </Text>
              </View>
            </TouchableOpacity>
          ) : (
            <View style={styles.input}>
              <Text style={styles.inputText}>No attachment</Text>
            </View>
          )}
        </ScrollView>

    
        {ticket?.id && (
          <LinearGradient
            colors={['#7B00FF', '#B200FF']}
            start={{ x: 0.134, y: 0.021 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradientButton}
          >
            <TouchableOpacity
              style={styles.submitButton}
              onPress={() => {
                console.log(ticket.id);
               navigation.navigate(
  'TicketChatScreen',
  { ticketId: String(ticket.id) }
);
              }}
            >
              <Text style={styles.submitText}>Open Chat</Text>
            </TouchableOpacity>
          </LinearGradient>
        )}
      </SafeAreaView>
    </>
  );
};

export default TicketDetailScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    gap: 5,
    marginVertical: 10,
  },
  title: { fontSize: 20, fontWeight: 'bold' },
  backButton: { paddingHorizontal: 10, marginTop: 10 },

  formContainer: { paddingHorizontal: 15, paddingBottom: 30 },
  label: { fontSize: 16, fontWeight: '600', marginBottom: 8, marginTop: 15 },

  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  inputText: { color: COLORS.text_desc, fontSize: 16 },
  textarea: { minHeight: 100, textAlignVertical: 'top' },

  attachmentButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingVertical: 15,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    marginTop: 10,
  },
  attachmentContent: { justifyContent: 'center', alignItems: 'center', gap: 5 },
  attachmentText: { ...FONTS.body6, color: COLORS.text_desc, textAlign: 'center' },

  gradientButton: { margin: 15, borderRadius: 8, overflow: 'hidden' },
  submitButton: { paddingVertical: 15, alignItems: 'center' },
  submitText: { color: '#fff', fontSize: 18, fontWeight: '600' },
});
