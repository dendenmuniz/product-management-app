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


export const useProducts = () => {
  const { products, setProducts } = useProductsContext();


  const loadProducts = async () => {
    try {
      const data = await httpGetProducts();
      setProducts(data);
    } catch (err) {
      console.error(err);
    }
  };

  const submitFileParsed = async (data: {
    products: Product[];
    fileName: string;
    uploadDate: string;
  }) => {
    console.log(products);
    try {
      const responseData = await httpUploadProducts(data);
      setProducts(responseData);
      toast.success("File uploaded successfully");
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateProduct = async (product: Product) => {
    try {
      await httpCreateProduct(product);
      toast.success("Product created successfully");
      loadProducts(); // Adiciona na tabela
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateProduct = async (product: Product) => {
    console.log()
    try {
      await httpUpdateProduct(product);
      toast.success("Product updated successfully");
      // Reload products after update
      loadProducts();
    } catch (err) {
      console.error(err);
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
        updatedSelection
      );
  
      if (response.status === 200) {
        toast.success("Products updated successfully");
      }
  
      return "response";
    } catch (err) {
      console.error(err);
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
