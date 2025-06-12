import { toast } from "react-toastify";
import { BulkProductUpdate, Product } from "../@types/types";
import {
  httpGetProducts,
  httpUploadProducts,
  httpUpdateProduct,
  httpUpdateProductsBulk,
  httpCreateProduct,
} from "../services/productService";
import { useProductsContext } from "../context/ProductsContext";
import { useAuthContext } from "../context/AuthContext";

export const useProducts = () => {
  const { products, setProducts } = useProductsContext();
  const { token } = useAuthContext();

  const loadProducts = async () => {
    try {
      const data = await httpGetProducts(token ?? undefined);
      setProducts(data);
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

  const handleCreateProduct = async (product: Product) => {
    try {
      await httpCreateProduct(product, token ?? undefined);
      toast.success("Product created successfully");
      loadProducts(); // Adiciona na tabela
    } catch (err) {
      toast.error((err as Error).message);
    }
  };

  const handleUpdateProduct = async (product: Product) => {
    console.log("Updating product:", product);
    try {
      await httpUpdateProduct(product, token ?? undefined);
      toast.success("Product updated successfully");
      // Reload products after update
      loadProducts();
    } catch (err) {
      toast.error((err as Error).message);
    }
  };

  const handleUpdateBulkProducts = async (
    updates: Partial<Pick<Product, "msc" | "price">>,
    selectedRows: string[]
  ) => {
    try {
      const updatedSelection: BulkProductUpdate[] = selectedRows.map((id) => ({
        id,
        ...updates,
      }));
  
      // Update Localy for faster feedback
      const newValues = products.map((product: Product) => {
        if (selectedRows.includes(product.id)) {
          return { ...product, ...updates };
        }
        return product;
      });
      setProducts(newValues);
  
      const response = await httpUpdateProductsBulk(
        updatedSelection,
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
    handleCreateProduct,
    handleUpdateProduct,
    handleUpdateBulkProducts,
  };
};
