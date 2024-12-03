import { handleJsonResponse } from "../../utils/handleJsonResponse";

describe("handleJsonResponse", () => {
  it("should return JSON if response is ok", async () => {
    const mockResponse = {
      ok: true,
      json: jest.fn().mockResolvedValue({ data: "test data" }),
    } as unknown as Response;

    const result = await handleJsonResponse(mockResponse);
    expect(result).toEqual({ data: "test data" });
    expect(mockResponse.json).toHaveBeenCalled();
  });

  it("should throw an error if response is not ok with error message", async () => {
    const mockResponse = {
      ok: false,
      json: jest.fn().mockResolvedValue({ message: "Test error" }),
    } as unknown as Response;

    await expect(handleJsonResponse(mockResponse)).rejects.toThrow(
      "Test error"
    );
    expect(mockResponse.json).toHaveBeenCalled();
  });

  it("should throw an error if response is not ok without error message", async () => {
    const mockResponse = {
      ok: false,
      json: jest.fn().mockResolvedValue({}),
    } as unknown as Response;

    await expect(handleJsonResponse(mockResponse)).rejects.toThrow(
      "Unknown error"
    );
    expect(mockResponse.json).toHaveBeenCalled();
  });
});
