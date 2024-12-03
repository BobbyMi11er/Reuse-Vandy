import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import EditPostsModal from "../editPosts";
import { fetchPostById, updatePost } from "@/utils/interfaces/postInterface";
import { Alert } from "react-native";

jest.mock("../../firebase", () => ({
  auth: {
    currentUser: {
      getIdToken: jest.fn().mockResolvedValue("mock-token"),
      uid: "mock-uid",
    },
  },
}));

jest.mock("@/utils/interfaces/postInterface", () => ({
  fetchPostById: jest.fn(),
  updatePost: jest.fn(),
}));

jest.spyOn(global.console, "error").mockImplementation(() => {});
jest.spyOn(Alert, "alert").mockImplementation(jest.fn());

describe("EditPostsModal", () => {
  const setModalVisible = jest.fn();
  const postId = 1;

  const mockPost = {
    post_id: 1,
    title: "Test Post",
    description: "Test Description",
    color: "Red",
    price: 100,
    size: "M",
    updated_at: new Date(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (fetchPostById as jest.Mock).mockResolvedValue(mockPost);
  });

  it("should render correctly when modal is visible", async () => {
    const { getByText, getByPlaceholderText } = render(
      <EditPostsModal
        modalVisible={true}
        setModalVisible={setModalVisible}
        postId={postId}
      />
    );

    await waitFor(() =>
      expect(fetchPostById).toHaveBeenCalledWith("mock-token", postId)
    );

    expect(getByText("Editing Listing")).toBeTruthy();
    expect(getByPlaceholderText("Listing Item").props.value).toBe(
      mockPost.title
    );
    expect(getByPlaceholderText("Enter item description").props.value).toBe(
      mockPost.description
    );
    expect(getByPlaceholderText("Enter item color").props.value).toBe(
      mockPost.color
    );
    expect(getByPlaceholderText("$1").props.value).toBe(
      mockPost.price.toString()
    );
    expect(getByPlaceholderText("Enter item size").props.value).toBe(
      mockPost.size
    );
  });

  it("should call updatePost and close modal on submit button press", async () => {
    const { getByText, getByPlaceholderText } = render(
      <EditPostsModal
        modalVisible={true}
        setModalVisible={setModalVisible}
        postId={postId}
      />
    );

    await waitFor(() =>
      expect(fetchPostById).toHaveBeenCalledWith("mock-token", postId)
    );

    fireEvent.changeText(getByPlaceholderText("Listing Item"), "Updated Title");
    fireEvent.changeText(getByPlaceholderText("$1"), "200");

    fireEvent.press(getByText("Edit Listing"));

    await waitFor(() =>
      expect(updatePost).toHaveBeenCalledWith("mock-token", postId, {
        ...mockPost,
        title: "Updated Title",
        price: 200,
        updated_at: expect.any(Date),
      })
    );

    expect(setModalVisible).toHaveBeenCalledWith(false);
    expect(Alert.alert).toHaveBeenCalledWith("Post updated");
  });

  it("should call setModalVisible with false on exit button press", () => {
    const { getByText } = render(
      <EditPostsModal
        modalVisible={true}
        setModalVisible={setModalVisible}
        postId={postId}
      />
    );

    fireEvent.press(getByText("Exit"));

    expect(setModalVisible).toHaveBeenCalledWith(false);
  });
});
