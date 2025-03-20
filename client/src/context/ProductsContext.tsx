/* eslint-disable @typescript-eslint/no-unused-vars */
import React, {
  createContext,
  ReactNode,
  useContext,
  useState,
} from "react";
import { Product } from "../@types/types";


// Define the context and types
interface ProductsContextType {
  products: Product[];
  fileName: string | null;
  uploadDate: string | null;
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  setFileInfo: (fileName: string, uploadDate: string) => void;
  fileId: string | null;
  setFileId: (fileId: string | null) => void;
}

const ProductsContext = createContext<ProductsContextType | undefined>(
  undefined
);

export const ProductsProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [fileName, setFileName] = useState<string | null>(null);
  const [uploadDate, setUploadDate] = useState<string | null>(null);
  const [fileId, setFileId] = useState<string | null>(null);
  
  const setFileInfo = (fileName: string, uploadDate: string) => {
    setFileName(fileName);
    setUploadDate(uploadDate);
  };

  return (
    <ProductsContext.Provider
      value={{
        products,
        fileName,
        uploadDate,
        setProducts,
        setFileInfo,
        fileId,
        setFileId,
      }}>
      {children}
    </ProductsContext.Provider>
  );
};

export const useProductsContext = () => {
  const context = useContext(ProductsContext);
  if (!context) {
    throw new Error(
      "useProductsContext must be used within a ProductsProvider"
    );
  }
  return context;
};
