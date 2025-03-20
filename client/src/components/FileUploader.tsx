import { ChangeEvent, FormEvent, useState } from "react";

import { useProducts } from "../hooks/useProducts";
import { useProductsContext } from "../context/ProductsContext";
import { Product } from "../@types/types";

export const FileUploader = () => {
  const { setFileInfo, fileName, uploadDate } = useProductsContext();
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { submitFileParsed } = useProducts();

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile && selectedFile.type === "application/json") {
      setFile(selectedFile);
      setError(null);
    } else {
      setError("Please upload a valid JSON file.");
      setFile(null);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError("No file selected.");
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const jsonData = JSON.parse(e.target?.result as string);
        const dateUpload = new Date().toLocaleString("en-GB", {
          timeZone: "UTC",
          hour12: false,
        });
        const newSupplies = {
          fileName: file.name,
          uploadDate: dateUpload,
          products: jsonData.map((product: Product) => ({
            ...product,
            MSC: false, // Set default value for MSC
          })),
        };

        await submitFileParsed(newSupplies);
        setFileInfo(file.name, dateUpload);
        setError(null);
      } catch (err) {
        setError(
          `Failed to parse file. Please upload a valid JSON file. Error: ${
            (err as Error).message
          }`
        );
      }
    };

    reader.readAsText(file);
  };

  return (
    <div className="bg-white px-3 py-8 mb-4 shadow-md rounded-md border m-4 md:m-0">
      <form
        className="block space-y-6 flex size-full md:size-auto "
        onSubmit={handleSubmit}>
        <div className="flex-initial w-96">
          <label className="inline-block text-gray-900 space-y-2">
            <span className="font-semibold">Upload your supplies</span>
            <input
              className="block w-full text-sm text-gray-800
            file:mr-4 file:py-2 file:px-2
            file:rounded-full file:border-0
            file:text-xs file:font-semibold
            file:bg-violet-50 file:text-violet-700
            hover:file:bg-violet-100"
              type="file"
              name="file"
              accept=".json"
              onChange={handleFileChange}
            />
          </label>
        </div>
        <div className="flex w-96 justify-end">
          <button
            className="inline-block bg-violet-500 hover:bg-violet-600 text-white rounded-lg px-4 py-2"
            type="submit">
            Upload
          </button>
        </div>
      </form>
      <div className="flex-initial w-96 pt-4">
        {error && <p style={{ color: "red" }}>{error}</p>}
        {fileName && (
          <>
            <p className="block text-gray-900">
              Last uploaded file:{" "}
              <span className="font-medium italic">{fileName}</span>{" "}
            </p>
            <p className="block text-gray-900">
              uploaded on{" "}
              <span className="font-medium italic">{uploadDate}</span>
            </p>
          </>
        )}
      </div>
    </div>
  );
};
