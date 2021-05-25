import React from 'react';
import { StyleSheet, Text, View ,FlatList,ScrollView, TouchableOpacity} from 'react-native';
import {SearchBar} from 'react-native-elements';
import db from '../config';
import MyHeader from '../components/MyHeader'

export default class ReadStory extends React.Component {
  constructor(){
    super();
    this.state ={
      allStories:[],
      dataSource:[],
      search : ''
    }
  }
  componentDidMount(){
    this.retrieveStories()
  }

  updateSearch = search => {
    this.setState({ search });
  };

  retrieveStories=()=>{
    try {
      var allStories= []
      var stories = db.collection("stories")
        .get().then((querySnapshot)=> {
          querySnapshot.forEach((doc)=> {
              allStories.push(doc.data())
          })
          this.setState({allStories})
        })
    }
    catch (error) {
      console.log(error);
    }
  };

  SearchFilterFunction(text) {
    const newData = this.state.allStories.filter((item)=> {
      const itemData = item.title ? item.title.toUpperCase() : ''.toUpperCase();
      const textData = text.toUpperCase();
      return itemData.indexOf(textData) > -1;
    });
    this.setState({
      dataSource: newData,
      search: text,
    });
  }

    render(){
      return(
        <View style ={styles.container}>
          <MyHeader navigation={this.props.navigation} title="Read incidents" />
          <View styles ={{height:10,width:'10%'}}>
              <SearchBar
              placeholder="Type Here..."
              onChangeText={text => this.SearchFilterFunction(text)}
              onClear={text => this.SearchFilterFunction('')}
              value={this.state.search}
            />
          </View>
          
          <FlatList
                data={this.state.search === "" ?  this.state.allStories: this.state.dataSource}
                renderItem={({ item }) => (
                  <View style={styles.itemContainer}>
                    <Text style={{color:'#ff7129',fontWeight:'bold',fontSize:30,alignSelf:'center'}}>{item.title}</Text>
                    <Text style={{color:'#ff7129',alignSelf:'center',fontWeight:'bold'}}> By : {item.author}</Text>
                    <Text style={{color:'#fff'}}>{item.storyText}</Text>
                  </View>
                )}
                keyExtractor={(item, index) => index.toString()}
                /> 
        </View>  
      );      
    }
}

const styles = StyleSheet.create({
  container: {
  backgroundColor: '#2f2f2b',
  },
  itemContainer: {
    borderWidth: 10,
    borderColor: '#ff7129',
    padding:20
  },
});