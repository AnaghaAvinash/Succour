import React, { Component } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Card,Icon } from "react-native-elements";
import firebase from "firebase";
import { RFValue } from "react-native-responsive-fontsize";
import MyHeader from '../components/MyHeader';
import db from "../config.js";

export default class RecieverDetailsScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: firebase.auth().currentUser ? firebase.auth().currentUser.email : "unknown user",
      userName: "",
      recieverId: this.props.navigation.getParam("details")["user_id"],
      requestId: this.props.navigation.getParam("details")["request_id"],
      itemsName: this.props.navigation.getParam("details")["item_name"],
      expectedDate:this.props.navigation.getParam("details")["expected_date"],
      reason_for_requesting: this.props.navigation.getParam("details")[ "reason_to_request"],
      recieverName: "",
      recieverContact: "",
      recieverAddress: "",
      recieverRequestDocId: "",
    };
  }

  getRecieverDetails() {
    db.collection("users")
      .where("email_id", "==", this.state.recieverId)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          this.setState({
            recieverName: doc.data().first_name,
            recieverContact: doc.data().contact,
            recieverAddress: doc.data().address,
          });
        });
      });

    db.collection("requested_items")
      .where("request_id", "==", this.state.requestId)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          this.setState({
            recieverRequestDocId: doc.id,
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

  updateitemstatus = () => {
    db.collection("all_donations").add({
      item_name: this.state.itemsName,
      request_id: this.state.requestId,
      requested_by: this.state.recieverName,
      donor_id: this.state.userId,
      request_status: "Donor Interested",
    });
  };

  addNotification = () => {
    var message =
      this.state.userName + " has shown interest in donating the item";
    db.collection("all_notifications").add({
      targeted_user_id: this.state.recieverId,
      donor_id: this.state.userId,
      request_id: this.state.requestId,
      item_name: this.state.itemsName,
      date: firebase.firestore.FieldValue.serverTimestamp(),
      notification_status: "unread",
      message: message,
    });
  };

  componentDidMount() {
    this.getRecieverDetails();
    this.getUserDetails(this.state.userId);
  }

  render() {
    return (
      <View style={{ flex: 1,backgroundColor:'#2f2f2b' }}>
        <View style={{ flex: 0.1 }}>
           <MyHeader navigation={this.props.navigation} title="Reciever details" />
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
            Reciever information</Text>
            </View>
              <Text
                style={{
                  fontWeight: "300",
                  fontSize: RFValue(20),
                  marginTop: RFValue(10),
                 color:'#2f2f2b'
                }}
              >
                Name: {this.state.recieverName}
              </Text>
              <Text
                style={{
                  fontWeight: "300",
                  fontSize: RFValue(20),
                  marginTop: RFValue(20),
                  color:'#2f2f2b'
                }}
              >
                Contact: {this.state.recieverContact}
              </Text>
              <Text
                style={{
                  fontWeight: "300",
                  fontSize: RFValue(20),
                  marginTop: RFValue(20),
                  color:'#2f2f2b'
                }}
              >
                Address: {this.state.recieverAddress}
              </Text>
            </View>
            <View
              style={{
                flex: 0.3,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {this.state.recieverId !== this.state.userId ? (
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => {
                    this.updateitemstatus();
                    this.addNotification();
                    this.props.navigation.navigate("MyDonations");
                  }}
                >
                  <Text style = {{color:'#2f2f2b',fontWeight:'bold'}}>I want to Donate</Text>
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
