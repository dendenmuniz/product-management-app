import { toast } from "react-toastify";
import { Product } from "../@types/types";
import {
  httpGetProducts,
  httpUploadProducts,
  httpUpdateProducts,
  httpUpdateProductsBulk,
} from "../services/productService";
import { useProductsContext } from "../context/ProductsContext";
import { useAuthContext } from "../context/AuthContext";

export const useProducts = () => {
  const { products, setProducts } = useProductsContext();
  const { token } = useAuthContext();

  const loadProducts = async () => {
    try {
      const data = await httpGetProducts();
      setProducts(data.products);
    } catch (err) {
      toast.error((err as Error).message);
    }
  };

  const submitFileParsed = async (data: {
    products: Product[];
    fileName: string;
    uploadDate: string;
  }) => {
    console.log(products);
    try {
      const responseData = await httpUploadProducts(data, token ?? undefined);
      setProducts(responseData);
      toast.success("File uploaded successfully");
    } catch (err) {
      toast.error((err as Error).message);
    }
  };

  const handleUpdateProducts = async (product: Product) => {
    try {
      await httpUpdateProducts(product, token ?? undefined);
      toast.success("Product(s) updated successfully");
      // Reload products after update
      loadProducts();
    } catch (err) {
      toast.error((err as Error).message);
    }
  };

  const handleUpdateBulkProducts = async (
    updates: Partial<Pick<Product, "msc" | "price">>,
    selectedRows: number[]
  ) => {
    try {
      const newValues = products.map((product: Product) => {
        if (selectedRows.includes(Number(product.id))) {
          return { ...product, ...updates };
        }
        return product;
      });

      setProducts(newValues);

      const response = await httpUpdateProductsBulk(
        newValues,
        token ?? undefined
      );
      if (response.status === 200) {
        toast.success("Products updated successfully");
      }

      return "response";
    } catch (err) {
      toast.error((err as Error).message);
    }
  };

  return {
    loadProducts,
    submitFileParsed,
    handleUpdateProducts,
    handleUpdateBulkProducts,
  };
};
