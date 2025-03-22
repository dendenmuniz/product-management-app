/* eslint-disable @typescript-eslint/no-unused-vars */

import { Product } from "../@types/types";

export const httpGetProducts = async () => {
  const response = await fetch("/api/products");
  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }
  return response.json();
};

export const httpGetUploadFiles = async () => {
  const response = await fetch("/api/uploadFiles");
  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }
  return response.json();
};

export const httpUploadedFile = async (
  fileName: string,
  uploadDate: string
) => {
  try {
    await fetch("/api/uploadFiles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fileName,
        uploadDate,
      }),
    });
    return;
  } catch (err) {
    throw new Error(`Failed to upload file metadata.`);
  }
};

export const httpUploadProducts = async (data: {
  products: Product[];
  fileName: string;
  uploadDate: string;
}) => {
  try {
    const a = httpUploadedFile(data.fileName, data.uploadDate);
    const response = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data.products),
    });
    if (!response.ok) {
      throw new Error(`Failed to upload products`);
    }

    return response.json();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err) {
    throw new Error(`Failed to upload products. ${(err as Error).message}`);
  }
};

export const httpUpdateProducts = async (product: Product) => {
  const response = await fetch(`/api/products/${product.id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      price: product.price,
      MSC: product.MSC,
    }),
  });
  if (!response.ok) {
    throw new Error("Failed to update product(s)");
  }
  return response.json();
};

export const httpUpdateProductsBulk = async (updatedProducts: Product[]) => {
  console.log("farei a PATCH request at /products");
  const response = await fetch(`/api/products`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatedProducts), // Send the array of products to update
  });

  if (!response.ok) {
    throw new Error("Failed to update products.");
  }
  return response.json();
};
