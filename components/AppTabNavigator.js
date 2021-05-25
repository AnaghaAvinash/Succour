import React from 'react';
import { Image } from 'react-native';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import DonateScreen from '../screens/DonateScreen';
import RequestScreen from '../screens/RequestScreen';
import ReadStory from '../screens/ReadStory';
import WriteStory from '../screens/WriteStory';


export const AppTabNavigator = createBottomTabNavigator({
  Request: {
    screen: RequestScreen,
    navigationOptions :{
      tabBarIcon : <Image source={require("../assets/ask.png")} style={{width:25, height:25}}/>,
      tabBarLabel : "Request",
    }
  },
   Donate : {
    screen: DonateScreen,
    navigationOptions :{
      tabBarIcon : <Image source={require("../assets/donate.png")} style={{width:25, height:25}}/>,
      tabBarLabel : "Donate",
    }
  },

  Read: {
    screen: ReadStory,
    navigationOptions :{
      tabBarIcon : <Image source={require("../assets/read.png")} style={{width:25, height:25}}/>,
      tabBarLabel : "Read",
    }
  },

   Write: {
    screen: WriteStory,
    navigationOptions :{
      tabBarIcon : <Image source={require("../assets/write.png")} style={{width:25, height:25}}/>,
      tabBarLabel : "Write",
    }
  },

});
