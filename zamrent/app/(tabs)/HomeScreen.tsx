
import {Text, View, SafeAreaView, KeyboardAvoidingView, TouchableOpacity, StyleSheet, TextInput} from "react-native";
import React, {useState, useEffect} from "react";
import {Provider as PaperProvider, Menu, Button} from "react-native-paper"
import RadioButtons from "../../components/RadioButtons"
import FilterModal from "@/components/FilterModal";
import * as Location from "expo-location";
import {useRouter} from "expo-router"

export default function HomeScreen(){
    const [location, setLocation] = useState('');
    const [price, setPrice] = useState(0);
    const [property_type, setProperty_type] = useState('house');
    const [lat, setLat] = useState(null);
    const [lon, setLon] = useState(null);
    const [bedrooms, setBedrooms] = useState('');
    const [bedspaces, setBedspaces] = useState('');
    const [filter, setFilter] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(''); 
    const [filterVisible, setFilterVisible] = useState(false);

    const baseURL = process.env.EXPO_PUBLIC_API_URL;
    const router = useRouter();

    useEffect(() => {
        if (filter === "near-me") {
            (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setError('Permission to access location was denied');
                return;
            }

            let locationData = await Location.getCurrentPositionAsync({});
            const { latitude, longitude, accuracy } = locationData.coords;

            setLat(latitude);
            setLon(longitude);

            console.log("These are the coords: ",latitude, longitude);

            const label =
                property_type === "boardinghouse"
                ? "Boarding houses near me"
                : "Houses near me";

            setLocation(label);

            if (accuracy > 100) {
                alert("Note: Your location accuracy is low. Consider enabling high accuracy mode.");
                }
                    })();
                }
        }, [filter, property_type]);

        const HandleSearch = () => {
            if (!location && filter !== "near-me") {
            alert("Please enter a location or select 'Near Me'");
            return;
            }

            setLoading(true);
            setError("");
            setLocation('');

            const queryObject = {
                lat,
                lon,
                location,
                property_type:property_type,
                ...(filter === "near-me"?{use_coordinate:true}:{}),
                ...(property_type === "house"?{bedrooms,price}:{}),
                ...(property_type === "boardinghouse"?{bedspaces,price}:{})
            };

            const queryParams = Object.entries(queryObject)
            .filter(([key, value])=> value !== null && value !=="" && value !== undefined)
            .map(([key, value])=> `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
            .join("&")

            console.log("These are the params",queryParams);

            fetch(`${baseURL}/api/searchproperty?${queryParams}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },            
            })
            .then((res) => res.json())
            .then((data) => {
                console.log("Search results:", data);
                router.push({
                    pathname:"/screens/ResultsScreen",
                    params:{
                        results:JSON.stringify(data),
                    }
                });
            })
            .catch((err) => {
                console.error("Search failed:", err);
                setError("Search failed. Please try again.");
            })
            .finally(() => {
                setLoading(false);
            });
        };


    return(
        <KeyboardAvoidingView 
        style={styles.container}>
            <FilterModal
                visible={filterVisible}
                onClose={() => setFilterVisible(false)}
                price={price}
                setPrice={setPrice}
                bedrooms={bedrooms}
                setBedrooms={setBedrooms}
                bedspaces={bedspaces}
                setBedspaces={setBedspaces}
                property_type={property_type}
            />

            <SafeAreaView style={{flex:1}}>
                <View style={styles.inner}>
                    <View style={styles.topsection}>
                        <Text style={styles.header}> Welcome to ZamRent 🏠</Text>
                        <Text style={{fontSize:18, textAlign:"center"}}>Easily find and list rental properties across Zambia</Text>
                    </View>
                    
                    <View style={styles.downsection}>
                        <TextInput style={styles.inputField} value={location} onChangeText={setLocation} placeholder="search location"/>
                        
                        <TouchableOpacity style={styles.button} onPress={() => setFilterVisible(true)}>
                            <Text style={styles.button_text}>Filters</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.button} onPress={HandleSearch}>
                            <Text style={styles.button_text}>Search</Text>
                        </TouchableOpacity>

                        
                        <View style={styles.dropdownContainer}>
                        <Button
                            mode="outlined"
                            onPress={() => setFilter("near-me")}
                            style={{ marginBottom: 10 }}>
                            Near Me
                        </Button>

                        <Button
                            mode="outlined"
                            onPress={() => setFilter("")}>
                            Reset Filter
                        </Button>
                        </View>

                        <PaperProvider>
                            <RadioButtons
                            propertyType={propertyType}
                            setPropertyType={setPropertyType}/>
                        </PaperProvider>
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
    dropdownContainer:{
        
    },
});