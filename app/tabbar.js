/**
 * Created by chushikeji on 2017/6/23.
 */
'use strict';
import React, { Component } from 'react';
import {StackNavigator, TabNavigator} from "react-navigation";
import {   StyleSheet,View,Button,Text,Image} from 'react-native';
import About from './tabbarabout';
import Home from './tabbarhome';

//react-navigation 使用TabNavigator实现tabbar
const MainScreenNavigator = TabNavigator({
    Home: {
        screen: Home,
        navigationOptions: {
            tabBarLabel : '日报',
            tabBarIcon : ({tintColor,focused}) => (
                focused?
                <Image
                    source={require('./images/index_pressed.png')}
                    style={styles.icon}
                />
                :
                <Image
                    source={require('./images/index_normal.png')}
                    style={styles.icon}
                />
            ),
        }
    },
    About: {
        screen: About,
        navigationOptions: {
            tabBarLabel: '专栏',
            tabBarIcon: ({tintColor,focused}) => (
                focused?
                    <Image
                        source={require('./images/section_pressed.png')}
                        style={styles.icon}
                    />
                    :
                    <Image
                        source={require('./images/section_normal.png')}
                        style={styles.icon}
                    />
            ),
        }
    },
}, {
    animationEnabled: false, // 切换页面时不显示动画
    tabBarPosition: 'bottom', // 显示在底端，android 默认是显示在页面顶端的
    swipeEnabled: false, // 禁止左右滑动
    backBehavior: 'none', // 按 back 键是否跳转到第一个 Tab， none 为不跳转
    tabBarOptions: {
        activeTintColor: '#4abdcc', // 文字和图片选中颜色
        inactiveTintColor: '#999', // 文字和图片默认颜色
        showIcon: true, // android 默认不显示 icon, 需要设置为 true 才会显示
        indicatorStyle: {height: 0}, // android 中TabBar下面会显示一条线，高度设为 0 后就不显示线了， 不知道还有没有其它方法隐藏？？？
        style: {
            backgroundColor: '#fff', // TabBar 背景色
            height:50,//高度
            borderTopWidth:1,
            borderTopColor:'#dadada'
        },
        labelStyle: {
            fontSize: 12, // 文字大小
            marginTop:0,//文字与图片的间距
        }
    },
});

const styles = StyleSheet.create({
    icon: {
        height: 22,
        width: 22,
        resizeMode: 'contain'
    }
});


export default MainScreenNavigator ;
