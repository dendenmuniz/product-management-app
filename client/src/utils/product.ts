/* eslint-disable @typescript-eslint/no-explicit-any */
import { Product } from "../@types/types";

export const fieldParsers: Record<string, (value: any) => any> = {
  stock: (value) => Number(value),
  msc: (value) => value === "true" || value === true,
};

export const cleanFormData = (data: Product): Partial<Product> => {
  const cleaned: Partial<Product> = { ...data };

  const optionalFields = [
    "variantCreated",
    "variantUpdated",
    "inventoryLevelCreated",
    "inventoryLevelUpdated",
  ];

  optionalFields.forEach((key) => {
    const value = cleaned[key as keyof Product];
    if (value === "" || value === null || value === undefined) {
      delete cleaned[key as keyof Product];
    }
  });

  return cleaned;
};

export const applyImageFallback = (imageUrl: string | undefined): string =>
  imageUrl && imageUrl.trim() !== ""
    ? imageUrl
    : "https://raw.githubusercontent.com/dendenmuniz/assets/main/image_placeholder.png";
