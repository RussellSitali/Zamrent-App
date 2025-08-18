
import React from "react";
import {View, Text, SafeAreaView, ScrollView} from "react-native";
import {useLocalSearchParams} from "expo-router" 

export default function Results(){
    const {results} = useLocalSearchParams();
    const finalData = JSON.parse(results);
    console.log("these are the data ", finalData);

    return(
        <SafeAreaView>
            <ScrollView>
                <View>
                    {finalData.length === 0? (
                        <Text>No results found</Text>
                    ):(
                        finalData.map((item,index)=>(
                            <View key={index}>
                                <Text>{item.title}</Text>
                                <Text>{item.price}</Text>
                            </View>
                        ))
                    )}
                    <Text> Look at this data received :{finalData} </Text>    
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}