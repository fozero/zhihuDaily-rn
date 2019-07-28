/**
 * Created by chushikeji on 2017/6/23.
 */
'use strict';
import React, { Component } from 'react';
import {   View,Button,Text,
    Image,
    ScrollView,
    StyleSheet,
    TouchableHighlight,
    TouchableWithoutFeedback,
    ListView,
    Dimensions,
    ActivityIndicator} from 'react-native';
import {StackNavigator} from 'react-navigation';
//下拉刷新加载
import {PullView,PullList} from 'react-native-pull';
import ScrollableTabView,{DefaultTabBar,ScrollableTabBar}  from 'react-native-scrollable-tab-view';
import NewsDetail from './newsDetail';
import style from './styles/style'
const { width } = Dimensions.get('window')
//专栏
const  zhuanlanUrl = 'https://news-at.zhihu.com/api/4/themes';
//专栏内容列表
const  themeCListUrl = 'https://news-at.zhihu.com/api/4/theme/';

class About extends React.Component {
    constructor(props) {//构造方法
        super(props);
        this.state = {
            themes:'',//主题列表
            //创建ListView数据源  主题内容
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2,
            }),
            description:'',//描述
            image:'',//图片
            editors:'',//编辑
            loaded: false,//是否加载  初始为false
        };
    }
    static navigationOptions = {
        headerTitle: '主题专栏',
        headerStyle:{ backgroundColor: '#4abdcc',elevation:0,borderBottomWidth:1,borderBottomColor:'#dadada'},//导航栏样式  elevation:0去掉安卓底部阴影  iOS下用shadowOpacity: 0
        headerTitleStyle:{ color: 'white',alignSelf:'center',fontSize:16},//导航条文本样式     alignSelf:'center'文字居中
    };
    //生命周期方法  组件加载完成时调用
    componentDidMount() {
        this.fetchData();
    }
    //数据获取
    fetchData(){
        //Promise链式调用
        fetch(zhuanlanUrl)
            .then((response) => response.json())
            .then((responseData) => {
                console.log("responseData->"+JSON.stringify(responseData));
                this.setState({//这里会触发一次重新渲染的流程  render函数被触发
                    themes:responseData.others
                });
                this._loadThemeContent(responseData.others[0].id);
            });
    }
    //加载主题内容
    _loadThemeContent(themeId){
        fetch(themeCListUrl+themeId)
            .then((response) => response.json())
            .then((responseData) => {
                console.log("responseData.stories->"+JSON.stringify(responseData.stories));
                this.setState({//这里会触发一次重新渲染的流程  render函数被触发
                    description:responseData.description,
                    image:responseData.image,
                    editors:responseData.editors,
                    dataSource: this.state.dataSource.cloneWithRows(responseData.stories),
                });
            });
    }
    render() {
        return (
            //ScrollableTabBar：Tab可以超过屏幕范围，滚动可以显示
            <ScrollableTabView
                style={styles.themes_container}
                tabBarPosition='top'//tabBarPosition默认top  位于屏幕顶部   bottom位于屏幕底部  overlayTop悬浮在顶部
                initialPage={0} //初始化时被选中的Tab下标，默认是0
                locked={false}//表示手指是否能拖动视图  默认false  true则不能拖动,只可点击
                renderTabBar={() => <ScrollableTabBar />}
                tabBarUnderlineStyle={{backgroundColor: 'transparent'}}//设置DefaultTabBar和ScrollableTabBarTab选中时下方横线的颜色
                tabBarBackgroundColor='#FFFFFF'//设置整个Tab这一栏的背景颜色
                tabBarActiveTextColor='#4abdcc'//设置选中Tab的文字颜色
                tabBarInactiveTextColor='#333'//设置未选中Tab的文字颜色
                tabBarTextStyle={{fontSize: 16}}//设置Tab文字的样式
                onChangeTab={(obj) => {//Tab切换之后会触发此方法
                  console.log('index:' + obj.i);
                  this._loadThemeContent(this.state.themes[obj.i].id);
                }}
                onScroll={(postion) => {  //视图正在滑动的时候触发此方法
                  // float类型 [0, tab数量-1]
                  console.log('scroll position:' + postion);
                  //  var _position = parseInt(postion);
                  //this._loadThemeContent(this.state.themes[_position].id);
                }}
            >
                {this._renderThemes(this.state.themes)}
            </ScrollableTabView>
        );
    }
    //主题列表
    _renderThemes(themes) {
        let _themes = [];
        console.log("themes->"+JSON.stringify(themes));
        for(let i = 0;i<themes.length;i++){
            _themes.push(
                <View key={i} tabLabel={themes[i].name}>
                    <ListView
                        dataSource={this.state.dataSource}
                        renderRow={this._renderStories.bind(this)}
                        renderHeader={this.renderThemePic.bind(this)}//头部
                    />
                </View>
            )
        }
        return _themes;
    }
    //渲染主题图片
    renderThemePic(){
        console.log("this.state.image->"+this.state.image);
        //没有图片，设置默认图片
        if(this.state.image == ''){
            this.state.image = 'http://facebook.github.io/react/img/logo_og.png'
        }
        return(
            <View>
                <View style={styles.themePic}>
                    <Image
                        source={{uri: this.state.image}}
                        style={styles.themePic_img}
                    />
                    <Text style={styles.themePic_title}>{this.state.description}</Text>
                </View>
                <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} contentContainerStyle={styles.editors}>
                    {this._renderEditor(this.state.editors)}
                </ScrollView>
            </View>
        )
    }
    //编辑头像渲染
    _renderEditor(editors){
        console.log("editors->"+JSON.stringify(editors));
        var _editors = [];
        for(var i =0;i<editors.length;i++){
            _editors.push(
                //onPress={this._loadThemeContent(themes[i].id)}
                //<View  style={styles.nav}><Text>{editors[i].name}</Text></View>
                <TouchableWithoutFeedback  key={i} >
                    <Image
                        source={{uri: editors[i].avatar}}
                        style={styles.editors_avatar}
                    />
                </TouchableWithoutFeedback>
            );
        }
        return _editors;
    }
    //listview item
    _renderStories(stories) {
        console.log("stories->"+stories.length);
        //检查是否存在images属性 没有则添加并设置默认图片
        if(stories.images == undefined){
            stories.images = [];
            stories.images[0] =  'http://facebook.github.io/react/img/logo_og.png';
        }
        return (
            //listview item点击跳转到详情页
            <TouchableHighlight onPress={() => this.props.navigation.navigate('Profile', {newsId: stories.id,name:stories.title})}>
                <View style={[style.themesContent_item,style.flex,style.flex_container]}>
                    <Image
                        source={{uri: stories.images[0]}}
                        defaultSource={require('./images/banner1.jpg')}
                        style={[style.themesContent_img]}
                    />
                    <View style={[style.flex_item]}>
                        <Text style={style.themesContent_title}>{stories.title}</Text>
                    </View>
                </View>
            </TouchableHighlight>
        );
    }
}
//导航栏
const AboutS = StackNavigator({
    About: { screen: About },
    Profile:{
        screen:NewsDetail
    }
});

var styles = StyleSheet.create({
    themes_container: {
        backgroundColor:'#ffffff',
        height:88
    },
    themePic:{
        position:'relative'
    },
    themePic_img:{
        width,//自适应
        height:158
    },
    themePic_title:{
        position:'absolute',
        bottom:10,
        left:20,
        color:'#ffffff',
        fontSize:18
    },
    editors:{
        width,
        backgroundColor:'#dadada'
    },
    editors_avatar:{
        width:32,
        height:32,
        borderRadius:100,
        marginVertical:10, //上下间距
        marginHorizontal:5,//水平间距
    },

    //themesContent_item:{
    //    backgroundColor:'#ffffff',
    //    borderBottomWidth:1,
    //    borderBottomColor:'#dadada',
    //    padding:20
    //},
    //themesContent_img:{
    //    width:98,
    //    height:98
    //},
    //themesContent_title:{
    //    paddingLeft:10,
    //    fontSize: 18
    //},



    //公共样式 flexbox
    //flex:{
    //    flexDirection:'row'
    //},
    //flex_item:{
    //    flex:1
    //},
    //flex_container:{
    //    justifyContent: 'center',
    //    alignItems: 'center',
    //},
});

export default AboutS;