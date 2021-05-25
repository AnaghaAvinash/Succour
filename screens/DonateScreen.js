import React, { Component } from "react";
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
} from "react-native";
import { ListItem } from "react-native-elements";
import firebase from "firebase";
import db from "../config";
import MyHeader from "../components/MyHeader";

export default class DonateScreen extends Component {
  constructor() {
    super();
    this.state = {
      userId: firebase.auth().currentUser.email,
      requestedItemsList: [],
    };
    this.requestRef = null;
  }

  getRequestedItemsList = () => {
    this.requestRef = db
      .collection("requested_items")
      .onSnapshot((snapshot) => {
        var requestedItemsList = snapshot.docs.map((doc) => doc.data());
        this.setState({
          requestedItemsList: requestedItemsList,
        });
      });
  };

  componentDidMount() {
    this.getRequestedItemsList();
  }

  componentWillUnmount() {
  this.requestRef();
  }

  keyExtractor = (item, index) => index.toString();

  renderItem = ({ item, i }) => {
    return (
      <ListItem
        key={i}
        title={item.item_name}
        subtitle={item.reason_to_request}
        containerStyle={{backgroundColor:"2f2f2b"}}
        titleStyle={{ color: "#ff7129", fontWeight: "bold" }}
        subtitleStyle={{color:"#fff"}}
        leftElement={
          <Image
            style={{ height: 50, width: 50 }}
            source={require("../assets/donate.png")}
          />
        }
        rightElement={
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              this.props.navigation.navigate("RecieverDetails", {
                details: item,
              });
            }}
          >
            <Text style={{ color: "#ffff" }}>View</Text>
          </TouchableOpacity>
        }
        bottomDivider
      />
    );
  };

  render() {
    return (
      <View style={styles.view}>
       <MyHeader navigation={this.props.navigation} title="Donate items" />
        <View style={{ flex: 1 }}>
          {this.state.requestedItemsList.length === 0 ? (
            <View style={styles.subContainer}>
               <Image
            source={require("../assets/nothing.gif")}
          />
            </View>
          ) : (
            <FlatList
              keyExtractor={this.keyExtractor}
              data={this.state.requestedItemsList}
              renderItem={this.renderItem}
            />
          )}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  subContainer: {
    flex: 1,
    fontSize: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    width: 100,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ff7129",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
  },
  view:{
    flex: 1,
    backgroundColor: "#2f2f2b"
  }
});
