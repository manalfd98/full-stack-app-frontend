import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ActivityIndicator } from 'react-native';
import signupImage from '../assets/signup.png';
import axios from 'axios';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';

const BASE_URL = 'https://node-firebase-backend.vercel.app';

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation();

  const handleSignUp = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${BASE_URL}/auth/createUser`, {
        name: name,
        email: email,
        password: password,
      });

      if (response.data) {
        const { customToken } = response.data;
        const userCredential = await auth().signInWithCustomToken(customToken);
        const idToken = await userCredential.user.getIdToken();
        const uid = userCredential.user.uid;

        const user = {
          email: email,
          uid: uid,
          idToken: idToken,
        };

        await AsyncStorage.setItem('user', JSON.stringify(user));

        console.log('User is signed in ::', user);
        setLoading(false);
        Toast.show({
          type: 'success',
          text1: 'Account Created',
          text2: 'Your account has been created successfully!',
        });
        navigation.navigate('Profile');
      }
    } catch (error) {
      console.error('Error signing up:', error);
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={signupImage} style={styles.signupImg} />
      <Text style={styles.title}>Sign Up</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Name</Text>
        <TextInput
          style={styles.input}
          placeholder='Name'
          value={name}
          onChangeText={setName}
        />
        <Text style={styles.inputLabel}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder='Email'
          value={email}
          onChangeText={setEmail}
          keyboardType='email-address'
        />
        <Text style={styles.inputLabel}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder='Password'
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
      </View>

      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#6C63FF" />
        </View>
      ) : (
        <TouchableOpacity style={styles.button} onPress={handleSignUp}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
      )}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    padding: 20,
  },
  title: {
    fontSize: 32,
    color: '#333',
    marginBottom: 10,
    fontWeight: 'bold',
  },
  inputContainer: {
    width: '100%',
    marginVertical: 12,
  },
  inputLabel: {
    alignSelf: 'flex-start',
    marginLeft: '10%',
    marginBottom: 5,
    color: '#333',
    fontSize: 16,
  },
  input: {
    width: '80%',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 12,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#6C63FF',
    alignSelf: 'center',
    color: 'black',
  },
  button: {
    backgroundColor: '#6C63FF',
    paddingVertical: 10,
    paddingHorizontal: 50,
    borderRadius: 25,
    marginVertical: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  signupImg: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    marginTop: 10,
  },
});
