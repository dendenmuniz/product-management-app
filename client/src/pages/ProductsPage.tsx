import { useState } from "react";
import { Table } from "../components/Table";
import { FileUploader } from "../components/FileUploader";
import { BulkUpdateForm } from "../components/BulkUpdateForm";
import { useProductsContext } from "../context/ProductsContext";
import { Product } from "../@types/types";
import { useProducts } from "../hooks/useProducts";

export const ProductsPage = () => {
  const { products, setProducts } = useProductsContext();
  const { handleUpdateProducts, handleUpdateBulkProducts } = useProducts();
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [bulkUpdateSuccess, setBulkUpdateSuccess] = useState<boolean>(false);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleChange = (rowId: string, columnId: keyof Product, value: any) => {
    setProducts((prev) =>
      prev.map((product, index) =>
        index.toString() === rowId ? { ...product, [columnId]: value } : product
      )
    );
  };

  const handleSave = async (rowId: string) => {
    const productIndex = Number(rowId);
    const productToUpdate = products[productIndex];
    await handleUpdateProducts(productToUpdate);
  };

  const handleUpdateBulk = async (
    updates: Partial<Pick<Product, "msc" | "price">>
  ) => {
    const response = await handleUpdateBulkProducts(updates, selectedRows);
    if (response) {
      setBulkUpdateSuccess(true);
    }
  };

  return (
    <section className="min-h-screen bg-base-200 py-10 px-4">
      <div className="max-w-7xl mx-auto">
        <h3 className="text-xl font-semibold text-base-content mb-6 px-2">
          Products
        </h3>

        <div className="card card-bordered shadow-sm bg-base-100">
          <div className="card-body space-y-4">
            <div className="flex justify-between items-start flex-wrap gap-4">
              <FileUploader />
              <button className="btn btn-primary self-start">+ Add Product</button>
            </div>

            {selectedRows.length > 0 && (
              <BulkUpdateForm
                selectedRows={selectedRows}
                onSubmit={handleUpdateBulk}
              />
            )}

            <div className="border border-base-300 rounded-lg">
              <Table
                products={products}
                onChange={handleChange}
                setSelectedRows={setSelectedRows}
                onSave={handleSave}
                clearSelection={bulkUpdateSuccess}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
