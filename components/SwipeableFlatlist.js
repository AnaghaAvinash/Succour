import React, { Component } from "react";
import {
  Animated,
  Dimensions,
  StyleSheet,
  Text,
  TouchableHighlight,
  View
} from "react-native";
import { ListItem, Icon } from "react-native-elements";

import { SwipeListView } from "react-native-swipe-list-view";

import db from "../config";

export default class SwipeableFlatlist extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allNotifications: this.props.allNotifications
    };
  }

  updateMarkAsread = notification => {
    db.collection("all_notifications")
      .doc(notification.doc_id)
      .update({
        notification_status: "read"
      });
  };

  onSwipeValueChange = swipeData => {
    var allNotifications = this.state.allNotifications;
    const { key, value } = swipeData;
    if (value < -Dimensions.get("window").width) {
      const newData = [...allNotifications];
      this.updateMarkAsread(allNotifications[key]);
      newData.splice(key, 1);
      this.setState({ allNotifications: newData });
    }
  };

  renderItem = data => (
    <Animated.View>
      <ListItem
        leftElement={<Icon name="bell" type="font-awesome" color="#ff7129" />}
        containerStyle={{backgroundColor:"#2f2f2b"}}
        title={data.item.item_name}
        titleStyle={{ color: "#ff7129", fontWeight: "bold" }}
        subtitle={data.item.message}
        subtitleStyle={{color:"#fff"}}
        bottomDivider
      />
    </Animated.View>
  );

  renderHiddenItem = () => (
    <View style={styles.rowBack}>
      <View style={[styles.backRightBtn, styles.backRightBtnRight]}>
        <Text style={styles.backTextWhite}>Mark as read</Text>
      </View>
    </View>
  );

  render() {
    return (
      <View style={styles.container}>
        <SwipeListView
          disableRightSwipe
          data={this.state.allNotifications}
          renderItem={this.renderItem}
          renderHiddenItem={this.renderHiddenItem}
          rightOpenValue={-Dimensions.get("window").width}
          previewRowKey={"0"}
          previewOpenValue={-40}
          previewOpenDelay={3000}
          onSwipeValueChange={this.onSwipeValueChange}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#2f2f2b",
    flex: 1
  },
  backTextWhite: {
    color: "#2f2f2b",
    fontWeight: "bold",
    fontSize: 15,
    textAlign: "center",
    alignSelf: "flex-start"
  },
  rowBack: {
    alignItems: "center",
    backgroundColor: "#ff7129",
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingLeft: 15
  },
  backRightBtn: {
    alignItems: "center",
    bottom: 0,
    justifyContent: "center",
    position: "absolute",
    top: 0,
    width: 100
  },
  backRightBtnRight: {
    backgroundColor: "#ff7129",
    right: 0
  }
});
