import React, { Component } from "react";
import {
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Card } from "react-native-elements";
import MyHeader from "../components/MyHeader";
import { Avatar } from 'react-native-elements';
import * as ImagePicker from 'expo-image-picker';
import db from "../config";
import firebase from "firebase";
import { RFValue } from "react-native-responsive-fontsize";

export default class SettingScreen extends Component {
  constructor() {
    super();
    this.state = {
      emailId: "",
      firstName: "",
      lastName: "",
      address: "",
      contact: "",
      docId: "",
      userId: firebase.auth().currentUser
      ? firebase.auth().currentUser.email
      : 'unknown user',
    image: '#',
    name: '',
    };
  }

   selectPicture = async () => {
    const { cancelled, uri } = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!cancelled) {
      this.uploadImage(uri, this.state.userId);
    }
  };

  uploadImage = async (uri, imageName) => {
    var response = await fetch(uri);
    var blob = await response.blob();

    var ref = firebase
      .storage()
      .ref()
      .child('user_profiles/' + imageName);

    return ref.put(blob).then((response) => {
      this.fetchImage(imageName);
    });
  };

  fetchImage = (imageName) => {
    var storageRef = firebase
      .storage()
      .ref()
      .child('user_profiles/' + imageName);

    // Get the download URL
    storageRef
      .getDownloadURL()
      .then((url) => {
        this.setState({ image: url });
      })
      .catch((error) => {
        this.setState({ image: '#' });
      });
  };

  getUserProfile() {
    db.collection('users')
      .where('email_id', '==', this.state.userId)
      .onSnapshot((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          this.setState({
            name: doc.data().first_name + ' ' + doc.data().last_name,
            docId: doc.id,
            image: doc.data().image,
          });
        });
      });
  }

  componentDidMount() {
    this.fetchImage(this.state.userId);
    this.getUserProfile();
    this.getUserDetails();
  }


  getUserDetails = () => {
    var email = firebase.auth().currentUser.email;
    db.collection("users")
      .where("email_id", "==", email)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          var data = doc.data();
          this.setState({
            emailId: data.email_id,
            firstName: data.first_name,
            lastName: data.last_name,
            address: data.address,
            contact: data.contact,
            docId: doc.id,
          });
        });
      });
  };

  updateUserDetails = () => {
    db.collection("users").doc(this.state.docId).update({
      first_name: this.state.firstName,
      last_name: this.state.lastName,
      address: this.state.address,
      contact: this.state.contact,
    });

    Alert.alert("Profile Updated Successfully");
  };


  render() {
    return (
      <View style={{ flex: 1, backgroundColor:'#2f2f2b' }}>
        <View>
           <MyHeader navigation={this.props.navigation} title="Settings" />
        </View>


        <View style={styles.formContainer}>
            <View>
              <View>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            marginTop:RFValue(30),
            marginBottom:RFValue(20)
          }}>
          <Avatar
            rounded
            source={{
              uri: this.state.image,
            }}
            size={'xlarge'}
            onPress={() => this.selectPicture()}
            showEditButton
          />
             </View>
             
              <TextInput
                style={styles.formTextInput}
                placeholder={"First Name"}
                placeholderTextColor="#2f2f2b"
                maxLength={12}
                onChangeText={(text) => {
                  this.setState({
                    firstName: text,
                  });
                }}
                value={this.state.firstName}
              />

              <TextInput
                style={styles.formTextInput}
                placeholder={"Last Name"}
                placeholderTextColor="#2f2f2b"
                maxLength={12}
                onChangeText={(text) => {
                  this.setState({
                    lastName: text,
                  });
                }}
                value={this.state.lastName}
              />

               
              <TextInput
                style={styles.formTextInput}
                placeholder={"Contact"}
                placeholderTextColor="#2f2f2b"
                maxLength={10}
                keyboardType={"numeric"}
                onChangeText={(text) => {
                  this.setState({
                    contact: text,
                  });
                }}
                value={this.state.contact}
              />

              <TextInput
                style={styles.formTextInput}
                placeholder={"Address"}
                multiline={true}
                placeholderTextColor="#2f2f2b"
                onChangeText={(text) => {
                  this.setState({
                    address: text,
                  });
                }}
                value={this.state.address}
              />
            </View>
              <View style={styles.buttonView}>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => {
                    this.updateUserDetails();
                  }}
                >
                  <Text style={styles.buttonText}>Save</Text>
                </TouchableOpacity>
            </View>
            </View>
          </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  formContainer:{
    backgroundColor:'#2f2f2b',
    justifyContent:'center'
  },
  formTextInput: {
    width: "90%",
    height: RFValue(50),
    padding: RFValue(10),
    borderWidth:3,
    borderRadius:15,
    borderColor:"#fff",
    backgroundColor:"#ff7129",
    marginBottom:RFValue(20),
    marginTop:RFValue(10),
    marginLeft:RFValue(20),
    color:"#2f2f2b"
  },
  button: {
    width: "40%",
    height: RFValue(50),
    justifyContent: "center",
    alignItems: "center",
    borderRadius: RFValue(50),
    marginTop:RFValue(10),
    backgroundColor: "#ff7129",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.44,
    shadowRadius: 10.32,
    elevation: 16,
  },
  buttonView:{ 
    alignItems: "center",
},
  buttonText: {
    fontSize: RFValue(23),
    fontWeight: "bold",
    color: "#fff",
  },
});
