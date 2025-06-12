import { useParams, useNavigate } from "react-router-dom";
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

export const ProductPage = () => {
  const { handleUpdateProduct, handleCreateProduct } = useProducts();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { products } = useProductsContext();

  const product = products.find((p) => p.id === id);
  const [formData, setFormData] = useState<Product | null>(product ?? null);
  const isLoading = !formData;
  const [isEditing, setIsEditing] = useState(false); // !product;

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
        inventoryLevelCreated: "", //merchantId, supplierModelNumber, ean
        inventoryLevelUpdated: "",
        createdAt: "",
        updatedAt: "",
        userId: "",
        msc: false,
        wholeSalePrice: "",
      });
    }
  }, [product]);

  const handleChange = (
    eOrName: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | string,
    newValue?: string[] | string
  ) => {
    if (typeof eOrName === "string") {
      if (newValue === undefined) {
        return;
      }
      setFormData((prev) => (prev ? { ...prev, [eOrName]: newValue } : null));
      return;
    } else {
      const { name, value } = eOrName.target;

      const parsedValue =
        name === "stock"
          ? Number(value)
          : name === "msc"
            ? value === "true"
            : value;

      setFormData((prev) => (prev ? { ...prev, [name]: parsedValue } : null));
    }
  };

  const handleArrayChange = (name: string, newValues: string[]) => {
    setFormData((prev) => (prev ? { ...prev, [name]: newValues } : null));
  };

  const handleSave = async () => {
    if (!formData) return;

    try {
      if (formData.id) {
        await handleUpdateProduct(formData);
      } else {
        await handleCreateProduct(formData);
      }
      setIsEditing(false);
      navigate(-1); // Go back after saving
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error("Something went wrong while saving the product");
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
                url={
                  formData?.imageUrl ||
                  "https://raw.githubusercontent.com/dendenmuniz/assets/main/image_placeholder.png"
                }
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
      />
    ) : (
      <div className="tooltip tooltip-top" data-tip="Merchant ID">
        <span className="text-sm font-medium text-gray-700">
          {formData.merchantId}
        </span>
      </div>
    )
  }
  itemName={formData.name}
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
                  />
                  <ItemAttribute
                    attribute={
                      <span
                        className="tooltip tooltip-top"
                        data-tip="Multi-Sales Channel"
                      >
                        MSC
                      </span>
                    }
                    attributeValue={
                      isEditing ? (
                        String(formData?.msc)
                      ) : (
                        <div
                          className={`badge ${formData?.msc ? "badge-success" : "badge-ghost"}`}
                        >
                          {formData?.msc ? "Yes" : "No"}
                        </div>
                      )
                    }
                    name="msc"
                    isEditing={isEditing}
                    onChange={handleChange}
                  />
                  <ItemAttribute
                    attribute="Variant ID"
                    attributeValue={formData?.variantId || ""}
                    name="variantId"
                    isEditing={isEditing}
                    onChange={handleChange}
                  />
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
