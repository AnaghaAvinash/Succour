import React, { Component } from "react";
import { StyleSheet, View, FlatList, Text, Image, TouchableOpacity } from "react-native";
import { ListItem, Icon } from "react-native-elements";
import firebase from "firebase";
import MyHeader from "../components/MyHeader";
import db from "../config";

export default class Transactions extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userId: firebase.auth().currentUser.email,
      allNotifications: []
    };

    this.notificationRef = null;
  }

  getNotifications = () => {
    this.notificationRef = db
      .collection("all_notifications")
      .where("notification_status", "==", "unread")
      .where("targeted_user_id", "==", this.state.userId)
      .onSnapshot(snapshot => {
        var allNotifications = [];
        snapshot.docs.map(doc => {
          var notification = doc.data();
          notification["doc_id"] = doc.id;
          allNotifications.push(notification);
        });
        this.setState({
          allNotifications: allNotifications
        });
      });
  };

  componentDidMount() {
    this.getNotifications();
  }

  componentWillUnmount() {
    this.notificationRef();
  }

  keyExtractor = (item, index) => index.toString();

  renderItem = ({ item, index }) => {
    return (
      <ListItem
        key={index}
        containerStyle={{backgroundColor:"#2f2f2b"}}
        leftElement={<Icon name="bell" type="font-awesome" color="#ff7129" />}
        rightElement={<TouchableOpacity style={{ width: 100,height: 30,justifyContent: "center",alignItems: "center",backgroundColor: "#ff7129",shadowColor: "#000",shadowOffset: {  width: 0,  height: 8,}}}
        onPress={() => {
              this.props.navigation.navigate("DonorDetails", {
                details: item,
              });
            }}>
        <Text style={{color:"#fff"}}>View</Text>
        </TouchableOpacity>}
        title={item.item_name}
        titleStyle={styles.LiTitle}
        subtitle={item.message}
        subtitleStyle={{color:"#fff"}}
        bottomDivider
      />
    );
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={{ flex: 0.13 }}>
           <MyHeader navigation={this.props.navigation} title="Transactions" />
        </View>
        <View style={{ flex: 0.8 }}>
          {this.state.allNotifications.length === 0 ? (
            <View style={styles.imageView}>
              <Image source={require("../assets/nothing.gif")} />
            </View>
          ) : (
             <FlatList
              keyExtractor={this.keyExtractor}
              data={this.state.allNotifications}
              renderItem={this.renderItem}
            />
          )}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#2f2f2b"
  },
  imageView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  LiTitle: {
    color: "#ff7129",
    fontWeight: "bold"
  }
});
