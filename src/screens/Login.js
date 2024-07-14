import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ActivityIndicator } from 'react-native';
import login from '../assets/login.png';
import fb from '../assets/fb.png';
import google from '../assets/google.png';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';


export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigation = useNavigation();

  const handleLogin = async () => {
    setLoading(true);
    try {
      const userCredential = await auth().signInWithEmailAndPassword(email, password);
      const idToken = await userCredential.user.getIdToken();
      const uid = userCredential.user.uid;

      console.log(idToken);

      if (userCredential) {
        const user = {
          email: email,
          uid: uid,
          idToken: idToken,
        };

        await AsyncStorage.setItem('user', JSON.stringify(user));

        setLoading(false);
        Toast.show({
          type: 'success',
          text1: 'Login Successful',
          text2: 'You have successfully logged in.',
        });
        navigation.navigate('Profile');
      }
    } catch (error) {
      console.error('Error signing in:', error);
      setError(error.message);
      setLoading(false);
      
    }
  };

  return (
    <View style={styles.container}>
      <Image source={login} style={styles.loginImg} />
      <Text style={styles.title}>Login</Text>

      <View style={styles.inputContainer}>
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
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        style={styles.signupButton}
        onPress={() => navigation.navigate('SignUp')}>
        <Text style={styles.signupText}>Not have an account, Sign Up</Text>
      </TouchableOpacity>

      <View style={styles.socialContainer}>
        <Text style={styles.socialText}>Or login with:</Text>
        <TouchableOpacity>
          <Image source={fb} style={styles.socialImg} />
        </TouchableOpacity>
        <TouchableOpacity>
          <Image source={google} style={styles.socialImg} />
        </TouchableOpacity>
      </View>
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
    padding: 10,
  },
  title: {
    fontSize: 32,
    color: '#333',
    marginBottom: 10,
    fontWeight: 'bold',
  },
  inputContainer: {
    width: '100%',
    marginVertical: 20,
  },
  inputLabel: {
    alignSelf: 'flex-start',
    marginLeft: '10%',
    marginBottom: 5,
    color: 'black',
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
  signupButton: {
    backgroundColor: 'transparent',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 10,
  },
  signupText: {
    color: '#6C63FF',
    fontSize: 16,
  },
  loginImg: {
    width: 200,
    height: 200,
    marginTop: 10,
  },
  socialContainer: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  socialText: {
    color: '#333',
    marginRight: 10,
    fontSize: 16,
  },
  socialImg: {
    width: 40,
    height: 34,
    marginLeft: 5,
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
