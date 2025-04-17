export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "seller" ;
  avatar?: string;
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: string;
  stock: number;
  merchantId?: string;
  variantId?: string;
  supplierModelNumber?: string;
  ean: string[];
  size?: string;
  vendor?: string;
  productType: string[];
  productGroup: string[];
  department: string[];
  imageUrl?: string;
  variantCreated?: string;
  variantUpdated?: string;
  inventoryLevelCreated?: string;
  inventoryLevelUpdated?: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  msc?: boolean;
  wholeSalePrice?: string;
}

export interface LastUploadFile {
  fileName: string;
  uploadDate: string;
}

export interface BulkProductUpdate {
  id: string;
  msc?: boolean;
  price?: string;
}
