
import React, {useState} from "react";
import {Button, Provider, Text, Menu} from "react-native-paper";
import {View, StyleSheet} from "react-native";

export default function MyMenu(){
    const [visible, setVisible] = useState(false);
    const [selecteOption, setSelectedOption] = useState(null);

    const openMenu = ()=> setVisible(true);
    const closeMenu = ()=> setVisible(false);

    const handleSelect = (option)=>{
        setSelectedOption(option);
        closeMenu();
    }

    return(
        <Provider>
            <View>
                <Menu 
                visible={visible}
                onDismiss={closeMenu}
                anchor={
                    <Button mode="outlined" onPress={openMenu}>
                        Filter
                    </Button>
                }>
                    <Menu.Item onPress={()=>handleSelect('option1')} title="option1"/>
                    <Menu.Item onPress={()=>handleSelect('option2')} title="option2"/>
                </Menu>
            </View>
        </Provider>
    );
}