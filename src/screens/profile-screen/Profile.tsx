"use client"

import { useEffect, useState } from "react"
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
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Pencil, Camera } from "lucide-react-native"
import { useNavigation } from "@react-navigation/native"
import { useDispatch, useSelector } from "react-redux"
import { launchImageLibrary, launchCamera, type ImagePickerResponse, type MediaType } from "react-native-image-picker"
import { getStudentProfileThunk } from "~/features/Profile/reducer/thunks"
import { selectProfile } from "~/features/Profile/reducer/selectors"
import { getImageUrl } from "~/utils/imageUtils"
import { updateStudentProfile } from "~/features/Profile/services"
import * as ImagePicker from "expo-image-picker"
import AsyncStorage from "@react-native-async-storage/async-storage"

const COLORS = {
  black: "#000000",
  white: "#ffffff",
  primary: "#8b5cf6",
  secondary: "#7c3aed",
  gray: "#6b7280",
  lightGray: "#f3f4f6",
  darkGray: "#374151",
  background: "#f9fafb",
}

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false)
  const [activeTab, setActiveTab] = useState("profile")
  const [isSaving, setIsSaving] = useState(false)
  const [isUploadingImage, setIsUploadingImage] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  const [profileData, setProfileData] = useState({
    Contact_info: {
      pinCode: "",
      address2: "",
      phone_number: "",
    },
    mailAddress: "",
    name: "",
    gender: "",
    dateOfBirth: "",
    course: "",
    batch: "",
    rollNumber: "",
    studentID: "",
  })

  const [originalProfileData, setOriginalProfileData] = useState({ ...profileData })

  const tabs = [
    {
      id: "profile",
      label: "Profile Information",
      icon: require("../../assets/profile/profile.png"),
    },
    { id: "certificate", label: "Certificate", icon: require("../../assets/profile/certi.png") },
    { id: "idcard", label: "ID Card", icon: require("../../assets/profile/id.png") },
  ]

  const tabTitles: Record<string, string> = {
    profile: "Profile",
    certificate: "Certificate",
    idcard: "ID Card",
  }

  const dispatch = useDispatch<any>()
  const profileDetails = useSelector(selectProfile)

  useEffect(() => {
    dispatch(getStudentProfileThunk({}))
  }, [dispatch])

  useEffect(() => {
    if (profileDetails && profileDetails.data) {
      const data = profileDetails.data
      const userDetail = data.userDetail || {}
      const course = userDetail.course || {}

      const newProfileData = {
        Contact_info: {
          pinCode: data.contact_info?.pincode?.toString() || "",
          address2: data.contact_info?.address2 || "",
          phone_number: data.contact_info?.phone_number || "",
        },
        mailAddress: data.email || "",
        name: data.full_name || "",
        gender: data.gender || "",
        dateOfBirth: data.dob ? new Date(data.dob).toLocaleDateString() : "",
        course: course.course_name || "",
        batch: "Batch 2024-25",
        rollNumber: data.roll_no?.toString() || "",
        studentID: userDetail.studentId || "",
      }

      setProfileData(newProfileData)
      setOriginalProfileData(JSON.parse(JSON.stringify(newProfileData)))
    }
  }, [profileDetails])

  useEffect(() => {
    loadSavedImage()
  }, [])

  const loadSavedImage = async () => {
    try {
      const savedImageUri = await AsyncStorage.getItem("profile_image_uri")
      if (savedImageUri) {
        setSelectedImage(savedImageUri)
        console.log("[v0] Loaded saved image from storage:", savedImageUri)
      }
    } catch (error) {
      console.error("[v0] Error loading saved image:", error)
    }
  }

  const handleImageUpload = async () => {
    console.log("[v0] Upload image - Camera icon clicked")

    try {
      // Request permission
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync()
      if (permissionResult.status !== "granted") {
        Alert.alert("Permission Denied", "You need to allow access to your gallery!")
        return
      }

      console.log("[v0] Opening gallery for image selection")

      // Open gallery
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      })

      if (!result.canceled && result.assets[0]) {
        const imageUri = result.assets[0].uri
        console.log("[v0] ✅ Image selected successfully! URI:", imageUri)
        console.log("[v0] 📤 Starting upload process...")

        // Show image immediately
        setSelectedImage(imageUri)

        await AsyncStorage.setItem("profile_image_uri", imageUri)
        console.log("[v0] Image saved to persistent storage")

        // Upload to server
        await uploadImageToServer(imageUri)
      } else {
        console.log("[v0] Image selection cancelled")
      }
    } catch (error) {
      console.error("[v0] Error in image upload:", error)
      Alert.alert("Error", "Failed to select image. Please try again.")
    }
  }

  const openCamera = async () => {
    console.log("[v0] Opening camera for photo capture")

    const hasPermission = await ImagePicker.requestCameraPermissionsAsync()
    if (!hasPermission) {
      Alert.alert("Permission Denied", "Camera permission is required to take photos")
      return
    }

    const options = {
      mediaType: "photo" as MediaType,
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
      quality: 0.8,
      storageOptions: {
        skipBackup: true,
        path: "images",
      },
    }

    launchCamera(options, (response: ImagePickerResponse) => {
      console.log("[v0] Camera response:", response)

      if (response.didCancel) {
        console.log("[v0] Camera capture cancelled by user")
        return
      }

      if (response.errorMessage) {
        console.log("[v0] Camera error:", response.errorMessage)
        Alert.alert("Camera Error", response.errorMessage)
        return
      }

      if (response.assets && response.assets[0]) {
        const imageUri = response.assets[0].uri
        if (imageUri) {
          console.log("[v0] Photo captured successfully, starting upload:", imageUri)
          setSelectedImage(imageUri) // Show image immediately
          uploadImageToServer(imageUri)
        }
      }
    })
  }

  const openGallery = async () => {
    console.log("[v0] Opening gallery for image selection")

    const hasPermission = await ImagePicker.requestMediaLibraryPermissionsAsync()
    if (!hasPermission) {
      Alert.alert("Permission Denied", "Storage permission is required to access photos")
      return
    }

    const options = {
      mediaType: "photo" as MediaType,
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
      quality: 0.8,
      storageOptions: {
        skipBackup: true,
        path: "images",
      },
    }

    launchImageLibrary(options, (response: ImagePickerResponse) => {
      console.log("[v0] Gallery response received:", response)

      if (response.didCancel) {
        console.log("[v0] ❌ User cancelled image selection")
        Alert.alert("Cancelled", "Image selection was cancelled")
        return
      }

      if (response.errorMessage) {
        console.log("[v0] ❌ Gallery error:", response.errorMessage)
        Alert.alert("Gallery Error", response.errorMessage)
        return
      }

      if (response.assets && response.assets[0]) {
        const imageUri = response.assets[0].uri
        if (imageUri) {
          console.log("[v0] ✅ Image selected successfully! URI:", imageUri)
          console.log("[v0] 📤 Starting upload process...")
          setSelectedImage(imageUri) // Show image immediately
          uploadImageToServer(imageUri)
        } else {
          console.log("[v0] ❌ No image URI found in response")
          Alert.alert("Error", "Failed to get image. Please try again.")
        }
      } else {
        console.log("[v0] ❌ No image assets found in response")
        Alert.alert("Error", "No image selected. Please try again.")
      }
    })
  }

  const uploadImageToServer = async (imageUri: string) => {
    setIsUploadingImage(true)
    console.log("[v0] Starting image upload...")

    try {
      // Create FormData for multipart upload
      const formData = new FormData()
      formData.append("file", {
        uri: imageUri,
        type: "image/jpeg",
        name: `profile_${Date.now()}.jpg`,
      } as any)
      formData.append("userId", profileDetails?.data?.id?.toString() || "")

      // For demo purposes, simulate successful upload after 2 seconds
      // Replace this with your actual API endpoint
      console.log("[v0] Simulating upload to server...")

      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Simulate successful response
      const mockResponse = {
        success: true,
        imageUrl: imageUri, // In real app, this would be the server URL
        message: "Image uploaded successfully",
      }

      console.log("[v0] ✅ Upload successful:", mockResponse)

      await AsyncStorage.setItem("profile_image_uri", imageUri)

      Alert.alert("Success", "Image upload successfully!", [
        {
          text: "OK",
          onPress: () => {
            // Refresh profile data
            dispatch(getStudentProfileThunk({}))
          },
        },
      ])

      console.log("[v0] 🎉 Image stored persistently and success toast shown!")
    } catch (error) {
      console.error("[v0] Upload error:", error)
      Alert.alert("Upload Error", "Failed to upload image. Please try again.")
      // setSelectedImage(null)
    } finally {
      setIsUploadingImage(false)
    }
  }

  const handleInputChange = (field: string, value: any) => {
    if (field.includes(".")) {
      const [parent, child] = field.split(".")

      setProfileData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }))
    } else {
      setProfileData((prev) => ({
        ...prev,
        [field]: value,
      }))
    }
  }

  const hasChanges = () => {
    return JSON.stringify(profileData) !== JSON.stringify(originalProfileData)
  }

  const showNoChangesToast = () => {
    Alert.alert("Info", "No changes detected to save.")
  }

  const showSuccessToast = () => {
    Alert.alert("Success", "Profile updated successfully!")
  }

  const showErrorToast = () => {
    Alert.alert("Error", "Failed to update profile. Please try again.")
  }

  const handleSubmit = async () => {
    if (!hasChanges()) {
      showNoChangesToast()
      return
    }

    setIsSaving(true)

    try {
      const transformedData = {
        contact_info: {
          phone_number: profileData.Contact_info.phone_number,
          alternate_phone_number: profileData.Contact_info.phone_number,
          address2: profileData.Contact_info.address2,
          pincode: Number.parseInt(profileData.Contact_info.pinCode) || null,
        },
        email: profileData.mailAddress,
        first_name: profileData.name.split(" ")[0] || "",
        last_name: profileData.name.split(" ")[1] || "",
        full_name: profileData.name,
        gender: profileData.gender,
        image: profileDetails?.data?.image || "",
      }

      const response = await updateStudentProfile(transformedData)

      console.log("API Responses update:", response)

      if (response) {
        dispatch(getStudentProfileThunk({}))
        showSuccessToast()
        setIsEditing(false)
      } else {
        showErrorToast()
      }
    } catch (error) {
      console.error("Failed to update profile:", error)
      showErrorToast()
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    if (hasChanges()) {
      Alert.alert("Discard Changes", "You have unsaved changes. Are you sure you want to discard them?", [
        {
          text: "Keep Editing",
          style: "cancel",
        },
        {
          text: "Discard",
          style: "destructive",
          onPress: () => {
            setProfileData(JSON.parse(JSON.stringify(originalProfileData)))
            setIsEditing(false)
          },
        },
      ])
      return
    }

    setIsEditing(false)
  }

  const handleEditClick = () => {
    if (!isEditing) {
      setOriginalProfileData(JSON.parse(JSON.stringify(profileData)))
    }
    setIsEditing(!isEditing)
  }

  const renderProfileContent = () => (
    <>
      <View style={styles.certificateContainer}>
        <Text style={styles.sectionTitle}>Personal Information</Text>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Mail Address</Text>
          <TextInput
            style={styles.input}
            value={profileData.mailAddress}
            onChangeText={(text) => handleInputChange("mailAddress", text)}
            placeholder="Enter here..."
            editable={isEditing}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Name</Text>
          <TextInput
            style={styles.input}
            value={profileData.name}
            onChangeText={(text) => handleInputChange("name", text)}
            placeholder="Enter here..."
            editable={isEditing}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Gender</Text>
          <TextInput
            style={styles.input}
            value={profileData.gender}
            onChangeText={(text) => handleInputChange("gender", text)}
            placeholder="Enter here..."
            editable={isEditing}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Contact Number</Text>
          <TextInput
            style={styles.input}
            value={profileData.Contact_info.phone_number}
            onChangeText={(text) => handleInputChange("Contact_info.phone_number", text)}
            placeholder="Enter here..."
            editable={isEditing}
            keyboardType="phone-pad"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Date Of Birth</Text>
          <TextInput
            style={styles.input}
            value={profileData.dateOfBirth}
            onChangeText={(text) => handleInputChange("dateOfBirth", text)}
            placeholder="Enter here..."
            editable={isEditing}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Pin Code</Text>
          <TextInput
            style={styles.input}
            value={profileData.Contact_info.pinCode}
            onChangeText={(text) => handleInputChange("Contact_info.pinCode", text)}
            placeholder="Enter here..."
            editable={isEditing}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Address</Text>
          <TextInput
            style={[styles.input, { height: 80, textAlignVertical: "top" }]}
            value={profileData.Contact_info.address2}
            onChangeText={(text) => handleInputChange("Contact_info.address2", text)}
            placeholder="Enter here..."
            editable={isEditing}
            multiline={true}
          />
        </View>

        <Text style={styles.sectionTitle}>Institute Information</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Course</Text>
          <TextInput
            style={styles.input}
            value={profileData.course}
            onChangeText={(text) => handleInputChange("course", text)}
            placeholder="Enter here..."
            editable={isEditing}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Batch</Text>
          <TextInput
            style={styles.input}
            value={profileData.batch}
            onChangeText={(text) => handleInputChange("batch", text)}
            placeholder="Enter here..."
            editable={isEditing}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Roll Number</Text>
          <TextInput
            style={styles.input}
            value={profileData.rollNumber}
            onChangeText={(text) => handleInputChange("rollNumber", text)}
            placeholder="Enter here..."
            editable={isEditing}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Student ID</Text>
          <TextInput
            style={styles.input}
            value={profileData.studentID}
            onChangeText={(text) => handleInputChange("studentID", text)}
            placeholder="Enter here..."
            editable={isEditing}
          />
        </View>
      </View>

      {isEditing && (
        <View style={styles.btnRow}>
          <TouchableOpacity style={styles.cancelBtn} onPress={handleCancel}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.submitBtn, isSaving && styles.disabledBtn]}
            onPress={handleSubmit}
            disabled={isSaving}
          >
            <Text style={styles.submitText}>{isSaving ? "Saving..." : "Submit"}</Text>
          </TouchableOpacity>
        </View>
      )}
    </>
  )

  const renderCertificateContent = () => {
    const completedCourses = profileDetails?.data?.userDetail?.completed_courses || []
    const currentCourse = profileDetails?.data?.userDetail?.course

    const allCourses = []

    if (currentCourse) {
      allCourses.push({
        ...currentCourse,
        status: "In Progress",
        cardImage: require("../../assets/profile/card1.png"),
      })
    }

    if (completedCourses.length > 0) {
      completedCourses.forEach((course) => {
        allCourses.push({
          ...course,
          status: "Completed",
          cardImage: require("../../assets/profile/card2.png"),
        })
      })
    }

    return (
      <View style={styles.certificateContainer}>
        {allCourses.length > 0 ? (
          allCourses.map((course, index) => (
            <View key={index} style={styles.card}>
              <Image source={course.cardImage} style={styles.cardImage} />
              <View style={styles.contentRow}>
                <View style={styles.textContainer}>
                  <Text style={styles.cardText}>Course Name: {course.course_name}</Text>
                  <Text style={styles.cardText}>Duration: {course.duration}</Text>
                  <Text style={styles.cardText}>Status: {course.status}</Text>
                </View>
                <Image source={require("../../assets/profile/down.png")} style={styles.downIcon} />
              </View>
            </View>
          ))
        ) : (
          <View style={styles.card}>
            <Text style={styles.cardText}>No courses available</Text>
          </View>
        )}
      </View>
    )
  }

  const renderContent = () => {
    switch (activeTab) {
      case "certificate":
        return renderCertificateContent()

      case "idcard":
        return (
          <View style={styles.certificateContainer}>
            <View style={styles.card}>
              <View style={styles.profileInfo}>
                <View style={styles.avatarContainer}>
                  {selectedImage ? (
                    <Image source={{ uri: selectedImage }} style={styles.avatar} />
                  ) : profileDetails?.data?.image ? (
                    <Image source={{ uri: getImageUrl(profileDetails.data.image) }} style={styles.avatar} />
                  ) : (
                    <Image source={require("../../assets/profile/man.png")} style={styles.avatar} />
                  )}

                  {isEditing && (
                    <TouchableOpacity
                      style={styles.cameraBtn}
                      activeOpacity={0.7}
                      onPress={handleImageUpload}
                      disabled={isUploadingImage}
                    >
                      {isUploadingImage ? (
                        <ActivityIndicator size="small" color="white" />
                      ) : (
                        <Camera size={16} color="white" />
                      )}
                    </TouchableOpacity>
                  )}

                  {!isEditing && (
                    <TouchableOpacity style={styles.editBtn} activeOpacity={0.7} onPress={handleEditClick}>
                      <Pencil size={16} color="black" />
                    </TouchableOpacity>
                  )}
                </View>
                <Text style={styles.name}>{profileData.name}</Text>
                <Text style={styles.subText}>Trainee ID: {profileData.studentID}</Text>
              </View>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.tabScrollView}
              contentContainerStyle={styles.tabScrollContent}
            >
              {tabs.map((tab) => (
                <TouchableOpacity
                  key={tab.id}
                  style={[styles.tabBtn, activeTab === tab.id && styles.activeTab]}
                  onPress={() => {
                    if (isEditing && tab.id !== "profile") {
                      setIsEditing(false)
                    }
                    setActiveTab(tab.id)
                  }}
                >
                  <Image source={tab.icon} style={styles.tabIcon} />
                  <Text style={[styles.tabBtnText, activeTab === tab.id && styles.activeTabText]}>{tab.label}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )

      default:
        return renderProfileContent()
    }
  }

  const navigation = useNavigation()

  return (
    <>
      <StatusBar backgroundColor={COLORS.black} barStyle="light-content" />
      <SafeAreaView edges={["top"]} style={styles.container}>
        <View style={styles.fixedSection}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Image source={require("../../assets/profile/back.png")} style={styles.backbutton} />
            </TouchableOpacity>
            <Text style={styles.title}>{tabTitles[activeTab]}</Text>
          </View>

          <View style={styles.certificateContainer}>
            <View style={styles.card}>
              <View style={styles.profileInfo}>
                <View style={styles.avatarContainer}>
                  {selectedImage ? (
                    <Image source={{ uri: selectedImage }} style={styles.avatar} />
                  ) : profileDetails?.data?.image ? (
                    <Image source={{ uri: getImageUrl(profileDetails.data.image) }} style={styles.avatar} />
                  ) : (
                    <Image source={require("../../assets/profile/man.png")} style={styles.avatar} />
                  )}

                  {isEditing && (
                    <TouchableOpacity
                      style={styles.cameraBtn}
                      activeOpacity={0.7}
                      onPress={handleImageUpload}
                      disabled={isUploadingImage}
                    >
                      {isUploadingImage ? (
                        <ActivityIndicator size="small" color="white" />
                      ) : (
                        <Camera size={16} color="white" />
                      )}
                    </TouchableOpacity>
                  )}

                  {!isEditing && (
                    <TouchableOpacity style={styles.editBtn} activeOpacity={0.7} onPress={handleEditClick}>
                      <Pencil size={16} color="black" />
                    </TouchableOpacity>
                  )}
                </View>
                <Text style={styles.name}>{profileData.name}</Text>
                <Text style={styles.subText}>Trainee ID: {profileData.studentID}</Text>
              </View>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.tabScrollView}
              contentContainerStyle={styles.tabScrollContent}
            >
              {tabs.map((tab) => (
                <TouchableOpacity
                  key={tab.id}
                  style={[styles.tabBtn, activeTab === tab.id && styles.activeTab]}
                  onPress={() => {
                    if (isEditing && tab.id !== "profile") {
                      setIsEditing(false)
                    }
                    setActiveTab(tab.id)
                  }}
                >
                  <Image source={tab.icon} style={styles.tabIcon} />
                  <Text style={[styles.tabBtnText, activeTab === tab.id && styles.activeTabText]}>{tab.label}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollSection}>
          {renderContent()}
        </ScrollView>
      </SafeAreaView>
    </>
  )
}

export default Profile

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ebeff3",
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
    fontWeight: "700",
    color: COLORS.darkGray,
    marginBottom: 16,
  },
  card: {
    backgroundColor: "#ebeff3",
    borderRadius: 16,
    padding: 16,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
    position: "relative",
    marginBottom: 16,
  },
  editBtn: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#e5e5e5",
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#ebeff3",
  },
  cameraBtn: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#7B00FF",
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#ebeff3",
  },
  profileInfo: {
    alignItems: "center",
    justifyContent: "center",
  },
  avatar: {
    width: 100,
    height: 100,
    marginBottom: 12,
    borderRadius: 50,
    resizeMode: "cover",
  },
  avatarContainer: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  name: {
    fontSize: 20,
    fontWeight: "700",
    color: "#7B00FF",
    marginBottom: 4,
  },
  subText: {
    fontSize: 16,
    color: "#716F6F",
    fontWeight: "500",
  },
  tabScrollView: {},
  tabScrollContent: {
    paddingHorizontal: 4,
  },
  tabBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    marginHorizontal: 6,
    backgroundColor: "#ebeff3",
    width: 271,
    height: 72,
    borderWidth: 1,
    borderColor: "#d1d5db",
  },
  activeTab: {
    backgroundColor: "#7B00FF",
  },
  tabBtnText: {
    color: COLORS.gray,
    fontWeight: "600",
    fontSize: 18,
    textAlign: "center",
  },
  activeTabText: {
    color: COLORS.white,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2A2A2A",
    marginBottom: 10,
  },
  inputGroup: {
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    color: "#2A2A2A",
    fontWeight: "700",
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    fontWeight: "500",
    color: "#716F6F",
    backgroundColor: "#ebeff3",
  },
  btnRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 24,
    marginBottom: 40,
  },
  cancelBtn: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    backgroundColor: COLORS.lightGray,
    marginRight: 8,
    alignItems: "center",
  },
  cancelText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#716F6F",
  },
  submitBtn: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    backgroundColor: "#7B00FF",
    marginLeft: 8,
    alignItems: "center",
  },
  disabledBtn: {
    backgroundColor: "#9CA3AF",
  },
  submitText: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.white,
  },
  certificateContainer: {
    backgroundColor: "#ebeff3",
    borderRadius: 16,
    padding: 15,
    marginTop: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  certificateHeader: {
    borderBottomWidth: 2,
    borderBottomColor: COLORS.primary,
    paddingBottom: 16,
    marginBottom: 16,
    alignItems: "center",
  },
  certificateTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.darkGray,
    marginBottom: 8,
  },
  certificateSubtitle: {
    fontSize: 16,
    color: COLORS.gray,
    marginBottom: 4,
  },
  certificateInstructor: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.primary,
  },
  certificateDetails: {
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: COLORS.gray,
    fontWeight: "500",
  },
  detailValue: {
    fontSize: 14,
    color: COLORS.darkGray,
    fontWeight: "600",
  },
  certificateFooter: {
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
    paddingTop: 16,
    alignItems: "center",
  },
  footerText: {
    fontSize: 14,
    color: COLORS.gray,
    marginBottom: 8,
  },
  footerInstructor: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.darkGray,
  },
  certificateActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 24,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.secondary,
    padding: 12,
    borderRadius: 10,
    gap: 8,
  },
  actionButtonText: {
    color: COLORS.white,
    fontWeight: "600",
    fontSize: 14,
  },
  comingSoon: {
    textAlign: "center",
    fontSize: 18,
    color: COLORS.gray,
    marginTop: 40,
    fontWeight: "600",
  },
  cardImage: {
    width: "100%",
    height: 180,
    borderRadius: 8,
    resizeMode: "cover",
  },
  cardText: {
    marginTop: 6,
    fontSize: 16,
    fontWeight: "700",
    color: "#716F6F",
  },
  cardImag: {
    width: 250,
    height: 250,
    borderRadius: 8,
    resizeMode: "cover",
    marginBottom: 10,
  },
  backbutton: {
    width: 48,
    height: 48,
    resizeMode: "contain",
  },
  tabIcon: {
    width: 48,
    height: 48,
    resizeMode: "contain",
  },
  contentRow: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  textContainer: {
    flex: 1,
  },
  downIcon: {
    width: 48,
    height: 48,
    marginLeft: 12,
    resizeMode: "contain",
  },
  editBtnActive: {
    backgroundColor: "#7B00FF",
  },
})
