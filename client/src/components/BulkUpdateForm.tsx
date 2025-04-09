import { useEffect, useState } from "react";
import { Product } from "../@types/types";

export const BulkUpdateForm = ({
  selectedRows,
  onSubmit,
}: {
  selectedRows: number[];
  onSubmit: (updates: Partial<Pick<Product, "msc" | "price">>) => void;
}) => {
  const [allowUpdate, setAllowUpdate] = useState(false);
  const [price, setPrice] = useState<string | null>(null);
  const [dropdownMsc, setDropdownMsc] = useState<string>();
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if ((price || dropdownMsc) && selectedRows.length > 0) {
      setAllowUpdate(true);
    } else {
      setAllowUpdate(false);
    }
  }, [price, dropdownMsc, selectedRows]);

  const handleSubmit = async () => {
    setLoading(true);
    setSuccess(null);

    const msc: Partial<Pick<Product, "msc">> =
      dropdownMsc === "false"
        ? { msc: false }
        : dropdownMsc === ""
        ? {}
        : { msc: true };
    const priceUpdate: Partial<Pick<Product, "price">> = price ? { price } : {};

    try {
      await onSubmit({ ...msc, ...priceUpdate });
      setSuccess("Products updated successfully!");
    } finally {
      setLoading(false);
      setPrice(null);
      setDropdownMsc("");
      setAllowUpdate(false);
    }
  };

  return (
    <section>
      <div className="bg-base-100 gap-4 p-6 mb-4 shadow-md rounded-xl border m-4 md:m-0">
        <form className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
          {/* MSC Select */}
          <div className="form-control w-full max-w-xs">
            <label className="label" htmlFor="msc">
              <span className="label-text flex gap-1 items-center">
                MSC
                <div className="tooltip tooltip-top" data-tip="Mark product as available on Multi-Sales Channel">
                  <span className="text-info cursor-help">🛈</span>
                </div>
              </span>
            </label>
            <select
              id="msc"
              name="msc"
              className="select select-bordered"
              value={dropdownMsc}
              onChange={(e) => setDropdownMsc(e.target.value)}
            >
              <option value=""></option>
              <option value="false">No</option>
              <option value="true">Yes</option>
            </select>
          </div>

          {/* Price Input */}
          <div className="form-control w-full max-w-xs">
            <label className="label" htmlFor="price">
              <span className="label-text">Price</span>
            </label>
            <input
              type="text"
              id="price"
              name="price"
              className="input input-bordered"
              placeholder="Whole Price"
              value={price ?? ""}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>

          {/* Submit Button */}
          <div className="form-control">
            <button
              type="button"
              className="btn btn-primary"
              disabled={!allowUpdate || loading}
              onClick={handleSubmit}
            >
              {loading && <span className="loading loading-spinner loading-sm mr-2" />}
              Update Products
            </button>
          </div>
        </form>

        {/* Success Message */}
        {success && (
          <div className="alert alert-success mt-6 shadow-sm text-sm">
            {success}
          </div>
        )}
      </div>
    </section>
  );
};
