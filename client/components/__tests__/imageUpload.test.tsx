import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import ImageUploadComponent from "../imageUpload";
import { auth } from "@/firebase";
import * as ImagePicker from "expo-image-picker";

jest.mock("@/firebase", () => ({
  auth: {
    currentUser: {
      getIdToken: jest.fn().mockResolvedValue("mock-token"),
    },
  },
}));

jest.mock("expo-image-picker", () => ({
  launchImageLibraryAsync: jest.fn(),
  MediaTypeOptions: {
    Images: "Images",
  },
}));

global.fetch = jest.fn();

describe("ImageUploadComponent", () => {
  const onImageUpload = jest.fn();
  const onImageChoice = jest.fn();
  const resetTrigger = false;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render correctly", () => {
    const { getByText } = render(
      <ImageUploadComponent
        onImageUpload={onImageUpload}
        onImageChoice={onImageChoice}
        resetTrigger={resetTrigger}
      />
    );

    expect(getByText("Choose Image")).toBeTruthy();
  });

  it("should call onImageChoice when an image is picked", async () => {
    const mockUri = "mock-uri";
    (ImagePicker.launchImageLibraryAsync as jest.Mock).mockResolvedValue({
      canceled: false,
      assets: [{ uri: mockUri }],
    });

    const { getByText } = render(
      <ImageUploadComponent
        onImageUpload={onImageUpload}
        onImageChoice={onImageChoice}
        resetTrigger={resetTrigger}
      />
    );

    fireEvent.press(getByText("Choose Image"));

    await waitFor(() => expect(onImageChoice).toHaveBeenCalledWith(mockUri));
  });

  it("should upload image and call onImageUpload with URL", async () => {
    const mockUri = "mock-uri";
    const mockUrl = "mock-url";
    (ImagePicker.launchImageLibraryAsync as jest.Mock).mockResolvedValue({
      canceled: false,
      assets: [{ uri: mockUri }],
    });

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({
        data: { url: mockUrl },
      }),
    });

    const ref = React.createRef<{ uploadImage: () => void }>();
    const { getByText } = render(
      <ImageUploadComponent
        ref={ref}
        onImageUpload={onImageUpload}
        onImageChoice={onImageChoice}
        resetTrigger={resetTrigger}
      />
    );

    fireEvent.press(getByText("Choose Image"));

    await waitFor(() => expect(onImageChoice).toHaveBeenCalledWith(mockUri));

    await waitFor(() => ref.current?.uploadImage());

    await waitFor(() => expect(onImageUpload).toHaveBeenCalledWith(mockUrl));
  });

  //   it('should handle image upload failure', async () => {
  //     const mockUri = 'mock-uri';
  //     (ImagePicker.launchImageLibraryAsync as jest.Mock).mockResolvedValue({
  //       canceled: false,
  //       assets: [{ uri: mockUri }],
  //     });

  //     (global.fetch as jest.Mock).mockResolvedValue({
  //       ok: false,
  //     });

  //     const ref = { current: null };
  //     const { getByText } = render(
  //       <ImageUploadComponent
  //         ref={ref}
  //         onImageUpload={onImageUpload}
  //         onImageChoice={onImageChoice}
  //         resetTrigger={resetTrigger}
  //       />
  //     );

  //     fireEvent.press(getByText('Choose Image'));

  //     await waitFor(() => expect(onImageChoice).toHaveBeenCalledWith(mockUri));

  //     await waitFor(() => ref.current!.uploadImage());

  //     await waitFor(() => expect(onImageUpload).toHaveBeenCalledWith(null));
  //   });

  it("should reset image when resetTrigger is true", () => {
    const { rerender, getByText, queryByRole } = render(
      <ImageUploadComponent
        onImageUpload={onImageUpload}
        onImageChoice={onImageChoice}
        resetTrigger={false}
      />
    );

    fireEvent.press(getByText("Choose Image"));

    (ImagePicker.launchImageLibraryAsync as jest.Mock).mockResolvedValue({
      canceled: false,
      assets: [{ uri: "mock-uri" }],
    });

    rerender(
      <ImageUploadComponent
        onImageUpload={onImageUpload}
        onImageChoice={onImageChoice}
        resetTrigger={true}
      />
    );

    expect(queryByRole("image")).toBeNull();
  });
});
