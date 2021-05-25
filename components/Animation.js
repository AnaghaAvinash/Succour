import React from 'react';
import LottieView from 'lottie-react-native';

export default class Animation extends React.Component {
  render() {
    return (
      <LottieView
      source={require('../assets/lottie.json')}
      style={{width:"70%"}}
      autoPlay loop />
    )
  }
}
