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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [bulkUpdateSuccess, setBulkUpdateSuccess] = useState<boolean>(false);

  const handleChange = (
    rowId: string,
    columnId: keyof Product,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    value: any
  ) => {
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
    console.log(updates);
    const response = await handleUpdateBulkProducts(updates, selectedRows);
    if (response) {
      setBulkUpdateSuccess(true);
    }
  };
  return (
    <section className="bg-violet-50">
      <Header sectionName="Products Management" />
      <div className="container m-auto py-20">
        <div className="bg-white p-4  rounded-lg shadow-md rounded-md border m-4 md:m-0">
          <Card>
            <FileUploader />
          </Card>
        </div>
        <div className="container m-auto py-12">
          <div className="gap-4 bg-white m-4 rounded-lg shadow-md rounded-md border m-4 md:m-0">
            <Card classN="p-6 rounded-lg shadow-md m-6">
              <h1 className="block text-gray-800 font-semibold mb-6">
                Bulk update
              </h1>
              <BulkUpdateForm
                selectedRows={selectedRows}
                onSubmit={handleUpdateBulk}
              />
            </Card>

            <div className="bg-white gap-4 px-6 py-4 mb-4 m-4 md:m-0 text-gray-800">
              <Card>
                <Table
                  products={products}
                  onChange={handleChange}
                  setSelectedRows={setSelectedRows}
                  onSave={handleSave}
                  clearSelection={bulkUpdateSuccess}
                />
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
