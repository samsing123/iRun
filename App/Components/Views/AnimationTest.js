import React,{Component} from 'react'
import {AppRegistry, ScrollView, View } from 'react-native'
import {Bar,StockLine,SmoothLine,Scatterplot,Radar,Tree,Pie} from 'react-native-pathjs-charts'
import sampleData from './data'

class AnimationTest extends Component {
    constructor(props){
      super(props);
    }
    render() {
        return (
          <ScrollView style={{flex:1,backgroundColor:'#F5FCFF'}} contentContainerStyle={{justifyContent:'center',alignItems:'center'}}>
            <Bar data={sampleData.bar.data} options={sampleData.bar.options} accessorKey='v'/>
          </ScrollView>
        );
    }
}

module.exports = AnimationTest;
