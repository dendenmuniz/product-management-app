import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BulkUpdateForm } from "./BulkUpdateForm";
import { Product } from "../@types/types";

describe("BulkUpdateForm", () => {
  const mockOnSubmit = jest.fn();

  const renderComponent = (selectedRows: number[] = []) => {
    render(
      <BulkUpdateForm selectedRows={selectedRows} onSubmit={mockOnSubmit} />
    );
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should render the form correctly", () => {
    renderComponent();

    expect(screen.getByLabelText("MSC")).toBeInTheDocument();
    expect(screen.getByLabelText("Price")).toBeInTheDocument();
    expect(screen.getByText("Update Products")).toBeDisabled();
  });

  it("should enable the button when a price is entered", () => {
    renderComponent();

    const priceInput = screen.getByLabelText("Price");
    fireEvent.change(priceInput, { target: { value: "100" } });

    const updateButton = screen.getByText("Update Products");
    expect(updateButton).toBeEnabled();
  });

  it("should enable the button when MSC is selected", () => {
    renderComponent();

    const mscDropdown = screen.getByLabelText("MSC");
    fireEvent.change(mscDropdown, { target: { value: "true" } });

    const updateButton = screen.getByText("Update Products");
    expect(updateButton).toBeEnabled();
  });

  it("should enable the button when both MSC and price are set", () => {
    renderComponent();

    const mscDropdown = screen.getByLabelText("MSC");
    fireEvent.change(mscDropdown, { target: { value: "true" } });

    const priceInput = screen.getByLabelText("Price");
    fireEvent.change(priceInput, { target: { value: "100" } });

    const updateButton = screen.getByText("Update Products");
    expect(updateButton).toBeEnabled();
  });

  it("should reset fields and call onSubmit with correct values on submit", () => {
    renderComponent();

    const mscDropdown = screen.getByLabelText("MSC");
    const priceInput = screen.getByLabelText("Price");
    const updateButton = screen.getByText("Update Products");

    fireEvent.change(mscDropdown, { target: { value: "true" } });
    fireEvent.change(priceInput, { target: { value: "100" } });

    fireEvent.click(updateButton);

    expect(mockOnSubmit).toHaveBeenCalledWith({
      MSC: true,
      price: "100",
    });

    //Cleanup
    expect(mscDropdown).toHaveValue("");
    expect(priceInput).toHaveValue("");
    expect(updateButton).toBeDisabled();
  });

  it("should call onSubmit with only MSC when price is empty", async () => {
    renderComponent();

    const updateButton = screen.getByText("Update Products");

    fireEvent.change(screen.getByLabelText("MSC"), {
      target: { value: "true" },
    });

    await waitFor(() => {
      expect(updateButton).toBeEnabled();
    });

    fireEvent.click(updateButton);

    expect(mockOnSubmit).toHaveBeenCalledWith({ MSC: true } as Partial<
      Pick<Product, "MSC" | "price">
    >);

    await waitFor(() => {
      expect(updateButton).toBeDisabled();
    });
  });

  it("should call onSubmit with only price when MSC is empty", async () => {
    renderComponent();

    const updateButton = screen.getByText("Update Products");

    const mscDropdown = screen.getByLabelText("MSC");
    fireEvent.change(mscDropdown, { target: { value: "" } });

    fireEvent.change(screen.getByLabelText("Price"), {
      target: { value: "100" },
    });

    await waitFor(() => {
      expect(updateButton).toBeEnabled();
    });

    fireEvent.click(updateButton);

    expect(mockOnSubmit).toHaveBeenCalledWith({ price: "100" } as Partial<
      Pick<Product, "MSC" | "price">
    >);

    await waitFor(() => {
      expect(updateButton).toBeDisabled();
    });
  });
});
