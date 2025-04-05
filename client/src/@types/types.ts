export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "seller" | "client";
  avatar?: string;
}

export interface Product {
  id: number;
  merchant_id: string;
  variant_id: string;
  product_name: string;
  supplier_model_number: string | null;
  ean: string[];
  size: string;
  vendor: string;
  quantity: number;
  product_type: string[];
  product_group: (string | null)[];
  department: (string | null)[];
  variant_created: string;
  variant_updated: string;
  inventory_level_created: string;
  inventory_level_updated: string;
  image_url: string;
  price: string;
  product_description: string;
  MSC?: boolean;
}

export interface LastUploadFile {
  fileName: string;
  uploadDate: string;
}
