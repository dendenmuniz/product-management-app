import { ChangeEvent, FormEvent, useState } from "react";

import { useProducts } from "../hooks/useProducts";
import { useProductsContext } from "../context/ProductsContext";
import { Product } from "../@types/types";

export const FileUploader = () => {
  const { setFileInfo, fileName, uploadDate } = useProductsContext();
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { submitFileParsed } = useProducts();

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile && selectedFile.type === "application/json") {
      setFile(selectedFile);
      setError(null);
      setSuccess(null); // limpa estado de sucesso
    } else {
      setError("Please upload a valid JSON file.");
      setFile(null);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSuccess(null);
    if (!file) {
      setError("No file selected.");
      return;
    }

    setLoading(true);

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
            msc: false,
          })),
        };

        await submitFileParsed(newSupplies);
        setFileInfo(file.name, dateUpload);
        setError(null);
        setSuccess("File uploaded successfully!");
      } catch (err) {
        setError(
          `Failed to parse file. Please upload a valid JSON file. Error: ${
            (err as Error).message
          }`
        );
      } finally {
        setLoading(false);
      }
    };

    reader.readAsText(file);
  };

  return (
    <div >
      <div className="bg-base-100 p-6 space-y-4 w-full">
        <h2 className="card-title">Upload your supplies</h2>
        <form className="flex justify-between gap-4" onSubmit={handleSubmit}>
          <input
            type="file"
            name="file"
            accept=".json"
            onChange={handleFileChange}
            className="file-input file-input-bordered file-input-primary w-full max-w-xs"
          />

          <button type="submit" className="btn btn-primary">
            {loading && <span className="loading loading-spinner loading-sm mr-2" />}
            Upload
          </button>
        </form>

        <div className="text-sm pt-2 space-y-2">
          {error && <div className="alert alert-error shadow-sm text-sm">{error}</div>}
          {success && <div className="alert alert-success shadow-sm text-sm">{success}</div>}

          {fileName && (
            <div className="space-y-1">
              <p>
                <span className="font-semibold">Last uploaded file:</span>{" "}
                <span className="italic">{fileName}</span>
              </p>
              <p>
                <span className="font-semibold">Uploaded on:</span>{" "}
                <span className="italic">{uploadDate}</span>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
