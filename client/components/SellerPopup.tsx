import { Modal, View, Text, Alert, Pressable, StyleSheet } from "react-native";

import { auth, getToken } from "../firebase";
import { getUserById } from "@/utils/interfaces/userInterface";
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
        const token = await getToken();
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
                        Seller Contact Information
                </Text>
                <Text style={styles.text}>
                        <Text style={styles.underline}>Name:</Text> {userData ? userData.name : ""}
                </Text>
                <Text style={styles.text}>
                    <Text style={styles.underline}>Email:</Text> {userData ? userData.email : ""}
                </Text>
                <Text style={styles.text}>
                    <Text style={styles.underline}>Phone Number:</Text> {userData ? userData.phone_number : ""}
                </Text>
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
    buttonOpen: {
      backgroundColor: '#F194FF',
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