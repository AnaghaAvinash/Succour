import * as React from 'react';
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
} from 'react-native';
import  MyHeader  from '../components/MyHeader';
import db from '../config';

export default class WriteStory extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      author: '',
      storyText: '',
    }
  }

  submitStory = ()=>{
        db.collection("stories").add({
            title: this.state.title,
            author: this.state.author,
            storyText: this.state.storyText
        })
        this.setState({
            title: '',
            author: '',
            storyText: ''
        })
        Alert.alert("Your incident has been submitted.")
    }
  render() {
    return (
      <KeyboardAvoidingView style={{flex:1,backgroundColor:"#2f2f2b"}} behaviour="padding" enabled>
        <View style={styles.allText}>
        <MyHeader navigation={this.props.navigation} title="Write incidents" />

          <TextInput
            style={styles.formTextInput}
            placeholder="Write the title of the incident here"
            placeholderTextColor="#2f2f2b"
            onChangeText= {(text)=>{
                        this.setState({
                            title: text
                        })
                    }}
                    value={this.state.title}
          />

          <TextInput
            style={styles.formTextInput}
            placeholder="Write your name here"
            placeholderTextColor="#2f2f2b"
            onChangeText= {(text)=>{
                        this.setState({
                            author: text
                        })
                    }}
                    value={this.state.author}
          />

          <TextInput
            style={[styles.formTextInput,{height:300}]}
            placeholder="Write your story here"
            placeholderTextColor="#2f2f2b"
            onChangeText= {(text)=>{
                        this.setState({
                            storyText: text
                        })
                    }}
                    value={this.state.storyText}
                    multiline={true}
          />

          <TouchableOpacity style={styles.buttons}>
            <Text style={styles.buttonText} onPress={this.submitStory}>
              Submit
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    );
  }
}
const styles = StyleSheet.create({
  formTextInput: {
    width: '75%',
    height: 45,
    alignSelf: 'center',
    borderColor: '#fff',
    borderRadius: 10,
    backgroundColor: "#ff7129",
    borderWidth: 3,
    marginTop: 20,
    padding: 10,
    color:"#2f2f2b"
  },
   buttons: {
    width: 150,
    height: 40,
    alignSelf: 'center',
    marginTop:15,
    borderRadius: 25,
    backgroundColor: "#ff7129",
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 10.32,
    elevation: 16,
    padding: 10,
  },
  buttonText:{
    color:'#fff',
    fontWeight:'bold',
    textAlign: 'center',
    fontSize: 15,
  }
});