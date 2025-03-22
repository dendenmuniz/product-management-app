import { BrowserRouter } from "react-router-dom";
import {
  render,
  screen,
  fireEvent,
  act,
  waitFor,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Table } from "./Table";

import { Product } from "../@types/types";

// Products Mock
const mockProducts: Product[] = [
  {
    id: 1,
    merchant_id: "Merchant A",
    variant_id: "a",
    product_name: "Product A",
    supplier_model_number: "a",
    ean: ["a"],
    size: "size",
    vendor: "Vendor A",
    quantity: 100,
    product_type: ["Type 1"],
    product_group: ["Group A"],
    department: ["Dept A"],
    variant_created: "variant_created",
    variant_updated: "variant_updated",
    inventory_level_created: "inventory_level_created",
    inventory_level_updated: "inventory_level_updated",
    image_url: "image",
    price: "10",
    product_description: "Product Description",
    MSC: true,
  },
  {
    id: 2,
    merchant_id: "Merchant B",
    variant_id: "a",
    product_name: "Product B",
    supplier_model_number: "a",
    ean: ["a"],
    size: "size",
    vendor: "Vendor B",
    quantity: 200,
    product_type: ["Type 2"],
    product_group: ["Group B"],
    department: ["Dept B"],
    variant_created: "variant_created",
    variant_updated: "variant_updated",
    inventory_level_created: "inventory_level_created",
    inventory_level_updated: "inventory_level_updated",
    image_url: "image",
    price: "20",
    product_description: "Product Description",
    MSC: true,
  },
  ...Array.from({ length: 50 }, (_, index) => ({
    id: index + 3,
    merchant_id: "Merchant C",
    variant_id: "a",
    product_name: `Product ${index + 3}`,
    supplier_model_number: "C",
    ean: ["c"],
    size: "size",
    vendor: "Vendor C",
    quantity: 100,
    product_type: ["Type 1"],
    product_group: ["Group C"],
    department: ["Dept C"],
    variant_created: "variant_created",
    variant_updated: "variant_updated",
    inventory_level_created: "inventory_level_created",
    inventory_level_updated: "inventory_level_updated",
    image_url: "image",
    price: "10",
    product_description: "Product Description",
    MSC: true,
  })),
];

describe("Table Component", () => {
  const mockOnChange = jest.fn();
  const mockOnSave = jest.fn();
  const mockSetSelectedRows = jest.fn();

  const renderTable = (clearSelection = false) => {
    render(
      <BrowserRouter>
        <Table
          onChange={mockOnChange}
          onSave={mockOnSave}
          setSelectedRows={mockSetSelectedRows}
          products={mockProducts}
          clearSelection={clearSelection}
        />
      </BrowserRouter>
    );
  };

  it("should render table headers", () => {
    renderTable();

    expect(screen.getByText("Actions")).toBeInTheDocument();
    expect(screen.getByText("MSC")).toBeInTheDocument();
    expect(screen.getByText("Product")).toBeInTheDocument();
    expect(screen.getByText("Price")).toBeInTheDocument();
    expect(screen.getByText("Quantity")).toBeInTheDocument();
  });

  it("should display product rows", () => {
    renderTable();

    expect(screen.getByText("Product A")).toBeInTheDocument();
    expect(screen.getByText("Product B")).toBeInTheDocument();
  });

  it("should allow editing a row", () => {
    renderTable();

    const editButton = screen.getAllByText("Edit")[0];
    fireEvent.click(editButton);

    const saveButton = screen.getByText("Save");
    expect(saveButton).toBeInTheDocument();

    const priceInput = screen.getByDisplayValue("10");
    fireEvent.change(priceInput, { target: { value: "15" } });

    fireEvent.click(saveButton);
    expect(mockOnSave).toHaveBeenCalled();
  });

  it("should filter products by name", async () => {
    renderTable();

    const searchInput = screen.getByTestId("debounced-input-global");
    expect(searchInput).toBeInTheDocument();

    const user = userEvent.setup();
    await act(async () => {
      await user.type(
        screen.getByTestId("debounced-input-global"),
        "Product A"
      );
    });
    await waitFor(() => {
      expect(screen.getByText("Product A")).toBeInTheDocument();
      expect(screen.queryByText("Product B")).not.toBeInTheDocument();
    });
  });

  it("should toggle row selection", async () => {
    renderTable();

    const rowCheckbox = screen.getAllByRole("checkbox")[1];
    await act(async () => {
      fireEvent.click(rowCheckbox);
    });
    expect(mockSetSelectedRows).toHaveBeenCalled();
  });

  it("should clear selection when `clearSelection` is true", () => {
    renderTable(true);

    const selectAllCheckbox = screen.getAllByRole("checkbox")[0];
    expect(selectAllCheckbox).not.toBeChecked();
  });

  it("should handle pagination buttons", async () => {
    renderTable();

    const nextButton = screen.getByText(">");
    const prevButton = screen.getByText("<");

    await waitFor(() => {
      expect(nextButton).not.toBeDisabled();
      expect(prevButton).toBeDisabled();
    });

    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(prevButton).not.toBeDisabled();
    });
  });
});
