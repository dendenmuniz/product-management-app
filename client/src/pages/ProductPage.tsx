import { useParams, useNavigate } from "react-router-dom";
import { useProductsContext } from "../context/ProductsContext";
import { ItemImage } from "../components/ItemImage";
import { ItemHeader } from "../components/ItemHeader";
import { ItemAttribute } from "../components/ItemAttribute";
import { ItemDescription } from "../components/ItemDescription";

export const ProductPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { products } = useProductsContext();

  const product = products.find((p) => p.id === id);
  const isLoading = !product;

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
          </div>
          <h3 className="text-2xl font-semibold mb-6 text-center">Product Details</h3>

          {isLoading ? (
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
              <ItemImage alt={product.name} url={product.imageUrl || ""} />

              <div className="flex-1 mt-6 md:mt-0">
                <ItemHeader
                  itemManufector={
                    <div className="tooltip tooltip-top" data-tip="Merchant ID">
                      <span className="text-sm font-medium text-gray-700">{product.merchantId}</span>
                    </div>
                  }
                  itemName={product.name}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <ItemAttribute
                    attribute={
                      <span className="tooltip tooltip-top" data-tip="Supplier's model number">
                        Model
                      </span>
                    }
                    attributeValue={product.supplierModelNumber}
                  />
                  <ItemAttribute attribute="Size" attributeValue={product.size} />
                  <ItemAttribute attribute="Quantity" attributeValue={product.stock} />
                  <ItemAttribute attribute="Vendor" attributeValue={product.vendor} />
                  <ItemAttribute attribute="Price" attributeValue={product.price} />
                  <ItemAttribute
                    attribute={
                      <span className="tooltip tooltip-top" data-tip="Multi-Sales Channel">
                        MSC
                      </span>
                    }
                    attributeValue={
                      <div className={`badge ${product.msc ? "badge-success" : "badge-ghost"}`}>
                        {product.msc ? "Yes" : "No"}
                      </div>
                    }
                  />
                  <ItemAttribute attribute="Type" attributeValue={product.productType} />
                  <ItemAttribute
                    attribute={
                      <span className="tooltip tooltip-top" data-tip="Internal grouping of products">
                        Group
                      </span>
                    }
                    attributeValue={product.productGroup}
                  />
                  <ItemAttribute
                    attribute={
                      <span className="tooltip tooltip-top" data-tip="Product department code">
                        Department
                      </span>
                    }
                    attributeValue={product.department}
                  />
                </div>

                <div className="mt-6">
                  <ItemDescription description={product.description || ''} />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
