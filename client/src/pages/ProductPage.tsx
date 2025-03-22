//import { useParams } from "react-router-dom";

import { Header } from "../components/Header";
import { ItemImage } from "../components/ItemImage";
import { ItemHeader } from "../components/ItemHeader";
import { ItemAttribute } from "../components/ItemAttribute";
import { ItemDescription } from "../components/ItemDescription";
import { useProductsContext } from "../context/ProductsContext";
import { useParams } from "react-router-dom";
export const ProductPage = () => {
  const { id } = useParams<{ id: string }>();
  const { products } = useProductsContext();

  const product = products.find((product) => product.id === Number(id));

  if (!product) {
    return (
      <section className="bg-violet-50">
        <Header sectionName="Product Details" />
        <div className="container m-auto py-20">
          <div className="bg-white p-4 rounded-lg shadow-md border m-4 md:m-0">
            <p className="text-center text-lg">Product not found.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-violet-50">
      <Header sectionName="Product Details" />
      <div className="container m-auto py-20">
        <div className="bg-white p-4 rounded-lg shadow-md rounded-md border m-4 md:m-0">
          <div className="bg-gray-50 md:flex items-start justify-center py-12 2xl:px-20 md:px-6 px-4">
            <ItemImage alt={product.product_name} url={product.image_url} />

            <div className="xl:w-2/5 md:w-1/2 lg:ml-8 md:ml-6 md:mt-0 mt-6">
              <ItemHeader
                itemManufector={product.merchant_id}
                itemName={product.product_name}
              />
              <ItemAttribute
                attribute="Model"
                attributeValue={product.supplier_model_number}
              />
              <ItemAttribute attribute="Size" attributeValue={product.size} />
              <ItemAttribute
                attribute="Quantity"
                attributeValue={product.quantity.toString()}
              />
              <ItemAttribute
                attribute="Vendor"
                attributeValue={product.vendor}
              />
              <ItemAttribute attribute="Price" attributeValue={product.price} />
              <ItemAttribute
                attribute="MSC"
                attributeValue={
                  product?.MSC !== undefined ? product.MSC.toString() : "false"
                }
              />
              <ItemAttribute
                attribute="Type"
                attributeValue={product.product_type}
              />
              <ItemAttribute
                attribute="Group"
                attributeValue={product.product_group}
              />
              <ItemAttribute
                attribute="Department"
                attributeValue={product.department}
              />
              <ItemDescription description={product.product_description} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
