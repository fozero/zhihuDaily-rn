/**
 * Created by chushikeji on 2017/6/23.
 */
'use strict';
import React, { Component } from 'react';
import {   ToastAndroid,Image,StyleSheet,ListView,View,Button,Text,
    TouchableHighlight,
    TouchableWithoutFeedback,
    Dimensions,
    Platform,
    ActivityIndicator,
    Alert,
    AppState} from 'react-native';
import {StackNavigator} from 'react-navigation';
import NewsDetail from './newsDetail';
import style from './styles/style'
import config from './common/config'
import HotUpdate from './common/hot_update';

//下拉刷新加载
import {PullView,PullList} from 'react-native-pull';
//轮播组件
import Swiper from 'react-native-swiper';

//热更新
import CodePush from 'react-native-code-push';


const { width } = Dimensions.get('window')
//const isIOS = Platform.OS == 'ios'


////codepush
//const CODE_PUSH_PRODUCTION_KEY = 'txjkLeMoOugpal6ngDLZ3JdvN9Vn2cb46f4f-85d6-4510-95b4-45bedfc0174e';
//const CODE_PUSH_STAGING_KEY = 'SUaVEfdeP7h5soN3jZ0MYiumcT8u2cb46f4f-85d6-4510-95b4-45bedfc0174e';

//最新日报
const  newsLatest = 'https://news-at.zhihu.com/api/4/news/latest';

//首页
class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            //创建ListView数据源
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2,
            }),
            loaded: false,//是否加载  初始为false
            topStories:'',
        };
        // 在ES6中，如果在自定义的函数里使用了this关键字，则需要对其进行“绑定”操作，否则this的指向不对
        // 像下面这行代码一样，在constructor中使用bind是其中一种做法（还有一些其他做法，如使用箭头函数等）
        this.fetchData = this.fetchData.bind(this);
    }
    //导航栏配置
    static navigationOptions = {//#4abdcc  red
        headerTitle: '最新日报',
        headerStyle:{ backgroundColor: '#4abdcc',elevation:0,borderBottomWidth:1,borderBottomColor:'#dadada'},//导航栏样式  elevation:0去掉安卓底部阴影  iOS下用shadowOpacity: 0
        headerTitleStyle:{ color: 'white',alignSelf:'center',fontSize:16},//导航条文本样式     alignSelf:'center'文字居中

        //headerRight: (
        //    <Button
        //        title={"获取版本信息"}
        //        onPress={this.getUpdateMetadata()}
        //    />
        //),
    };
    //生命周期方法  加载组件之前
    componentWillMount(){
        HotUpdate.listenToAppState();
    }
    //生命周期方法  组件加载完成时调用
    componentDidMount() {
        this.fetchData();
        HotUpdate.sync();
        //this.codePushUpgrade();
    }
    //生命周期方法  组件卸载时候
    componentWillUnmount(){
        HotUpdate.unlistenToAppState();
    }

    //获取版本相关信息
    getUpdateMetadata() {
        CodePush.getUpdateMetadata(CodePush.UpdateState.RUNNING)
            .then((metadata: LocalPackage) => {
                ToastAndroid.show("metadata->"+JSON.stringify(metadata), ToastAndroid.LONG);
                //this.setState({ syncMessage: metadata ? JSON.stringify(metadata) : "Running binary version", progress: false });
            }, (error: any) => {
                ToastAndroid.show("Error"+error, ToastAndroid.SHORT);
                //this.setState({ syncMessage: "Error: " + error, progress: false });
            });
    }


    ////热更新
    //codePushUpgrade(){
    //    //检查更新的信息
    //    CodePush.checkForUpdate(config.codepush.productionKey).then((update)=>{
    //        if(!update){
    //            Alert.alert("提示","已是最新版本--",[ {text:"Ok", onPress:()=>{ console.log("点了OK"); }} ]); }
    //        else{
    //            CodePush.sync({//下载更新
    //                deploymentKey:config.codepush.productionKey,
    //                updateDialog: {
    //                    optionalIgnoreButtonLabel: '稍后',
    //                    optionalInstallButtonLabel: '后台更新',
    //                    optionalUpdateMessage: '有新版本了，是否更新？', title: '更新提示'
    //                },
    //                installMode: CodePush.InstallMode.IMMEDIATE //1、IMMEDIATE 立即更新APP  2、ON_NEXT_RESTART 到下一次启动应用时 3、ON_NEXT_RESUME 当应用从后台返回时
    //            });
    //        }
    //    });
    //}

    //拉取网络数据
    fetchData(resolve) {
        //Promise链式调用
        fetch(newsLatest)
            .then((response) => response.json())
            .then((responseData) => {
                console.log("responseData->"+JSON.stringify(responseData));
                // 注意，这里使用了this关键字，为了保证this在调用时仍然指向当前组件，我们需要对其进行“绑定”操作
                this.setState({//这里会触发一次重新渲染的流程  render函数被触发
                    topStories:responseData.top_stories,
                    dataSource: this.state.dataSource.cloneWithRows(responseData.stories),
                    loaded: true,
                });
                if (resolve !== undefined){
                    setTimeout(() => {
                        resolve();  // 关闭动画
                    }, 1000);
                }

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

    //视图渲染
    render() {
        if (!this.state.loaded) {//数据加载完成前
            return this.renderLoadingView();
        }
        return (
            //<ListView
            //    dataSource={this.state.dataSource}
            //    renderRow={this._renderStories.bind(this)}
            //    renderHeader={this._renderHeader.bind(this)}//头部
            //    removeClippedSubviews={false}//解决listview和轮播冲突 轮播图不显示问题
            ///>

            <PullList
                dataSource={this.state.dataSource}
                renderRow={this._renderStories.bind(this)}
                renderHeader={this._renderHeader.bind(this)}//头部
                removeClippedSubviews={false}//解决listview和轮播冲突 轮播图不显示问题
                showsHorizontalScrollIndicator={false}
                initialListSize={5}
                onPullRelease={(resolve) => this.fetchData(resolve)}
                topIndicatorRender={this.topIndicatorRender.bind(this)}
                topIndicatorHeight={60}
            />
        );
    }


    //状态pulling,pullok,pullrelease
    topIndicatorRender(pulling,pullok,pullrelease){
        //return <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center', height: 60}}>
        //    <ActivityIndicator size="small" color="gray" />
        //    {pulling ? <Text>松开刷新...</Text> : null}
        //    {pullok ? <Text>玩命加载中...</Text> : null}
        //    {pullrelease ? <Text>刷新完成...</Text> : null}
        //</View>
        return <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center', height: 60}}>
            <ActivityIndicator size="small" color="gray" />
        </View>
    }

    //listview item
    _renderStories(stories) {
        console.log("stories->"+stories);
        return (
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

    //轮播图
    _renderHeader(){
        return (
            <View>
                <Button title={"获取版本信息"} onPress={this.getUpdateMetadata()}/>
                <Swiper style={styles.wrapper} height={240} horizontal={true} autoplay
                        dot={<View style={{backgroundColor: 'rgba(0,0,0,.2)', width: 5, height: 5, borderRadius: 4, marginLeft: 3, marginRight: 3, marginTop: 3, marginBottom: 3}} />}
                        activeDot={<View style={{backgroundColor: '#000', width: 8, height: 8, borderRadius: 4, marginLeft: 3, marginRight: 3, marginTop: 3, marginBottom: 0}} />}>
                    {this._renderImg(this.state.topStories)}
                </Swiper>
            </View>
        );


        //静态轮播图
        //return (
        //  <View>
        //      <Swiper style={styles.wrapper} height={200} horizontal={true} autoplay
        //              dot={<View style={{backgroundColor: 'rgba(0,0,0,.2)', width: 5, height: 5, borderRadius: 4, marginLeft: 3, marginRight: 3, marginTop: 3, marginBottom: 3}} />}
        //              activeDot={<View style={{backgroundColor: '#000', width: 8, height: 8, borderRadius: 4, marginLeft: 3, marginRight: 3, marginTop: 3, marginBottom: 0}} />}
        //      >
        //          <View style={styles.slide} title={<Text numberOfLines={1}>Aussie tourist dies at Bali hotel</Text>}>
        //              <Image resizeMode='stretch' style={styles.image} source={require('./images/banner1.jpg')} />
        //          </View>
        //          <View style={styles.slide} title={<Text numberOfLines={1}>Big lie behind Nine’s new show</Text>}>
        //              <Image resizeMode='stretch' style={styles.image} source={require('./images/banner2.jpg')} />
        //          </View>
        //          <View style={styles.slide} title={<Text numberOfLines={1}>Big lie behind Nine’s new show</Text>}>
        //              <Image resizeMode='stretch' style={styles.image} source={require('./images/banner21.jpg')} />
        //          </View>
        //      </Swiper>
        //  </View>
        //);
    }
    //轮播图
    _renderImg(topStories){
        console.log("topStories3->"+JSON.stringify(topStories));
        var imageViews = [];
        topStories.map((item,i) =>{
            imageViews.push(
                <TouchableWithoutFeedback  key={i} style={styles.slide} onPress={() => this.props.navigation.navigate('Profile', {newsId: item.id,name:item.title})}>
                    <Image resizeMode='stretch'
                           style={styles.image}
                           source={{uri:topStories[i].image}}
                    />
                </TouchableWithoutFeedback>
            )
        })
        return imageViews;
    }


    //toast显示
    _showToast(content,duration) {
        ToastAndroid.show(content, duration);
    }
}

//导航栏
const HomeS = StackNavigator({
    Home: { screen: Home },
    Profile:{
        screen:NewsDetail
    }
});

//视图样式
const styles = StyleSheet.create({
    //    轮播
    slide: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'transparent'
    },
    image: {
        width,
        flex: 1
    }
});




export default HomeS;