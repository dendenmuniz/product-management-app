import { useEffect, useState } from "react";
import { Product } from "../@types/types";

export const BulkUpdateForm = ({
  selectedRows,
  onSubmit,
}: {
  selectedRows: number[];
  onSubmit: (updates: Partial<Pick<Product, "MSC" | "price">>) => void;
}) => {
  const [allowUpdate, setAllowUpdate] = useState<boolean>(false);
  const [price, setPrice] = useState<string | null>(null);
  const [dropdownMsc, setDropdownMsc] = useState<string>();

  useEffect(() => {
    if ((price || dropdownMsc) && selectedRows) {
      setAllowUpdate(true);
    } else {
      setAllowUpdate(false);
    }
  }, [price, dropdownMsc, selectedRows]);

  const handleSubmit = () => {
    setPrice(null);
    setDropdownMsc(undefined);
    setAllowUpdate(false);
    const msc: Partial<Pick<Product, "MSC">> =
      dropdownMsc === "false"
        ? { MSC: false }
        : dropdownMsc === ""
          ? {}
          : { MSC: true };
    const priceUpdate: Partial<Pick<Product, "price">> = price ? { price } : {};

    onSubmit({ ...msc, ...priceUpdate });
    setAllowUpdate(false);
    setPrice(null);
    setDropdownMsc("");
  };

  return (
    <section>
      <div className="bg-white gap-4 px-6 py-8 mb-4 shadow-md rounded-md border m-4 md:m-0">
        <form className="grid grid-cols-3">
          <div className="mb-4 w-48">
            <label htmlFor="msc" className="block text-gray-700 mb-2">
              MSC
            </label>
            <select
              id="msc"
              name="msc"
              className="border rounded w-full py-2 px-3"
              value={dropdownMsc}
              onChange={(e) => setDropdownMsc(e.target.value)}
            >
              <option value=""></option>
              <option value="false">No</option>
              <option value="true">Yes</option>
            </select>
          </div>

          <div className="mb-4 w-48">
            <label htmlFor="price" className="block text-gray-700 mb-2">
              Price
            </label>
            <input
              type="text"
              id="price"
              name="price"
              className="border rounded w-full py-2 px-3 mb-2"
              placeholder="Whole Price"
              value={price ?? ""}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>
          <div className="inline-block items-center py-6">
            <button
              className={`${
                !allowUpdate ? "opacity-25" : "opacity-100"
              } inline-block bg-violet-500 hover:bg-violet-600 text-white rounded-lg px-4 py-2`}
              type="button"
              disabled={!allowUpdate}
              onClick={handleSubmit}
            >
              Update Products
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};
