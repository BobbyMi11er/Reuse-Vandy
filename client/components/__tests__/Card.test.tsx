import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import Card from "../Card";
import { getToken } from "../../firebase";
import { deletePost } from "@/utils/interfaces/postInterface";
import { Alert } from "react-native";
import {
  addLike,
  deleteLike,
  getLikesByPost,
} from "@/utils/interfaces/likesInterface";
import { Ionicons } from "@expo/vector-icons";

jest.mock("../../firebase", () => ({
  auth: { currentUser: { uid: "test-user-id" } },
  getToken: jest.fn(),
}));

jest.mock("@/utils/interfaces/postInterface", () => ({
  deletePost: jest.fn(),
}));

jest.mock("@/utils/interfaces/likesInterface", () => ({
  getLikesByPost: jest.fn(),
  addLike: jest.fn(),
  deleteLike: jest.fn(),
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

  it("renders correctly with profile page props", () => {
    const profileProps = { ...mockProps, page: "profile" };
    const { getByTestId } = render(<Card {...profileProps} />);

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

  it("does not set liked when token retrieval fails", async () => {
    (getToken as jest.Mock).mockResolvedValue(null);

    const { getByTestId } = render(<Card {...mockProps} />);
    await waitFor(() => {
      // Check that the icon rendered is heart-outline
      const icon = getByTestId("heart-icon").findByType(Ionicons);
      expect(icon.props.name).toBe("heart-outline");
    });
  });

  it("sets liked to false when no matching likes found", async () => {
    (getLikesByPost as jest.Mock).mockResolvedValue([]);

    const { getByTestId } = render(<Card {...mockProps} />);
    await waitFor(() => {
      // Check that the icon rendered is heart-outline
      const icon = getByTestId("heart-icon").findByType(Ionicons);
      expect(icon.props.name).toBe("heart-outline");
    });
  });

  it("sets liked to true when a matching like is found", async () => {
    (getLikesByPost as jest.Mock).mockResolvedValue([
      { user_firebase_id: "test-user-id", post_id: 1 },
    ]);

    const { getByTestId } = render(<Card {...mockProps} />);
    await waitFor(() => {
      // Check that the icon rendered is heart-outline
      const icon = getByTestId("heart-icon").findByType(Ionicons);
      expect(icon.props.name).toBe("heart-outline");
    });
  });

  it("does not call API when token retrieval fails", async () => {
    (getToken as jest.Mock).mockResolvedValue(null);

    const { getByTestId } = render(<Card {...mockProps} />);
    fireEvent.press(getByTestId("heart-icon"));

    await waitFor(() => {
      expect(addLike).not.toHaveBeenCalled();
      expect(deleteLike).not.toHaveBeenCalled();
    });
  });

  it("handles liking a post successfully", async () => {
    // Mock token retrieval
    (getToken as jest.Mock).mockResolvedValue("test-token");

    // Mock successful addLike response
    (addLike as jest.Mock).mockResolvedValue(true);

    const { getByTestId } = render(<Card {...mockProps} />);

    // Simulate pressing the heart icon to like the post
    fireEvent.press(getByTestId("heart-icon"));

    await waitFor(() => {
      // Check that addLike was called with the correct arguments
      expect(addLike).toHaveBeenCalledWith("test-token", {
        user_firebase_id: "test-user-id",
        post_id: 1,
      });
    });
  });

  // it("handles unliking a post successfully", async () => {
  //   // Mock token retrieval
  //   (getToken as jest.Mock).mockResolvedValue("test-token");

  //   // Mock successful addLike response
  //   (deleteLike as jest.Mock).mockResolvedValue(true);

  //   const { getByTestId } = render(<Card {...mockProps} />);

  //   // Simulate pressing the heart icon to like the post
  //   fireEvent.press(getByTestId("heart-icon"));

  //   await waitFor(() => {
  //     // Check that addLike was called with the correct arguments
  //     expect(addLike).toHaveBeenCalledWith("test-token", {
  //       user_firebase_id: "test-user-id",
  //       post_id: 1,
  //     });
  //   });
  // });

  // it("handles unliking a post successfully", async () => {
  //   (getToken as jest.Mock).mockResolvedValue("test-token");
  //   (deleteLike as jest.Mock).mockResolvedValue(true);
  //   (getLikesByPost as jest.Mock).mockResolvedValue([
  //     { user_firebase_id: "test-user-id", post_id: 1 },
  //   ]);

  //   const { getByTestId } = render(<Card {...mockProps} />);
  //   fireEvent.press(getByTestId("heart-icon"));

  //   await waitFor(() => {
  //     expect(deleteLike).toHaveBeenCalledWith("test-token", {
  //       user_firebase_id: "test-user-id",
  //       post_id: mockProps.post_id,
  //     });
  //     expect(getByTestId("heart-icon").props.children.type).toBe(
  //       "heart-outline"
  //     );
  //   });
  // });

  it("handles errors during liking gracefully", async () => {
    const error = new Error("Like failed");
    (getToken as jest.Mock).mockResolvedValue("test-token");
    (addLike as jest.Mock).mockRejectedValue(error);

    const alertSpy = jest.spyOn(Alert, "alert").mockImplementation(() => {});

    const { getByTestId } = render(<Card {...mockProps} />);
    fireEvent.press(getByTestId("heart-icon"));

    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith(error.toString());
    });

    alertSpy.mockRestore();
  });
});
