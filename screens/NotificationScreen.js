import React, { Component } from "react";
import { StyleSheet, View, FlatList, Text, Image } from "react-native";
import { ListItem, Icon } from "react-native-elements";
import firebase from "firebase";
import MyHeader from "../components/MyHeader";
import SwipeableFlatlist from "../components/SwipeableFlatlist";
import db from "../config";

export default class NotificationScreen extends Component {
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
           <MyHeader navigation={this.props.navigation} title="Notifications" />
        </View>
        <View style={{ flex: 0.8 }}>
          {this.state.allNotifications.length === 0 ? (
            <View style={styles.imageView}>
              <Image source={require("../assets/nothing.gif")} />
            </View>
          ) : (
            <SwipeableFlatlist allNotifications={this.state.allNotifications} />
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
