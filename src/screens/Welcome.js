import React from 'react'
import {
  View,
  Text,
  StyleSheet,
  Button,
  TouchableOpacity,
  Image,
} from 'react-native'
import welcome from '../assets/welcome.png'

export default function Welcome ({navigation}) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hello</Text>

      <Image source={welcome} style={styles.welcomeImg} />

      <Text style={styles.subtitle}>Welcome to Full Stack App</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Login')}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('SignUp')}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  title: {
    fontSize: 32,
    color: 'black',
    fontWeight: 'bold',
    marginRight: 5,
    marginBottom: 30,
  },
  subtitle: {
    fontSize: 20,
    color: 'black',
    textAlign: 'center',
    marginVertical: 20,
  },
  buttonContainer:{
    marginTop:20
  },
  button: {
    backgroundColor: '#6C63FF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginVertical: 10,
    width: 210,
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
    textAlign: 'center',
    fontWeight: '700',
  },
  welcomeImg: {
    width: 350,
    height: 300,
    marginLeft:4
  },
})
