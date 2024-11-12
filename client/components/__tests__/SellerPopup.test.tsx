import React from "react";
import { render, fireEvent, waitFor, act } from "@testing-library/react-native";
import { Alert } from "react-native";
import SellerPopup from "../SellerPopup";
import { getToken } from "../../firebase";
import { getUserById } from "@/utils/interfaces/userInterface";

jest.mock("../../firebase", () => ({
  getToken: jest.fn(),
  auth: {},
}));

jest.mock("@/utils/interfaces/userInterface", () => ({
  getUserById: jest.fn(),
}));

jest.spyOn(Alert, "alert");

describe("SellerPopup", () => {
  const mockSetModalVisible = jest.fn();
  const mockUserData = {
    name: "John Doe",
    email: "john@example.com",
    phone_number: "123-456-7890",
  };

  const defaultProps = {
    modalVisible: true,
    setModalVisible: mockSetModalVisible,
    userId: "user123",
    description: "Test item description",
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (getToken as jest.Mock).mockResolvedValue("mock-token");
    (getUserById as jest.Mock).mockResolvedValue(mockUserData);
  });

  it("renders loading state initially", () => {
    const { getByText } = render(<SellerPopup {...defaultProps} />);
    expect(getByText("Loading...")).toBeTruthy();
  });

  it("displays the item description", async () => {
    const { getByText } = render(<SellerPopup {...defaultProps} />);

    expect(getByText("Item Description")).toBeTruthy();
    expect(getByText(defaultProps.description)).toBeTruthy();
  });

  it("handles close button press", () => {
    const { getByText } = render(<SellerPopup {...defaultProps} />);

    fireEvent.press(getByText("Close"));
    expect(mockSetModalVisible).toHaveBeenCalledWith(false);
  });

  it("handles modal request close", () => {
    const { getByTestId } = render(
      <SellerPopup {...defaultProps} testID="seller-popup-modal" />
    );

    fireEvent(getByTestId("seller-popup-modal"), "onRequestClose");

    expect(Alert.alert).toHaveBeenCalledWith("Modal has been closed.");
    expect(mockSetModalVisible).toHaveBeenCalled();
  });

  it("does not fetch user data when modal is not visible", () => {
    render(<SellerPopup {...defaultProps} modalVisible={false} />);

    expect(getToken).not.toHaveBeenCalled();
    expect(getUserById).not.toHaveBeenCalled();
  });

  it("handles error in fetching user data", async () => {
    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});
    (getUserById as jest.Mock).mockRejectedValue(
      new Error("Failed to fetch user")
    );

    const { getByText } = render(<SellerPopup {...defaultProps} />);

    expect(getByText("Loading...")).toBeTruthy();

    await act(async () => {
      await waitFor(() => {
        expect(getToken).toHaveBeenCalled();
        expect(getUserById).toHaveBeenCalled();
      });
    });

    expect(getByText("Loading...")).toBeTruthy();

    consoleErrorSpy.mockRestore();
  });
});
