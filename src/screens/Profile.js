import React, {useState, useEffect} from 'react'
import {
  View,
  Text,
  Modal,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from 'react-native'
import {launchImageLibrary} from 'react-native-image-picker'
import {useNavigation} from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import auth from '@react-native-firebase/auth'
import axios from 'axios'


const BASE_URL = 'https://node-firebase-backend.vercel.app' 



const Profile = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [profilePic, setProfilePic] = useState(null)
  const [isModalVisible, setIsModalVisible] = useState(false)

  const navigation = useNavigation()

  useEffect(() => {
    loadUserProfile()
  }, [handleUploadPic])

  const loadUserProfile = async () => {
    try {
      const user = await AsyncStorage.getItem('user')
      if (!user) {
        console.error('No user data found in AsyncStorage')
        return
      }

      const parsedUser = JSON.parse(user)
      const idToken = parsedUser.idToken
      const uid = parsedUser.uid

      console.log("user ::",user)

      console.log('Fetching profile for UID:', uid)

      const response = await axios.post(
        `${BASE_URL}/user/profile`,
        {uid: uid},
        {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        },
      )

      console.log('Profile API response:', response.data)

      const {name, email, profilePictureUrl} = response.data.data

      setName(name)
      setEmail(email)
      setProfilePic(profilePictureUrl)
      console.log(response.data.data)
    } catch (error) {
      console.error('Error loading user profile:', error)
    }
  }

  const handleEditProfile = () => {
    setIsModalVisible(true) // Open modal for editing profile
  }

  const handleSaveProfile = async () => {
    try {
      const user = await AsyncStorage.getItem('user')
      if (!user) {
        console.error('No user data found in AsyncStorage')
        return
      }

      const parsedUser = JSON.parse(user)
      const idToken = parsedUser.idToken
      const uid = parsedUser.uid

      const updatedProfile = {
        uid,
        name,
        email,
        profilePictureUrl: profilePic,
      }

      const response = await axios.put(
        `${BASE_URL}/user/updateProfile`,
        updatedProfile,
        {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        },
      )

      console.log('Profile updated successfully:', response.data)
      setIsModalVisible(false)
    } catch (error) {
      console.error('Error saving user profile:', error)
      Alert.alert('Error', 'Failed to save profile')
    }
  }

  const handleUploadPic = () => {
    launchImageLibrary({mediaType: 'photo'}, async response => {
      if (response.assets && response.assets.length > 0) {
        const imageUri = response.assets[0].uri
        try {
          const user = await AsyncStorage.getItem('user')
          if (!user) {
            console.error('No user data found in AsyncStorage')
            return
          }

          const parsedUser = JSON.parse(user)
          const idToken = parsedUser.idToken
          const uid = parsedUser.uid

          const formData = new FormData()
          formData.append('image', {
            uri: imageUri,
            name: 'profile.jpg',
            type: 'image/jpeg',
          })
          formData.append('uid', uid)

          console.log(formData)

          const config = {
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${idToken}`,
            },
          }

          const uploadResponse = await axios.post(
            `${BASE_URL}/media/uploadImage`,
            formData,
            config,
          )


          setProfilePic(uploadResponse.data.imageUrl);

        } catch (error) {
          console.error('Error uploading profile picture:', error)
          Alert.alert('Error', 'Failed to upload profile picture')
        }
      }
    })
  }

  const handleLogout = async () => {
    try {
      await auth().signOut()
      await AsyncStorage.removeItem('user')
      navigation.navigate('Welcome')
    } catch (error) {
      console.error('Error logging out:', error)
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>

      <View style={styles.profilePicContainer}>
        {profilePic ? (
          <Image source={{uri: profilePic}} style={styles.profileImage} />
        ) : (
          <Text>No Profile Picture</Text>
        )}
      </View>

      <Text style={styles.text}>Name: {name}</Text>
      <Text style={styles.text}>Email: {email}</Text>

      <TouchableOpacity onPress={handleEditProfile} style={styles.editButton}>
        <Text style={styles.editButtonText}>Edit Profile</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleUploadPic} style={styles.uploadButton}>
        <Text style={styles.uploadButtonText}>Upload Picture</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>

      <Modal
        animationType='slide'
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Profile</Text>

            <TextInput
              style={styles.input}
              placeholder='Name'
              value={name}
              onChangeText={setName}
            />

            <TextInput
              style={styles.input}
              placeholder='Email'
              value={email}
              onChangeText={setEmail}
              keyboardType='email-address'
            />

            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSaveProfile}>
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setIsModalVisible(false)}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 20,
  },
  text: {
    fontSize: 18,
    marginBottom: 12,
    color: 'black',
  },
  title: {
    fontSize: 32,
    color: '#333',
    fontWeight: 'bold',
    marginBottom: 60,
  },
  editButton: {
    backgroundColor: '#6C63FF',
    paddingVertical: 10,
    paddingHorizontal: 50,
    borderRadius: 25,
    marginVertical: 10,
  },
  editButtonText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  uploadButton: {
    backgroundColor: '#6C63FF',
    paddingVertical: 10,
    paddingHorizontal: 50,
    borderRadius: 25,
    marginVertical: 10,
  },
  uploadButtonText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: '#FF6347',
    paddingVertical: 10,
    paddingHorizontal: 50,
    borderRadius: 25,
    marginVertical: 10,
  },
  logoutButtonText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    backgroundColor: '#f2f2f2',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  saveButton: {
    backgroundColor: '#6C63FF',
    paddingVertical: 12,
    paddingHorizontal: 50,
    borderRadius: 25,
    marginTop: 20,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  cancelButton: {
    marginTop: 10,
  },
  cancelButtonText: {
    color: '#999',
    fontSize: 16,
    textAlign: 'center',
  },
  profilePicContainer: {
    width: 150,
    height: 150,
    borderRadius: 75,
    overflow: 'hidden',
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f2f2f2',
  },
  profileImage: {
    width: '100%', // Corrected from '100' to '100%'
    height: '100%', // Corrected from '100' to '100%'
  },
})

export default Profile
