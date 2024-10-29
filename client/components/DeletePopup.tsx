import { Modal, View, Text, Alert, Pressable, StyleSheet, TouchableOpacity } from "react-native";

import { auth } from "../firebase";
import { getUserById } from "@/utils/interfaces/userInterface";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { UserType } from "@/utils/models/userModel";

interface PopupProps {
    modalVisible: boolean;
    setModalVisible: (value: boolean) => void; 
    userId: string;
}


const SellerPopup: React.FC<PopupProps> = ({
    modalVisible, setModalVisible, userId
}) => {

    const [userData, setUserData] = useState<UserType | null>(null);

    const getSellerInfo = async () => {
        const token = await AsyncStorage.getItem("token");
        const userData = await getUserById(token!, userId)
        setUserData(userData)
    }

    useEffect(() => {
        if (modalVisible)
            getSellerInfo()
    }, [modalVisible])

    return (
        <Modal
            animationType="fade"
            visible={modalVisible}
            transparent={true}
            onRequestClose={() => {
                Alert.alert('Modal has been closed.');
                setModalVisible(!modalVisible);
              }}>
                <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <View>
                <Text style={styles.title}>
                        Do you want to change this post?
                </Text>
                <Pressable style={[styles.button, styles.edit_button]}>
                    <Text>Edit Post</Text>
                </Pressable>
                <Pressable style={[styles.button, styles.delete_button]}>
                    <Text>Delete Post</Text>
                </Pressable>
              </View>
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => setModalVisible(!modalVisible)}>
                <Text style={styles.textStyle}>Hide Modal</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    centeredView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalView: {
      backgroundColor: 'white',
      borderRadius: 20,
      padding: 20,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
      
    },
    button: {
      borderRadius: 20,
      padding: 10,
      elevation: 2,
      marginTop: 10
    },
    delete_button: {
        backgroundColor:"red"
    },
    edit_button: {
        backgroundColor:"yellow",
    },
    buttonClose: {
      backgroundColor: '#2196F3',
    },
    textStyle: {
      color: 'white',
      fontWeight: 'bold',
      textAlign: 'center',
    },
    modalText: {
      marginBottom: 15,
      textAlign: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 10,
        
      },
    text: {
        fontSize: 14
    },
    underline: {
        textDecorationLine: 'underline',
    }
  });

export default SellerPopup;