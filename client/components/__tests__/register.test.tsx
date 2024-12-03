import RegistrationPage from "../../app/(auth)/register";
import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { createUser } from "../../utils/interfaces/userInterface";
import { useRouter } from "expo-router";
import { auth } from "../../firebase";
import { Alert } from "react-native";

jest.mock("firebase/auth", () => ({
  createUserWithEmailAndPassword: jest.fn(),
}));

jest.mock("../../utils/interfaces/userInterface", () => ({
  createUser: jest.fn(),
}));

jest.mock("expo-router", () => ({
  useRouter: jest.fn(),
}));

jest.mock("../../firebase", () => ({
  auth: {
    currentUser: {
      getIdToken: jest.fn().mockResolvedValue("mock-token"),
    },
  },
}));

describe("RegistrationPage", () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ navigate: mockNavigate });
    jest.spyOn(Alert, "alert");
  });

  it("should render correctly", () => {
    const { getByPlaceholderText, getByText } = render(<RegistrationPage />);

    expect(getByPlaceholderText("Jiara Martins")).toBeTruthy();
    expect(getByPlaceholderText("hello@reallygreatsite.com")).toBeTruthy();
    expect(getByPlaceholderText("123-456-7890")).toBeTruthy();
    expect(getByPlaceholderText("********")).toBeTruthy();
    expect(getByText("Sign up")).toBeTruthy();
  });

  it("should show alert if required fields are missing", async () => {
    const { getByText } = render(<RegistrationPage />);

    fireEvent.press(getByText("Sign up"));

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith("Please fill out all fields.");
    });
  });

  it("should show alert if phone number is not 10 characters long", async () => {
    const { getByPlaceholderText, getByText } = render(<RegistrationPage />);

    fireEvent.changeText(
      getByPlaceholderText("hello@reallygreatsite.com"),
      "test@example.com"
    );
    fireEvent.changeText(getByPlaceholderText("********"), "password");
    fireEvent.changeText(getByPlaceholderText("123-456-7890"), "123456");

    fireEvent.press(getByText("Sign up"));

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        "Phone number must be 10 characters long"
      );
    });
  });

  it("should show alert if phone number contains non-numeric characters", async () => {
    const { getByPlaceholderText, getByText } = render(<RegistrationPage />);

    fireEvent.changeText(
      getByPlaceholderText("hello@reallygreatsite.com"),
      "test@example.com"
    );
    fireEvent.changeText(getByPlaceholderText("********"), "password");
    fireEvent.changeText(getByPlaceholderText("123-456-7890"), "123456abcd");

    fireEvent.press(getByText("Sign up"));

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        "Phone number should only contain numbers"
      );
    });
  });

  it("should handle successful registration", async () => {
    (createUserWithEmailAndPassword as jest.Mock).mockResolvedValue({
      user: { uid: "mock-uid" },
    });
    (auth.currentUser?.getIdToken as jest.Mock).mockResolvedValue("mock-token");

    const { getByPlaceholderText, getByText } = render(<RegistrationPage />);

    fireEvent.changeText(getByPlaceholderText("Jiara Martins"), "John Doe");
    fireEvent.changeText(
      getByPlaceholderText("hello@reallygreatsite.com"),
      "test@example.com"
    );
    fireEvent.changeText(getByPlaceholderText("123-456-7890"), "1234567890");
    fireEvent.changeText(getByPlaceholderText("********"), "password");

    fireEvent.press(getByText("Sign up"));

    await waitFor(() =>
      expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(
        auth,
        "test@example.com",
        "password"
      )
    );
    await waitFor(() =>
      expect(createUser).toHaveBeenCalledWith("mock-token", {
        user_firebase_id: "mock-uid",
        email: "test@example.com",
        name: "John Doe",
        phone_number: "1234567890",
        pronouns: "",
        profile_img_url: "",
      })
    );
    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith("/login"));
  });

  it("should handle registration errors", async () => {
    (createUserWithEmailAndPassword as jest.Mock).mockRejectedValue({
      code: "auth/email-already-in-use",
    });

    const { getByPlaceholderText, getByText } = render(<RegistrationPage />);

    fireEvent.changeText(getByPlaceholderText("Jiara Martins"), "John Doe");
    fireEvent.changeText(
      getByPlaceholderText("hello@reallygreatsite.com"),
      "test@example.com"
    );
    fireEvent.changeText(getByPlaceholderText("123-456-7890"), "1234567890");
    fireEvent.changeText(getByPlaceholderText("********"), "password");

    fireEvent.press(getByText("Sign up"));

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith("Email is already in use.");
    });

    (createUserWithEmailAndPassword as jest.Mock).mockRejectedValue({
      code: "auth/weak-password",
    });

    fireEvent.press(getByText("Sign up"));

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith("Password is too weak.");
    });

    (createUserWithEmailAndPassword as jest.Mock).mockRejectedValue({
      code: "auth/invalid-email",
    });

    fireEvent.press(getByText("Sign up"));

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith("Invalid email address.");
    });
  });
});
