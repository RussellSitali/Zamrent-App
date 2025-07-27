
import {Text, View, SafeAreaView, KeyboardAvoidingView, TouchableOpacity, StyleSheet, TextInput} from "react-native";
import React, {useState, useEffect} from "react";

export default function HomeScreen(){
    const [location, setLocation] = useState('');
    const [price, setPrice] = useState(0);
    const [propertyType, setPropertyType] = useState('house');
    const [lat, setLat] = useState(null);
    const [lon, setLon] = useState(null);
    const [bedrooms, setBedrooms] = useState('');
    const [bedspaces, setBedspaces] = useState('');
    const [filter, setFilter] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(''); 

    const HandleSearch = ()=>{
            console.log("This is what was entered in the input field", location);
    }

    return(
        <KeyboardAvoidingView 
        style={styles.container}>
            <SafeAreaView style={{flex:1}}>
                <View style={styles.inner}>
                    <View style={styles.topsection}>
                        <Text style={styles.header}> Welcome to ZamRent 🏠</Text>
                        <Text style={{fontSize:18, textAlign:"center"}}>Easily find and list rental properties across Zambia</Text>
                    </View>
                    
                    <View style={styles.downsection}>
                        <TextInput style={styles.inputField} value={location} onChange={(e)=>setLocation(e.target.value)} placeholder="search location"/>
                        
                        <TouchableOpacity style={styles.button} onPress={HandleSearch}>
                            <Text style={styles.button_text}>Search</Text>
                        </TouchableOpacity>
                    </View>

                </View>
            </SafeAreaView>
        </KeyboardAvoidingView>
        
    );
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:"pink",
    },
    inner:{
        flex:1,
    },
    topsection:{
        flex:0.1,
        alignItems:"center",
        paddingTop:60,
        marginBottom:50,
    },
    downsection:{
        flex:1,
        justifyContent:"flex-start",
        alignItems:"center",
    },
    header:{
        fontSize:31,
        color:"blue",
        fontWeight:"bold",
    },
    inputField:{
        height:40,
        borderWidth:1,
        borderRadius:10,
        width:340,
        borderColor:"blue",
        color:"black",
    },
    button:{
        backgroundColor:"blue",
        marginTop:10,
        borderRadius:17,
        width:90,
        height:40,
        alignItems:"center",
        justifyContent:"center",
    },
    button_text:{
        color:"white",
        fontSize:26,
        fontWeight:"700",
    },
});