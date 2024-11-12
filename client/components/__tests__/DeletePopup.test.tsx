import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import { Alert } from "react-native";
import DeletePopup from "../DeletePopup";
import { getToken } from "../../firebase";
import { deletePost } from "@/utils/interfaces/postInterface";

jest.mock("../../firebase", () => ({
  getToken: jest.fn(),
}));

jest.mock("@/utils/interfaces/postInterface", () => ({
  deletePost: jest.fn(),
}));

jest.spyOn(Alert, "alert");

describe("DeletePopup", () => {
  const mockSetModalVisible = jest.fn();
  const defaultProps = {
    modalVisible: true,
    setModalVisible: mockSetModalVisible,
    postId: 123,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders correctly when visible", () => {
    const { getByText } = render(<DeletePopup {...defaultProps} />);

    expect(getByText("Do you want to change this post?")).toBeTruthy();
    expect(getByText("Edit Post")).toBeTruthy();
    expect(getByText("Delete Post")).toBeTruthy();
    expect(getByText("Exit")).toBeTruthy();
  });

  it("handles close button press", () => {
    const { getByText } = render(<DeletePopup {...defaultProps} />);

    fireEvent.press(getByText("Exit"));
    expect(mockSetModalVisible).toHaveBeenCalledWith(false);
  });

  it("handles delete button press", async () => {
    const mockToken = "mock-token";
    (getToken as jest.Mock).mockResolvedValue(mockToken);
    (deletePost as jest.Mock).mockResolvedValue(undefined);

    const { getByText } = render(<DeletePopup {...defaultProps} />);

    fireEvent.press(getByText("Delete Post"));

    await waitFor(() => {
      expect(getToken).toHaveBeenCalled();
      expect(deletePost).toHaveBeenCalledWith(mockToken, defaultProps.postId);
      expect(mockSetModalVisible).toHaveBeenCalledWith(false);
    });
  });

  it("handles modal close request", () => {
    const { getByTestId } = render(
      <DeletePopup {...defaultProps} testID="delete-popup-modal" />
    );

    fireEvent(getByTestId("delete-popup-modal"), "onRequestClose");

    expect(Alert.alert).toHaveBeenCalledWith("Modal has been closed.");
    expect(mockSetModalVisible).toHaveBeenCalled();
  });

  it("does not render when not visible", () => {
    const { queryByText } = render(
      <DeletePopup {...defaultProps} modalVisible={false} />
    );

    expect(queryByText("Do you want to change this post?")).toBeNull();
  });

  it("handles delete failure", async () => {
    const mockToken = "mock-token";
    const mockError = new Error("Delete failed");

    (getToken as jest.Mock).mockResolvedValue(mockToken);
    (deletePost as jest.Mock).mockRejectedValue(mockError);

    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    const { getByText } = render(<DeletePopup {...defaultProps} />);

    fireEvent.press(getByText("Delete Post"));

    await waitFor(() => {
      expect(getToken).toHaveBeenCalled();
      expect(deletePost).toHaveBeenCalledWith(mockToken, defaultProps.postId);
      expect(mockSetModalVisible).not.toHaveBeenCalled();
    });

    consoleErrorSpy.mockRestore();
  });
});
