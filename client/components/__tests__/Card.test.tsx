// components/__tests__/Card.test.tsx
import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import Card from "../Card";
import { getToken } from "../../firebase";
import { deletePost } from "@/utils/interfaces/postInterface";
import { Alert } from "react-native";

jest.mock("../../firebase", () => ({
  getToken: jest.fn(),
}));

jest.mock("@/utils/interfaces/postInterface", () => ({
  deletePost: jest.fn(),
}));

jest.mock("@expo/vector-icons", () => ({
  Ionicons: "Ionicons",
}));

jest.mock("../SellerPopup", () => "SellerPopup");
jest.mock("../DeletePopup", () => "DeletePopup");

describe("Card", () => {
  const mockProps = {
    post_id: 1,
    title: "Test Item",
    price: 99.99,
    size: "M",
    image_url: "https://reuse-vandy.test.com/image.jpg",
    description: "Test description",
    created_at: new Date("2024-03-15"),
    user_firebase_id: "test-user-id",
    page: "marketplace",
    onDelete: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  //   it("renders correctly with marketplace props", () => {
  //     const { getByText, getByTestId, queryByTestId } = render(
  //       <Card {...mockProps} />
  //     );

  //     expect(getByText("Test Item")).toBeTruthy();
  //     expect(getByText("$99.99")).toBeTruthy();
  //     expect(getByText("March 15, 2024")).toBeTruthy();
  //     // Delete icon should not be visible in marketplace
  //     expect(queryByTestId("delete-icon")).toBeNull();
  //   });

  it("renders correctly with profile page props", () => {
    const profileProps = { ...mockProps, page: "profile" };
    const { getByTestId } = render(<Card {...profileProps} />);

    // Delete icon should be visible in profile
    expect(getByTestId("delete-icon")).toBeTruthy();
  });

  it("uses default image when image_url is invalid", () => {
    const invalidImageProps = { ...mockProps, image_url: "invalid-url" };
    const { getByTestId } = render(<Card {...invalidImageProps} />);

    const image = getByTestId("card-image");
    expect(image.props.source.uri).toBe(
      "https://reuse-vandy.s3.us-east-2.amazonaws.com/adaptive-icon.png"
    );
  });

  it("opens seller popup when clicked in marketplace mode", () => {
    const { getByTestId } = render(<Card {...mockProps} />);

    fireEvent.press(getByTestId("card-touchable"));
    expect(getByTestId("seller-popup")).toBeTruthy();
  });

  it("opens delete popup when clicked in profile mode", () => {
    const profileProps = { ...mockProps, page: "profile" };
    const { getByTestId } = render(<Card {...profileProps} />);

    fireEvent.press(getByTestId("card-touchable"));
    expect(getByTestId("delete-popup")).toBeTruthy();
  });

  it("handles delete action correctly", async () => {
    const token = "test-token";
    (getToken as jest.Mock).mockResolvedValue(token);
    (deletePost as jest.Mock).mockResolvedValue(true);

    const profileProps = { ...mockProps, page: "profile" };
    const { getByTestId } = render(<Card {...profileProps} />);

    fireEvent.press(getByTestId("delete-icon"));

    await waitFor(() => {
      expect(deletePost).toHaveBeenCalledWith(token, mockProps.post_id);
      expect(mockProps.onDelete).toHaveBeenCalledWith(mockProps.post_id);
    });
  });

  it("handles delete error correctly", async () => {
    const error = new Error("Delete failed");
    (getToken as jest.Mock).mockResolvedValue("test-token");
    (deletePost as jest.Mock).mockRejectedValue(error);

    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});
    const alertSpy = jest.spyOn(Alert, "alert").mockImplementation(() => {});

    const profileProps = { ...mockProps, page: "profile" };
    const { getByTestId } = render(<Card {...profileProps} />);

    fireEvent.press(getByTestId("delete-icon"));

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith("Error deleting post:", error);
      expect(alertSpy).toHaveBeenCalledWith(
        "Failed to delete post. Please try again."
      );
    });

    consoleSpy.mockRestore();
    alertSpy.mockRestore();
  });
});
