import React from 'react'
import {NavigationContainer} from '@react-navigation/native'
import {createStackNavigator} from '@react-navigation/stack'
import Welcome from './src/screens/Welcome'
import Login from './src/screens/Login'
import SignUp from './src/screens/SignUp'
import Profile from './src/screens/Profile'
import auth from '@react-native-firebase/auth'
import Toast from 'react-native-toast-message'

const Stack = createStackNavigator()

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Welcome'>
        <Stack.Screen
          name='Welcome'
          component={Welcome}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name='Login'
          component={Login}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name='SignUp'
          component={SignUp}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name='Profile'
          component={Profile}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
      <Toast ref={ref => Toast.setRef(ref)} />
    </NavigationContainer>
  )
}

export default App
