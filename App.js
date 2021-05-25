import React from 'react';
import { createAppContainer, createSwitchNavigator,} from 'react-navigation';
import WelcomeScreen from './screens/WelcomeScreen';
import { AppTabNavigator } from './components/AppTabNavigator';
import { AppDrawerNavigator } from './components/AppDrawerNavigator';
import RecieverDetailsScreen from './screens/RecieverDetailsScreen';
import DonorDetailsScreen from './screens/DonorDetailsScreen';
import Transactions from './screens/Transactions'

export default function App() {
  return (
    <AppContainer/>
  );
}


const switchNavigator = createSwitchNavigator({
  WelcomeScreen:{screen: WelcomeScreen},
  Drawer:{screen: AppDrawerNavigator},
  BottomTab: {screen: AppTabNavigator},
  RecieverDetails:{screen:RecieverDetailsScreen},
  DonorDetails:{screen:DonorDetailsScreen},
  Transactions:{screen:Transactions}

})

const AppContainer =  createAppContainer(switchNavigator);
