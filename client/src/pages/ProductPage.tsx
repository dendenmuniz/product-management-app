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

export const ProductPage = () => {
  const { handleUpdateProduct, handleCreateProduct } = useProducts();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { products } = useProductsContext();

  const product = products.find((p) => p.id === id);
  const isLoading = !product;
  const [isEditing, setIsEditing] = useState(false); // !product;
  const [formData, setFormData] = useState<Product | null>(product ?? null);

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => (prev ? { ...prev, [name]: value } : null));
  };

  const handleSave = async () => {
    if (!formData) return;

    try {
      if (formData.id) {
        await handleUpdateProduct(formData);
        toast.success("Product updated successfully");
      } else {
        await handleCreateProduct(formData);
        toast.success("Product created successfully");
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
              className="btn btn-sm btn-outline"
            >
              ← Back
            </button>
            <div className="flex ml-auto items-right ml-4">
            {isEditing ? (
              <>
                <button
                  className="btn btn-sm btn-outline ml-2"
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
                <button className="btn btn-sm btn-outline ml-2" onClick={handleSave}>
                  Save
                </button>
              </>
            ) : (
              <button
                className="btn btn-sm btn-outline ml-2"
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
            <div className="animate-pulse space-y-4">
              <div className="h-48 bg-base-300 rounded-lg" />
              <div className="grid grid-cols-2 gap-4 mt-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="h-6 bg-base-300 rounded w-full" />
                ))}
              </div>
              <div className="h-24 bg-base-300 rounded mt-6" />
            </div>
          ) : (
            <div className="md:flex items-start justify-center gap-8">
              <ItemImage
                alt={product.name}
                url={
                  product.imageUrl ||
                  "https://unsplash.com/photos/blue-and-black-nike-high-top-sneakers-BWPqHZBhMVA"
                }
              />

              <div className="flex-1 mt-6  md:mt-0">
                <ItemHeader
                  itemManufector={
                    <div className="tooltip tooltip-top" data-tip="Merchant ID">
                      <span className="text-sm font-medium text-gray-700">
                        {product.merchantId}
                      </span>
                    </div>
                  }
                  itemName={product.name}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
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
                      <div
                        className={`badge ${formData?.msc ? "badge-success" : "badge-ghost"}`}
                      >
                        {formData?.msc ? "Yes" : "No"}
                      </div>
                    }
                    name="msc"
                    isEditing={isEditing}
                    onChange={handleChange}
                  />
                  <ItemAttribute
                    attribute="Type"
                    attributeValue={formData?.productType}
                    name="productType"
                    isEditing={isEditing}
                    onChange={handleChange}
                  />
                  <ItemAttribute
                    attribute={
                      <span
                        className="tooltip tooltip-top"
                        data-tip="Internal grouping of products"
                      >
                        Group
                      </span>
                    }
                    attributeValue={formData?.productGroup}
                    name="productGroup"
                    isEditing={isEditing}
                    onChange={handleChange}
                  />
                  <ItemAttribute
                    attribute={
                      <span
                        className="tooltip tooltip-top"
                        data-tip="Product department code"
                      >
                        Department
                      </span>
                    }
                    attributeValue={formData?.department}
                    name="department"
                    isEditing={isEditing}
                    onChange={handleChange}
                  />
                </div>

                <div className="mt-6">
                  <ItemDescription description={formData?.description || ""} />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
