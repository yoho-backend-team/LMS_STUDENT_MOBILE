import React from 'react';
import { View, Text, Image, StyleSheet, useWindowDimensions } from 'react-native';

interface CertificateTemplateProps {
  certificate: any;
  isModal?: boolean;
}

const CertificateTemplate: React.FC<CertificateTemplateProps> = ({
  certificate,
  isModal = false,
}) => {
  const { width } = useWindowDimensions();

  // Calculate scaling factor for modal view
  const scaleFactor = isModal ? 0.3 : 1; // Adjust this value as needed

  // Responsive styles based on whether it's in modal or not
  const responsiveStyles = {
    certificateTitle: {
      fontSize: isModal ? 32 : 32,
      marginBottom: isModal ? 10 : 10,
    },
    completionText: {
      fontSize: isModal ? 12 : 12,
      letterSpacing: isModal ? 2 : 2,
    },
    certifyText: {
      fontSize: isModal ? 10 : 10,
      marginBottom: isModal ? 10 : 10,
    },
    recipientName: {
      fontSize: isModal ? 32 : 32,
    },
    underline: {
      width: isModal ? 200 : 200,
      marginTop: isModal ? 5 : 5,
    },
    completionTextMain: {
      fontSize: isModal ? 8 : 8,
      marginBottom: isModal ? 5 : 5,
    },
    courseBg: {
      width: isModal ? 80 : 80,
      height: isModal ? 40 : 40,
    },
    courseTitle: {
      fontSize: isModal ? 6 : 6,
      left: isModal ? 12 : 12,
      top: isModal ? -1 : -1,
    },
    durationText: {
      fontSize: isModal ? 8 : 8,
    },
    durationText1: {
      fontSize: isModal ? 8 : 8,
    },
    signatureName: {
      fontSize: isModal ? 10 : 10,
      marginBottom: isModal ? 2 : 2,
    },
    signatureLine: {
      width: isModal ? 60 : 60,
      marginVertical: isModal ? 4 : 4,
    },
    signatureTitle: {
      fontSize: isModal ? 8 : 8,
    },
    instructorTitle: {
      fontSize: isModal ? 8 : 8,
    },
    certifiedImage: {
      width: isModal ? 30 : 30,
      height: isModal ? 40 : 40,
    },
    arrow: {
      width: isModal ? 40 : 40,
      height: isModal ? 10 : 10,
    },
    certificateContent: {
      padding: isModal ? 15 : 15,
    },
  };

  return (
    <View style={[styles.container, { width: isModal ? width * 0.9 : 1200 }]}>
      <View style={styles.certificateContainer}>
        <View
          style={[
            styles.certificateContent,
            { padding: responsiveStyles.certificateContent.padding },
          ]}>
          <Text style={[styles.certificateTitle, responsiveStyles.certificateTitle]}>
            Certificate
          </Text>

          <View style={styles.completionSubtitle}>
            <Image source={{}} style={[styles.arrow, responsiveStyles.arrow]} />
            <Text style={[styles.completionText, responsiveStyles.completionText]}>
              OF COMPLETION
            </Text>
            <Image source={{}} style={[styles.arrow, responsiveStyles.arrow]} />
          </View>

          <Text style={[styles.certifyText, responsiveStyles.certifyText]}>
            This is to Certify that
          </Text>

          <View style={styles.recipientNameContainer}>
            <Text style={[styles.recipientName, responsiveStyles.recipientName]}>
              {certificate?.student}
            </Text>
            <View style={[styles.underline, responsiveStyles.underline]} />
          </View>

          <View style={styles.completionDetails}>
            <Text style={[styles.completionTextMain, responsiveStyles.completionTextMain]}>
              has Successfully Completed that
            </Text>
            <Text style={[styles.completionTextMain, responsiveStyles.completionTextMain]}>
              Course
            </Text>
            <View style={styles.courseBadge}>
              <Image source={{}} style={[styles.courseBg, responsiveStyles.courseBg]} />
              <Text style={[styles.courseTitle, responsiveStyles.courseTitle]}>
                {certificate?.title?.substring(0, 15)}
              </Text>
            </View>

            <Text style={[styles.durationText, responsiveStyles.durationText]}>
              during the period of
              <Text
                style={[styles.durationText1, responsiveStyles.durationText1]}>
                July 2025 - December 2025
              </Text>
            </Text>
          </View>

          <View style={styles.signatureSection}>
            <View style={styles.signatureLeft}>
              <Text style={[styles.signatureName, responsiveStyles.signatureName]}>
                Abdul Kalam
              </Text>
              <View style={[styles.signatureLine, responsiveStyles.signatureLine]} />
              <Text style={[styles.signatureTitle, responsiveStyles.signatureTitle]}>
                Authorised Signatory
              </Text>
            </View>
{/* 
            <View style={styles.verificationBadge}>
              <Image source={{}} style={[styles.certifiedImage, responsiveStyles.certifiedImage]} />
            </View> */}

            <View style={styles.signatureRight}>
              <Text style={[styles.signatureName, responsiveStyles.signatureName]}>
                Albert Einstein
              </Text>
              <View style={[styles.signatureLine, responsiveStyles.signatureLine]} />
              <Text style={[styles.instructorTitle, responsiveStyles.instructorTitle]}>
                Course Instructor
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    alignSelf: 'center',
  },
  certificateContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  certificateContent: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  certificateTitle: {
    fontFamily: 'PirataOne-Regular',
    color: '#716F6F',
    textAlign: 'center',
  },
  completionSubtitle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  arrow: {
    resizeMode: 'contain',
  },
  completionText: {
    color: '#716F6F',
    fontWeight: '400',
    textTransform: 'uppercase',
    fontFamily: 'Montserrat-Regular',
    textAlign: 'center',
    marginHorizontal: 10,
  },
  certifyText: {
    color: '#716F6F',
    fontFamily: 'Montserrat-Regular',
    textAlign: 'center',
  },
  recipientNameContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  recipientName: {
    fontFamily: 'Italianno-Regular',
    color: '#2A2A2A',
    textAlign: 'center',
  },
  underline: {
    backgroundColor: '#716F6F',
  },
  completionDetails: {
    alignItems: 'center',
    marginVertical: 10,
  },
  completionTextMain: {
    color: '#716F6F',
    fontFamily: 'Montserrat-Regular',
    textAlign: 'center',
  },
  courseBadge: {
    position: 'relative',
    marginVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  courseBg: {
    resizeMode: 'contain',
  },
  courseTitle: {
    position: 'absolute',
    color: '#2A2A2A',
    fontWeight: '600',
    fontFamily: 'Montserrat-SemiBold',
    textAlign: 'center',
  },
  durationText: {
    color: '#716F6F',
    fontWeight: '400',
    fontFamily: 'Montserrat-Regular',
    textAlign: 'center',
  },
  durationText1: {
    color: '#2A2A2A',
    fontWeight: '700',
    fontFamily: 'Montserrat-Bold',
  },
  signatureSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '40%',
    marginTop: 20,
  },
  signatureLeft: {
    alignItems: 'center',
    flex: 1,
  },
  signatureName: {
    color: '#FF3131',
    fontWeight: '400',
    fontStyle: 'italic',
    fontFamily: 'Inter-Italic',
    textAlign: 'center',
  },
  signatureLine: {
    backgroundColor: '#d1d5db',
  },
  signatureTitle: {
    color: '#2A2A2A',
    fontWeight: '700',
    fontFamily: 'Montserrat-Bold',
    textAlign: 'center',
  },
  verificationBadge: {
    alignItems: 'center',
  },
  certifiedImage: {
    resizeMode: 'contain',
  },
  signatureRight: {
    alignItems: 'center',
    flex: 1,
  },
  instructorTitle: {
    color: '#2A2A2A',
    fontWeight: '700',
    fontFamily: 'Montserrat-Bold',
    textAlign: 'center',
  },
});

export default CertificateTemplate;
