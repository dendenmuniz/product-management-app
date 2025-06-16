import { useParams, useNavigate } from "react-router-dom";
import { productSchema } from "../validation/productSchema";
import { ZodError } from "zod";
import { useProductsContext } from "../context/ProductsContext";
import { ItemImage } from "../components/ItemImage";
import { ItemHeader } from "../components/ItemHeader";
import { ItemAttribute } from "../components/ItemAttribute";
import { ItemDescription } from "../components/ItemDescription";
import { useEffect, useState } from "react";
import { Product } from "../@types/types";
import { toast } from "react-toastify";
import { useProducts } from "../hooks/useProducts";
import { ItemAttributeArray } from "../components/ItemAttributeArray";
import { ItemBoolean } from "../components/ItemBoolean";
import {
  fieldParsers,
  cleanFormData,
  applyImageFallback,
} from "../utils/product";

export const ProductPage = () => {
  const { handleUpdateProduct, handleCreateProduct } = useProducts();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { products } = useProductsContext();

  const product = products.find((p) => p.id === id);
  const [formData, setFormData] = useState<Product | null>(product ?? null);
  const isLoading = !formData;
  const [isEditing, setIsEditing] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!product) {
      setIsEditing(true);
      setFormData({
        id: "",
        name: "",
        description: "",
        price: "",
        stock: 0,
        merchantId: "",
        variantId: "",
        supplierModelNumber: "",
        ean: [],
        size: "",
        vendor: "",
        productType: [],
        productGroup: [],
        department: [],
        imageUrl: "",
        variantCreated: "",
        variantUpdated: "",
        inventoryLevelCreated: "",
        inventoryLevelUpdated: "",
        createdAt: "",
        updatedAt: "",
        userId: "",
        msc: false,
        wholeSalePrice: "",
      });
    }
  }, [product]);

  const handleArrayChange = (name: string, newValues: string[]) => {
    setFormData((prev) => (prev ? { ...prev, [name]: newValues } : null));

    // Remove the error for this field if it exists
    setFormErrors((prev) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { [name]: _removed, ...rest } = prev;
      return rest;
    });
  };

  const handleChange = (
    eOrName: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | string,
    newValue?: string[] | string
  ) => {
    if (typeof eOrName === "string") {
      if (newValue === undefined || !formData) return;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const parsedFormData = {
        ...formData,
        stock: fieldParsers.stock(formData.stock),
        msc: fieldParsers.msc(formData.msc),
        imageUrl: applyImageFallback(formData.imageUrl),
      };

      setFormData((prev) =>
        prev ? { ...prev, [eOrName]: parsedFormData } : null
      );

      setFormErrors((prev) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { [eOrName]: _removed, ...rest } = prev;
        return rest;
      });
    } else {
      const { name, value } = eOrName.target;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const parser = fieldParsers[name] || ((v: any) => v);
      const parsed = parser(value);

      setFormData((prev) => (prev ? { ...prev, [name]: parsed } : null));

      setFormErrors((prev) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { [name]: _removed, ...rest } = prev;
        return rest;
      });
    }
  };

  const handleSave = async () => {
    if (!formData) return;

    try {
      const placeholderImage =
        "https://raw.githubusercontent.com/dendenmuniz/assets/main/image_placeholder.png";

      // parse and validate form data
      const parsedFormData = {
        ...formData,
        stock: fieldParsers.stock(formData.stock),
        msc: fieldParsers.msc(formData.msc),
        imageUrl:
          formData.imageUrl && formData.imageUrl.trim() !== ""
            ? formData.imageUrl
            : placeholderImage,
      };

      // Zod validation
      productSchema.parse(parsedFormData);
      setFormErrors({});

      // clean up form data
      // Remove empty strings, null, or undefined values
      const cleanedData = cleanFormData(parsedFormData);

      if (formData.id) {
        await handleUpdateProduct(cleanedData as Product);
      } else {
        await handleCreateProduct(cleanedData as Product);
      }

      setIsEditing(false);
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMap: Record<string, string> = {};
        error.errors.forEach((err) => {
          const field = err.path[0] as string;
          errorMap[field] = err.message;
        });
        setFormErrors(errorMap);
        toast.error("Please fix the highlighted fields");
      } else {
        toast.error("Something went wrong while saving the product");
      }
    }
  };

  return (
    <section className="bg-base-200 min-h-screen">
      <div className="container mx-auto py-20">
        <div className="card bg-base-100 shadow-md p-6 max-w-5xl mx-auto">
          <div className="mb-6 flex justify-start">
            <button
              onClick={() => navigate(-1)}
              className="btn btn-sm btn-primary"
            >
              ← Back
            </button>
            <div className="flex ml-auto items-right ml-4">
              {isEditing ? (
                <>
                  <button
                    className="btn btn-sm btn-primary ml-2"
                    onClick={() => {
                      if (!product) {
                        navigate(-1); // If new and cancel, go back
                      } else {
                        setFormData(product); // Revert to original
                        setIsEditing(false);
                      }
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    className="btn btn-sm btn-primary ml-2"
                    onClick={handleSave}
                  >
                    Save
                  </button>
                </>
              ) : (
                <button
                  className="btn btn-sm btn-primary ml-2"
                  onClick={() => setIsEditing(true)}
                >
                  Edit
                </button>
              )}
            </div>
          </div>
          <h3 className="text-2xl font-semibold mb-6 text-center">
            Product Details
          </h3>

          {isLoading || !formData ? (
            <div className="animate-pulse space-y-4 text-center">
              <span className="loading loading-dots loading-xl"></span>
            </div>
          ) : (
            <div className="md:flex items-start justify-center gap-8">
              <ItemImage
                alt={formData?.name}
                url={formData?.imageUrl || ""}
                isEditing={isEditing}
                onChange={handleChange}
              />

              <div className="flex-1 mt-6  md:mt-0">
                <ItemHeader
                  itemManufector={
                    isEditing ? (
                      <ItemAttribute
                        attribute="Merchant"
                        attributeValue={formData?.merchantId || ""}
                        name="merchantId"
                        isEditing={isEditing}
                        onChange={handleChange}
                        errorMessage={formErrors["merchantId"]}
                      />
                    ) : (
                      <div
                        className="tooltip tooltip-top"
                        data-tip="Merchant ID"
                      >
                        <span className="text-sm font-medium text-gray-700">
                          {formData.merchantId}
                        </span>
                      </div>
                    )
                  }
                  itemName={
                    isEditing ? (
                      <ItemAttribute
                        attribute="Product Name"
                        attributeValue={formData?.name || ""}
                        name="name"
                        isEditing={isEditing}
                        onChange={handleChange}
                        errorMessage={formErrors["name"]}
                      />
                    ) : (
                      formData.name
                    )
                  }
                />

                <div className="grid grid-flow-row-dense grid-cols-5 md:grid-cols-2 gap-1">
                  <ItemAttribute
                    attribute={
                      <span
                        className="tooltip tooltip-top"
                        data-tip="Supplier's model number"
                      >
                        Model
                      </span>
                    }
                    attributeValue={formData?.supplierModelNumber ?? ""}
                    name="supplierModelNumber"
                    isEditing={isEditing}
                    onChange={handleChange}
                    errorMessage={formErrors["supplierModelNumber"]}
                  />
                  <ItemAttribute
                    attribute="Size"
                    attributeValue={formData?.size ?? ""}
                    name="size"
                    isEditing={isEditing}
                    onChange={handleChange}
                  />

                  <ItemAttribute
                    attribute="Quantity"
                    attributeValue={formData?.stock}
                    name="stock"
                    isEditing={isEditing}
                    onChange={handleChange}
                    errorMessage={formErrors["stock"]}
                  />
                  <ItemAttribute
                    attribute="Vendor"
                    attributeValue={formData?.vendor}
                    name="vendor"
                    isEditing={isEditing}
                    onChange={handleChange}
                  />
                  <ItemAttribute
                    attribute="Price"
                    attributeValue={formData?.price}
                    name="price"
                    isEditing={isEditing}
                    onChange={handleChange}
                    errorMessage={formErrors["price"]}
                  />
                  <ItemBoolean
                    attribute="MSC (Multi-Sales Channel)"
                    name="msc"
                    value={formData.msc ?? false}
                    isEditing={isEditing}
                    onChange={handleChange}
                  />
                  <div className="col-span-2">
                    <ItemAttribute
                      attribute="Variant ID"
                      attributeValue={formData?.variantId || ""}
                      name="variantId"
                      isEditing={isEditing}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-span-2">
                    <ItemAttributeArray
                      attribute="EAN"
                      name="ean"
                      values={formData.ean}
                      isEditing={isEditing}
                      onChange={handleArrayChange}
                    />
                  </div>
                  <div className="col-span-2">
                    <ItemAttributeArray
                      attribute="Type"
                      name="productType"
                      values={formData.productType}
                      isEditing={isEditing}
                      onChange={handleArrayChange}
                    />
                  </div>
                  <div className="col-span-2">
                    <ItemAttributeArray
                      attribute="Group"
                      name="productGroup"
                      values={formData.productGroup}
                      isEditing={isEditing}
                      onChange={handleArrayChange}
                    />
                  </div>
                  <div className="col-span-2">
                    <ItemAttributeArray
                      attribute="Department"
                      name="department"
                      values={formData.department}
                      isEditing={isEditing}
                      onChange={handleArrayChange}
                    />
                  </div>
                </div>

                <div className="mt-6">
                  <ItemDescription
                    description={formData.description ?? ""}
                    isEditing={isEditing}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
