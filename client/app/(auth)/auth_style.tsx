import { StyleSheet } from "react-native";

export const authStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "rgba(255, 255, 255, 0)",
      },
      scrollContent: {
        flexGrow: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F8F8F8",
        paddingVertical: 70,
      },
      content: {
        width: "80%",
        flex: 1,
        justifyContent: "space-between"
      },
      title: {
        fontSize: 30,
        fontWeight: "bold",
        color: "#000",
        marginBottom: 10,
      },
      subtitle: {
        fontSize: 16,
        color: "#666",
        marginBottom: 20,
      },
      inputContainer: {
        width: "100%",
        marginBottom: 15,
      },
      label: {
        fontSize: 14,
        color: "#666",
        marginBottom: 5,
      },
      input: {
        width: "100%",
        padding: 10,
        backgroundColor: "#EDEDED",
        borderRadius: 5,
        color: "#000",
      },
      button: {
        marginTop: 20,
        backgroundColor: "#F4A71D",
        paddingVertical: 15,
        width: "100%",
        alignItems: "center",
        borderRadius: 5,
      },
      buttonText: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#000",
      },
      bottomSection: {
        justifyContent: "flex-end",
        marginBottom: 30,
        alignItems: "center"
      },
      topSection: {
        marginTop: 50,
        alignItems: "center"
      },
      errorText: {
        color: "red",
        fontSize: 14,
        marginTop: 5,
      }
    });