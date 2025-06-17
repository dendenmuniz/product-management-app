import api from "./api";
import { BulkProductUpdate, Product } from "../@types/types";

export const httpGetProducts = async () => {
  const res = await api.get("/products/");
  return res.data;
};

export const httpUploadProducts = async (data: {
  products: Product[];
  fileName: string;
  uploadDate: string;
}) => {
  const res = await api.post("/products/import", data);
  return res.data;
};

export const httpUpdateProduct = async (product: Product) => {
  const res = await api.put(`/products/${product.id}`, product);
  return res.data;
};

export const httpCreateProduct = async (product: Product) => {
  const res = await api.post(`/products`, product);
  return res.data;
};

export const httpUpdateProductsBulk = async (products: BulkProductUpdate[]) => {
  console.log("products no http", products);
  const res = await api.put("/products/bulk-update", { products });
  return res;
};
