import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { FileUploader } from "../components/FileUploader";
import { useProductsContext } from "../context/ProductsContext";
import { useProducts } from "../hooks/useProducts";

jest.mock("../context/ProductsContext", () => ({
  useProductsContext: jest.fn(),
}));

jest.mock("../hooks/useProducts", () => ({
  useProducts: jest.fn(),
}));

describe("FileUploader Component", () => {
  const mockSetFileInfo = jest.fn();
  const mockSubmitFileParsed = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    (useProductsContext as jest.Mock).mockReturnValue({
      setFileInfo: mockSetFileInfo,
      fileName: "test.json",
      uploadDate: "2025-01-25 12:00:00",
    });

    (useProducts as jest.Mock).mockReturnValue({
      submitFileParsed: mockSubmitFileParsed,
    });
  });

  it("renders the component with initial UI elements", () => {
    render(<FileUploader />);

    expect(screen.getByText(/upload your supplies/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /upload/i })).toBeInTheDocument();
    expect(screen.getByText(/last uploaded file:/i)).toBeInTheDocument();
    expect(screen.getByText(/test.json/i)).toBeInTheDocument();
    expect(screen.getByText(/uploaded on/i)).toBeInTheDocument();
    expect(screen.getByText(/2025-01-25 12:00:00/i)).toBeInTheDocument();
  });

  it("shows an error when a non-JSON file is uploaded", async () => {
    render(<FileUploader />);

    const fileInput = screen.getByLabelText(/upload your supplies/i);
    const file = new File(["dummy content"], "test.txt", {
      type: "text/plain",
    });

    fireEvent.change(fileInput, { target: { files: [file] } });

    expect(
      await screen.findByText(/please upload a valid json file/i)
    ).toBeInTheDocument();
  });

  it("handles valid JSON file upload and calls submitFileParsed", async () => {
    render(<FileUploader />);

    const fileInput = screen.getByLabelText(/upload your supplies/i);
    const file = new File(
      [JSON.stringify([{ name: "Product A", price: 10 }])],
      "test.json",
      { type: "application/json" }
    );

    fireEvent.change(fileInput, { target: { files: [file] } });

    fireEvent.click(screen.getByRole("button", { name: /upload/i }));

    await waitFor(() => {
      expect(mockSubmitFileParsed).toHaveBeenCalledWith(
        expect.objectContaining({
          fileName: "test.json",
          products: expect.arrayContaining([
            expect.objectContaining({
              name: "Product A",
              price: 10,
              MSC: false,
            }),
          ]),
        })
      );
      expect(mockSetFileInfo).toHaveBeenCalledWith(
        "test.json",
        expect.any(String) // Confirma que a data é definida
      );
    });
  });

  it("shows an error if no file is selected and the form is submitted", async () => {
    render(<FileUploader />);

    fireEvent.click(screen.getByRole("button", { name: /upload/i }));

    expect(await screen.findByText(/no file selected/i)).toBeInTheDocument();
  });
});
