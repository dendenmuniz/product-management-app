/* eslint-disable @typescript-eslint/no-unused-vars */
import axios from "axios";
import { Product } from "../@types/types";

const getAuthHeader = (token?: string) => ({
  headers: { Authorization: `Bearer ${token}` },
  });

export const httpGetProducts = async (token?: string) => {
  const res = await axios.get("/api/products", getAuthHeader(token));
  return res.data;
};

export const httpUploadProducts = async (
  data: { products: Product[]; fileName: string; uploadDate: string },
  token?: string
) => {
  const res = await axios.post("/api/products/import", data, getAuthHeader(token));
  return res.data;
};

export const httpUpdateProducts = async (product: Product, token?: string) => {
  const res = await axios.put(`/api/products/${product.id}`, product, getAuthHeader(token));
  return res.data;
};

export const httpUpdateProductsBulk = async (products: Product[], token?: string) => {
  const res = await axios.put("/api/products/bulk-update", { products }, getAuthHeader(token));
  return res;
};
