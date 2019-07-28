/**
 * Created by chushikeji on 2017/7/12.
 */
'use strict';
import React, { Component } from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableHighlight,
    Dimensions} from 'react-native';
import style from '../styles/style'
//    主题内容list （暂不使用）
class themeContents extends React.Component {
    render() {
        return (
            <TouchableHighlight
                onPress={() => this.props.navigation.navigate('Profile', {newsId: stories.id,name:stories.title})}>
                <View style={[styles.themesContent_item,style.flex,style.flex_container]}>
                    <Image
                        source={{uri: stories.images[0]}}
                        style={[styles.themesContent_img]}
                    />
                    <View style={[style.flex_item]}>
                        <Text style={styles.themesContent_title}>{stories.title}</Text>
                    </View>
                </View>
            </TouchableHighlight>
        );
    }
}

export default themeContents;
var styles = StyleSheet.create({
    themesContent_item:{
        backgroundColor:'#ffffff',
        borderBottomWidth:1,
        borderBottomColor:'#dadada',
        padding:20
    },
    themesContent_img:{
        width:98,
        height:98
    },
    themesContent_title:{
        paddingLeft:10,
        fontSize: 18
    },
});
