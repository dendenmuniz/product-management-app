import { useState } from "react";
import { Header } from "../components/Header";
import { Table } from "../components/Table";
import { FileUploader } from "../components/FileUploader";
import { Card } from "../components/Card";
import { BulkUpdateForm } from "../components/BulkUpdateForm";
import { useProductsContext } from "../context/ProductsContext";
import { Product } from "../@types/types";
import { useProducts } from "../hooks/useProducts";

export const ProductsPage = () => {
  const { products, setProducts } = useProductsContext();
  const { handleUpdateProducts, handleUpdateBulkProducts } = useProducts();
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [bulkUpdateSuccess, setBulkUpdateSuccess] = useState<boolean>(false);

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
    updates: Partial<Pick<Product, "MSC" | "price">>
  ) => {
    const response = await handleUpdateBulkProducts(updates, selectedRows);
    if (response) {
      setBulkUpdateSuccess(true);
    }
  };

  return (
    <section className="bg-violet-50 min-h-screen ">
      <Header sectionName="Products" />

      <div className="p-6">
        <Card classN="bg-white p-6 rounded-lg shadow-md">
          {/* Ações no topo */}
          <div className="flex flex-wrap justify-between items-center mb-4">
            <div className="flex gap-4">
              <FileUploader />
              <button className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-md font-semibold">
                + Add Product
              </button>
            </div>
            {selectedRows.length > 0 && (
              <BulkUpdateForm
                selectedRows={selectedRows}
                onSubmit={handleUpdateBulk}
              />
            )}
          </div>

          {/* Tabela */}
          <Table
            products={products}
            onChange={handleChange}
            setSelectedRows={setSelectedRows}
            onSave={handleSave}
            clearSelection={bulkUpdateSuccess}
          />
        </Card>
      </div>
    </section>
  );
};
