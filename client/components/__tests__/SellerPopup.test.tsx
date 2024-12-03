import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import SellerPopup from "../SellerPopup";
import { getToken } from "../../firebase";
import { getUserById } from "@/utils/interfaces/userInterface";

jest.mock("../../firebase", () => ({
  getToken: jest.fn(),
}));

jest.mock("@/utils/interfaces/userInterface", () => ({
  getUserById: jest.fn(),
}));

describe("SellerPopup", () => {
  const setModalVisible = jest.fn();
  const userId = "mock-user-id";
  const description = "This is a test description";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render correctly when modal is visible", async () => {
    (getToken as jest.Mock).mockResolvedValue("mock-token");
    (getUserById as jest.Mock).mockResolvedValue({
      name: "John Doe",
      email: "john.doe@example.com",
      phone_number: "123-456-7890",
    });

    const { getByText, queryByText } = render(
      <SellerPopup
        modalVisible={true}
        setModalVisible={setModalVisible}
        userId={userId}
        description={description}
      />
    );

    await waitFor(() => expect(getToken).toHaveBeenCalled());
    await waitFor(() =>
      expect(getUserById).toHaveBeenCalledWith("mock-token", userId)
    );

    expect(getByText("Seller Contact Information")).toBeTruthy();
    expect(getByText("Name: John Doe")).toBeTruthy();
    expect(getByText("Email: john.doe@example.com")).toBeTruthy();
    expect(getByText("Phone Number: 123-456-7890")).toBeTruthy();
    expect(getByText("Item Description")).toBeTruthy();
    expect(getByText(description)).toBeTruthy();
    expect(queryByText("Loading...")).toBeNull();
  });

  it("should show loading text while fetching user data", () => {
    (getToken as jest.Mock).mockResolvedValue("mock-token");
    (getUserById as jest.Mock).mockImplementation(() => new Promise(() => {}));

    const { getByText } = render(
      <SellerPopup
        modalVisible={true}
        setModalVisible={setModalVisible}
        userId={userId}
        description={description}
      />
    );

    expect(getByText("Loading...")).toBeTruthy();
  });

  it("should handle error when fetching user data fails", async () => {
    (getToken as jest.Mock).mockResolvedValue("mock-token");
    (getUserById as jest.Mock).mockRejectedValue(
      new Error("Failed to fetch user data")
    );

    // Mock console.error to suppress error output during the test
    const consoleErrorMock = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    const { getByText } = render(
      <SellerPopup
        modalVisible={true}
        setModalVisible={setModalVisible}
        userId={userId}
        description={description}
      />
    );

    await waitFor(() => expect(getToken).toHaveBeenCalled());
    await waitFor(() =>
      expect(getUserById).toHaveBeenCalledWith("mock-token", userId)
    );

    expect(getByText("Seller Contact Information")).toBeTruthy();
    expect(getByText("Loading...")).toBeTruthy();

    // Restore console.error after the test
    consoleErrorMock.mockRestore();
  });

  it("should close the modal when the close button is pressed", () => {
    const { getByText } = render(
      <SellerPopup
        modalVisible={true}
        setModalVisible={setModalVisible}
        userId={userId}
        description={description}
      />
    );

    fireEvent.press(getByText("Close"));

    expect(setModalVisible).toHaveBeenCalledWith(false);
  });

  it("should close the modal when the back button is pressed", () => {
    const { getByTestId } = render(
      <SellerPopup
        modalVisible={true}
        setModalVisible={setModalVisible}
        userId={userId}
        description={description}
      />
    );

    fireEvent(getByTestId("seller-popup-modal"), "onRequestClose");

    expect(setModalVisible).toHaveBeenCalledWith(false);
  });
});
