import React, { Component } from "react";
import {
  View,
  Text,
  KeyboardAvoidingView,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  FlatList,
  TouchableHighlight,
  Alert,
  Image,
  TextInput
} from "react-native";
import db from "../config";
import firebase from "firebase";
import { RFValue } from "react-native-responsive-fontsize";
import MyHeader from "../components/MyHeader";
import Animation from "../components/Animation"

export default class RequestScreen extends Component {
  constructor() {
    super();
    this.state = {
      userId: firebase.auth().currentUser ? firebase.auth().currentUser.email : "unknown user",
      itemsName: "",
      reasonToRequest: "",
      IsitemRequestActive: "",
      requesteditemsName: "",
      itemsStatus: "",
      requestId: "",
      userDocId: "",
      docId: "",
      showFlatlist: false,
    };
  }

  createUniqueId() {
    return Math.random().toString(36).substring(7);
  }

  addRequest = async (itemsName, reasonToRequest) => {
    var userId = this.state.userId;
    var randomRequestId = this.createUniqueId();



    db.collection("requested_items").add({
      user_id: userId,
      item_name: itemsName,
      reason_to_request: reasonToRequest,
      request_id: randomRequestId,
      items_status: "requested",
      date: firebase.firestore.FieldValue.serverTimestamp(),
    });

    await this.getitemsRequest();
    db.collection("users")
      .where("email_id", "==", userId)
      .get()
      .then()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          db.collection("users").doc(doc.id).update({
            IsitemRequestActive: true,
          });
        });
      });

    this.setState({
      itemsName: "",
      reasonToRequest: "",
      requestId: randomRequestId,
    });

    return Alert.alert("Item requested successfully");
  };

  receiveditems = (itemsName) => {
    var userId = this.state.userId;
    var requestId = this.state.requestId;
    db.collection("received_item").add({
      user_id: userId,
      item_name: itemsName,
      request_id: requestId,
      itemsStatus: "received",
    });
  };

  getIsitemsRequestActive() {
    db.collection("users")
      .where("email_id", "==", this.state.userId)
      .onSnapshot((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          this.setState({
            IsitemRequestActive: doc.data().IsitemRequestActive,
            userDocId: doc.id,
          });
        });
      });
  }

  getitemsRequest = () => {
    // getting the requested items
    var itemsRequest = db
      .collection("requested_items")
      .where("user_id", "==", this.state.userId)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          if (doc.data().items_status !== "received") {
            this.setState({
              requestId: doc.data().request_id,
              requesteditemsName: doc.data().item_name,
              itemsStatus: doc.data().items_status,
              docId: doc.id,
            });
          }
        });
      });
  };

  sendNotification = () => {
    //to get the first name and last name
    db.collection("users")
      .where("email_id", "==", this.state.userId)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          var name = doc.data().first_name;
          var lastName = doc.data().last_name;

          // to get the donor id and items nam
          db.collection("all_notifications")
            .where("request_id", "==", this.state.requestId)
            .get()
            .then((snapshot) => {
              snapshot.forEach((doc) => {
                var donorId = doc.data().donor_id;
                var itemsName = doc.data().item_name;

                //targert user id is the donor id to send notification to the user
                db.collection("all_notifications").add({
                  targeted_user_id: donorId,
                  message:
                    name + " " + lastName + " received the item " + itemsName,
                  notification_status: "unread",
                  item_name: itemsName,
                });
              });
            });
        });
      });
  };

  componentDidMount() {
    this.getitemsRequest();
    this.getIsitemsRequestActive();
  }

  updateitemsRequestStatus = () => {
    //updating the items status after receiving the items
    db.collection("requested_items").doc(this.state.docId).update({
      items_status: "received",
    });

    //getting the  doc id to update the users doc
    db.collection("users")
      .where("email_id", "==", this.state.userId)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          //updating the doc
          db.collection("users").doc(doc.id).update({
            IsitemRequestActive: false,
          });
        });
      });
  };
  
  render() {
    if (this.state.IsitemRequestActive === true) {
      return (
        <View style={{ flex: 1,backgroundColor:"#2f2f2b"}}>
             <MyHeader navigation={this.props.navigation} title="Item's status" />
          <View
            style={styles.ImageView}
          >
            <Image
              source={require('../assets/donate.png')}
              style={styles.imageStyle}
            />
          </View>
          <View
            style={styles.itemsstatus}
          >
            <Text
              style={{
                fontSize: RFValue(20),
                fontWeight:'200',
                alignSelf:'center',
                marginTop:RFValue(40),
                color:'#ff7129'
              }}
            >
              Name of the items
            </Text>
            <Text
              style={{
                fontSize: RFValue(20),
                fontWeight:"bold",
                alignSelf:'center',
                color:'#ff7129'
                }}
            >
              {this.state.requesteditemsName}
            </Text>
            <Text
              style={{
                fontSize: RFValue(20),
                fontWeight:'200',
                alignSelf:'center',
                color:'#ff7129',
                marginTop:RFValue(20),
              }}
            >
              Status
            </Text>
            <Text
              style={{
                fontSize: RFValue(20),
                fontWeight:"bold",
                alignSelf:'center',
                marginBottom:RFValue(20),
                color:'#ff7129'
              }}
            >
              {this.state.itemsStatus}
            </Text>
          </View>
          <View>
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                this.sendNotification();
                this.updateitemsRequestStatus();
                this.receiveditems(this.state.requesteditemsName);
              }}
            >
              <Text
                style={styles.buttontxt}
              >
                Item recieved
              </Text>
            </TouchableOpacity>
            
          </View>
        </View>
      );
    }
    return (
      <View style={{ flex: 1,backgroundColor:"#2f2f2b"}}>
           <MyHeader navigation={this.props.navigation} title="Request item" />
           <View style={{ alignItems: "center" }}>
            <Animation/>
          <TextInput
            style={styles.formTextInput}
            placeholder={"Items's name"}
            placeholderTextColor="#2f2f2b"
            containerStyle={{ marginTop: RFValue(60) }}
              onChangeText={(text) => {
                  this.setState({
                    itemsName: text,
                  });
                }}
            value={this.state.itemsName}
          />
           </View>
           
            <View style={{ alignItems: "center" }}>
              <TextInput
                style={[styles.formTextInput,{height:100}]}
                containerStyle={{ marginTop: RFValue(30) }}
                placeholderTextColor="#2f2f2b"
                multiline
                numberOfLines={8}
                placeholder={"Why do you need this?"}
                onChangeText={(text) => {
                  this.setState({
                    reasonToRequest: text,
                  });
                }}
                value={this.state.reasonToRequest}
              />
              <TouchableOpacity
                style={styles.Bbutton}
                onPress={() => {
                    this.addRequest(
                    this.state.itemsName,
                    this.state.reasonToRequest,
                  );
                }}
              >
                <Text
                  style={styles.requestbuttontxt}
                >
                  Request
                </Text>
              </TouchableOpacity>
                 
            </View>
        </View>
    );
  }
}

const styles = StyleSheet.create({
  formTextInput: {
    width: 250,
    height: RFValue(40),
    borderColor:'#fff',
    borderWidth: 3,
    marginBottom:15,
    padding: 10,
    borderRadius:5,
    color:'#2f2f2b',
    backgroundColor:'#ff7129',
  },
  ImageView:{
    marginTop:20
  },
  imageStyle:{
    height: RFValue(200),
    width: RFValue(200),
    alignSelf: "center",
    marginTop:RFValue(20)
  },
  itemsstatus:{
    alignItems: "center",
  },
  buttontxt:{
    fontSize: RFValue(18),
    fontWeight: "bold",
    color: "#fff",
    alignSelf:'center'
  },
  requestbuttontxt:{
    fontSize: RFValue(20),
    fontWeight: "bold",
    color: "#fff",
  },
  button: {
    width: RFValue(200),
    height: RFValue(60),
    alignSelf: "center",
    borderRadius: RFValue(50),
    backgroundColor: "#ff7129",
    shadowColor: "fff",
    marginTop:20,
    padding:20,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.44,
    shadowRadius: 10.32,
    elevation: 16,
  },
   Bbutton: {
    width: RFValue(150),
    height: RFValue(50),
    justifyContent: "center",
    alignItems: "center",
    borderRadius: RFValue(50),
    backgroundColor: "#ff7129",
    shadowColor: "fff",
    marginTop:15,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.44,
    shadowRadius: 10.32,
    elevation: 16,
  },
});
