import React, { Component } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Card,Icon } from "react-native-elements";
import firebase from "firebase";
import { RFValue } from "react-native-responsive-fontsize";
import MyHeader from '../components/MyHeader';
import db from "../config.js";

export default class DonorDetailsScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: firebase.auth().currentUser ? firebase.auth().currentUser.email : "unknown user",
      userName: "",
      donorId: this.props.navigation.getParam("details")["user_id"],
      requestId: this.props.navigation.getParam("details")["request_id"],
      itemsName: this.props.navigation.getParam("details")["item_name"],
      reason_for_requesting: this.props.navigation.getParam("details")[ "reason_to_request"],
      donorName: "",
      donorContact: "",
      donorAddress: "",
      donorRequestDocId: "",
    };
  }

  getdonorDetails() {
    db.collection("users")
      .where("email_id", "==", this.state.requestId)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          this.setState({
            donorName: doc.data().first_name,
            donorContact: doc.data().contact,
            donorAddress: doc.data().address,
          });
        });
      });

    db.collection("requested_items")
      .where("request_id", "==", this.state.requestId)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          this.setState({
            donorRequestDocId: doc.id,
          });
        });
      });
  }

  getUserDetails = (userId) => {
    db.collection("users")
      .where("email_id", "==", userId)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          this.setState({
            userName: doc.data().first_name + " " + doc.data().last_name,
          });
        });
      });
  };


  componentDidMount() {
    this.getdonorDetails();
    this.getUserDetails(this.state.userId);
  }

  render() {
    return (
      <View style={{ flex: 1,backgroundColor:'#2f2f2b' }}>
        <View style={{ flex: 0.1 }}>
           <MyHeader navigation={this.props.navigation} title="Donor details" />
        </View>
        <View style={{ flex: 0.9 }}>
          <View
            style={{
              flex: 0.3,
              flexDirection: "row",
              paddingTop: RFValue(10),
              paddingLeft: RFValue(10),
            }}
          >
            <View style={{ flex: 0.4,}}>
              <Image
                 source={require('../assets/donate.png')}
                style={{
                  width: "100%",
                  height: "100%",
                  resizeMode: "contain",
                }}
              />
            </View>
            <View
              style={{
                flex: 0.7,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  fontWeight: "bold",
                  fontSize: RFValue(30),
                  textAlign: "center",
                  color:'#ff7129'
                }}
              >
                {this.state.itemsName}
              </Text>
              <Text
                style={{
                  fontWeight: "bold",
                  fontSize: RFValue(15),
                  textAlign: "center",
                  marginTop: RFValue(15),
                  color:'#fff'
                }}
              >
                {this.state.reason_for_requesting}
              </Text>
            </View>
          </View>
          <View
            style={{
              flex: 0.7,
              padding: RFValue(20),
            }}
          >
            <View style={{ flex: 0.8 ,justifyContent:'center',marginTop:RFValue(20),borderWidth:3,backgroundColor:"#ff7129",borderColor:'#fff',paddingLeft:RFValue(10),paddingRight:RFValue(10)}}>
            <View>
            <Text style={{fontWeight:"bold",fontSize:30,color:"#fff", marginLeft:10,marginBottom:10,alignSelf:"center"}}>
            donor information</Text>
            </View>
              <Text
                style={{
                  fontWeight: "200",
                  fontSize: RFValue(20),
                  marginTop: RFValue(10),
                 color:'#2f2f2b'
                }}
              >
                Name: {this.state.donorName}
              </Text>
              <Text
                style={{
                  fontWeight: "200",
                  fontSize: RFValue(20),
                  marginTop: RFValue(20),
                  color:'#2f2f2b'
                }}
              >
                Contact: {this.state.donorContact}
              </Text>
              <Text
                style={{
                  fontWeight: "200",
                  fontSize: RFValue(20),
                  marginTop: RFValue(20),
                  color:'#2f2f2b'
                }}
              >
                Address: {this.state.donorAddress}
              </Text>
            </View>
            <View
              style={{
                flex: 0.3,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {this.state.donorId !== this.state.userId ? (
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => {
                    this.props.navigation.navigate("Transactions");
                  }}
                >
                  <Text style = {{color:'#2f2f2b',fontWeight:'bold'}}>okay</Text>
                </TouchableOpacity>
              ) : null}
            </View>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    width: "75%",
    height: RFValue(60),
    justifyContent: "center",
    marginTop:10,
    alignItems: "center",
    borderRadius: RFValue(60),
    backgroundColor: "#ff7129",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    elevation: 16,
  },
});
