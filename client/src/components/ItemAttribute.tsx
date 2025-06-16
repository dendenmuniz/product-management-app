import React from "react";

export const ItemAttribute = ({
  attribute,
  attributeValue,
  name,
  isEditing = false,
  onChange,
  errorMessage,
}: {
  attribute: React.ReactNode;
  attributeValue: string | null | (string | null)[] | React.ReactNode;
  name?: string;
  isEditing?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  errorMessage?: string;
}) => {
  // Handle non-editable mode
  const renderContent = () => {
    if (React.isValidElement(attributeValue)) {
      return attributeValue;
    }

    if (attributeValue !== null && attributeValue !== "") {
      return <span className="text-sm">{String(attributeValue)}</span>;
    }

    return <span className="text-sm text-gray-300">N/A</span>;
  };

  return (
    <div className="pb-2 border-b border-base-300 flex items-start justify-between">
      <div className="flex flex-wrap items-center justify-end gap-2">
        {isEditing ? (
          <fieldset className="fieldset">
            <legend className="fieldset-legend">{attribute}</legend>
            <input
              type="text"
              className="input input-sm input-bordered w-full max-w-xs"
              name={name}
              value={attributeValue !== null ? String(attributeValue) : ""}
              onChange={onChange}
            />
            {errorMessage && (
              <p className="alert alert-error alert-soft text-sm text-error mt-1">{errorMessage}</p>
            )}
          </fieldset>
        ) : (
          <>
            <fieldset className="fieldset">
              <legend className="fieldset-legend">{attribute}</legend>
              {renderContent()}
            </fieldset>
          </>
        )}
      </div>
    </div>
  );
};
