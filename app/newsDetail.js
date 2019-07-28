/**
 * Created by chushikeji on 2017/6/23.
 */
'use strict';
import React, { Component } from 'react';
import {   Image,ScrollView,StyleSheet,View,Button,Text,
    Dimensions} from 'react-native';
import {StackNavigator} from 'react-navigation';
//html解析
import HTMLView from 'react-native-htmlview';
const { width } = Dimensions.get('window')

//详情 后面跟id
const  newsDetail = 'https://news-at.zhihu.com/api/4/news/';

//日报详情
class NewsDetail extends React.Component {
    constructor(props) {//构造方法
        super(props);
        this.state = {
            title:'',
            image:'',
            content:'',//html内容
            loaded: false,//是否加载  初始为false
        };
    }
    //static navigationOptions = {
    //    title: '日报详情',
    //};
    static navigationOptions = ({navigation}) => ({
        tabBarVisible:false,
        title: `${navigation.state.params.name}`,//设置标题
        headerStyle:{ backgroundColor: '#4abdcc',elevation:0,borderBottomWidth:1,borderBottomColor:'#dadada'},//导航栏样式  elevation:0去掉安卓底部阴影  iOS下用shadowOpacity: 0
        headerTitleStyle:{ color: 'white',alignSelf:'center',fontSize:16},//导航条文本样式     alignSelf:'center'文字居中
    });

    render() {
        if (!this.state.loaded) {//数据加载完成前
            return this.renderLoadingView();
        }
        return (
            //<View style={styles.container}>
            //    <ScrollView>
            //        <Image style={styles.img} source={{uri:this.state.image}}/>
            //        <HTMLView value={this.state.content} />
            //    </ScrollView>
            //    <View style={{width, height:48, backgroundColor:'#4abdcc', position :'absolute', left:0, bottom:0}}><Text>评论：224条</Text></View>
            //</View>
            <View style={styles.container}>
                <ScrollView>
                    <Image style={styles.img} source={{uri:this.state.image}}/>
                    <HTMLView value={this.state.content} />
                </ScrollView>
            </View>
        );
    }
    //生命周期方法  组件加载完成时调用
    componentDidMount() {
        const {params} = this.props.navigation.state;//获取参数  params.newsId
        this.fetchData(newsDetail+params.newsId);
    }
    //拉取网络数据
    fetchData(url) {
        //Promise链式调用
        fetch(url)
            .then((response) => response.json())
            .then((responseData) => {
                console.log("responseData->"+JSON.stringify(responseData.image));
                this.setState({//这里会触发一次重新渲染的流程  render函数被触发
                    content:responseData.body,
                    title:responseData.title,
                    image:responseData.image,
                    loaded: true,
                });
            });
    }
    //显示加载条
    renderLoadingView() {
        return (
            <View style={styles.container}>
                <Text>
                    正在加载数据……
                </Text>
            </View>
        );
    }
    //toast显示
    _showToast(content,duration) {
        ToastAndroid.show(content, duration);
    }

}
//导航栏
//const NewsDetailS = StackNavigator({
//    NewsDetail: { screen: NewsDetail },
//});
export default NewsDetail;

var styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:'#ffffff',
    },
    img:{
        width,
        height:200,
    },


    //box1:{
    //    width, height:50, backgroundColor:'#f00', position :'absolute', left:0, bottom:0
    //},
});