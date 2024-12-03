import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import DeletePopup from "../DeletePopup";
import { deletePost } from "@/utils/interfaces/postInterface";
import { Alert } from "react-native";

jest.mock("@/utils/interfaces/postInterface", () => ({
  deletePost: jest.fn(),
}));

jest.mock("../../firebase", () => ({
  auth: {
    currentUser: {
      getIdToken: jest.fn().mockResolvedValue("mock-token"),
    },
  },
  getToken: jest.fn().mockResolvedValue("mock-token"),
}));

jest.spyOn(Alert, "alert").mockImplementation(jest.fn());

describe("DeletePopup", () => {
  const setModalVisible = jest.fn();
  const postId = 1;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render correctly when modal is visible", () => {
    const { getByTestId } = render(
      <DeletePopup
        modalVisible={true}
        setModalVisible={setModalVisible}
        postId={postId}
      />
    );

    expect(getByTestId("delete-popup-modal")).toBeTruthy();
  });

  it("should call deletePost and close modal on delete button press", async () => {
    const { getByText } = render(
      <DeletePopup
        modalVisible={true}
        setModalVisible={setModalVisible}
        postId={postId}
      />
    );

    fireEvent.press(getByText("Delete Post"));

    await waitFor(() =>
      expect(deletePost).toHaveBeenCalledWith("mock-token", postId)
    );
    expect(setModalVisible).toHaveBeenCalledWith(false);
    expect(Alert.alert).toHaveBeenCalledWith("Post Deleted");
  });

  it("should call setModalVisible with false on exit button press", () => {
    const { getByText } = render(
      <DeletePopup
        modalVisible={true}
        setModalVisible={setModalVisible}
        postId={postId}
      />
    );

    fireEvent.press(getByText("Exit"));

    expect(setModalVisible).toHaveBeenCalledWith(false);
  });

  //   it('should handle delete post error', async () => {
  //     deletePost.mockRejectedValueOnce(new Error('Delete failed'));
  //     const { getByText } = render(
  //       <DeletePopup modalVisible={true} setModalVisible={setModalVisible} postId={postId} />
  //     );

  //     fireEvent.press(getByText('Delete Post'));

  //     await waitFor(() => expect(deletePost).toHaveBeenCalledWith('mock-token', postId));
  //     expect(console.error).toHaveBeenCalledWith(new Error('Delete failed'));
  //   });
});
