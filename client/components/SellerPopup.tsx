import { Modal, View, Text, Alert, Pressable, StyleSheet } from "react-native";
import { auth, getToken } from "../firebase";
import { getUserById } from "@/utils/interfaces/userInterface";
import { useEffect, useState } from "react";
import { UserType } from "@/utils/models/userModel";

interface PopupProps {
  modalVisible: boolean;
  setModalVisible: (value: boolean) => void;
  userId: string;
  description: string;
}

const SellerPopup: React.FC<PopupProps> = ({
  modalVisible,
  setModalVisible,
  userId,
  description,
}) => {
  const [userData, setUserData] = useState<UserType | null>(null);

  const getSellerInfo = async () => {
    const token = await getToken();
    const userData = await getUserById(token!, userId);
    setUserData(userData);
  };

  useEffect(() => {
    if (modalVisible) getSellerInfo();
  }, [modalVisible]);

  return (
    <Modal
      animationType="fade"
      visible={modalVisible}
      transparent={true}
      onRequestClose={() => {
        Alert.alert("Modal has been closed.");
        setModalVisible(!modalVisible);
      }}
    >
      <View style={styles.overlay}>
        <View style={styles.modalView}>
          <Text style={styles.title}>Seller Contact Information</Text>
          {userData ? (
            <>
              <Text style={styles.text}>
                <Text style={styles.label}>Name:</Text> {userData.name}
              </Text>
              <Text style={styles.text}>
                <Text style={styles.label}>Email:</Text> {userData.email}
              </Text>
              <Text style={styles.text}>
                <Text style={styles.label}>Phone Number:</Text>{" "}
                {userData.phone_number}
              </Text>
            </>
          ) : (
            <Text style={styles.text}>Loading...</Text>
          )}
          <Text style={styles.descriptionTitle}>Item Description</Text>
          <Text style={styles.description}>{description}</Text>
          <Pressable
            style={[styles.button, styles.buttonClose]}
            onPress={() => setModalVisible(!modalVisible)}
          >
            <Text style={styles.buttonText}>Close</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent gray background
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 25,
    width: "80%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  text: {
    fontSize: 14,
    color: "#333",
    marginBottom: 8,
    textAlign: "center",
  },
  label: {
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
  descriptionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 15,
    marginBottom: 5,
    textAlign: "center",
  },
  description: {
    fontSize: 14,
    color: "#555",
    marginBottom: 20,
    textAlign: "center",
  },
  button: {
    borderRadius: 5,
    padding: 10,
    backgroundColor: "#2196F3",
    width: "60%",
    alignItems: "center",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default SellerPopup;
