import React from "react";

export const ItemAttribute = ({
  attribute,
  attributeValue,
  name,
  isEditing = false,
  onChange,
  
}: {
  attribute: React.ReactNode;
  attributeValue: string | null | (string | null)[] | React.ReactNode;
  name?: string;
  isEditing?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => {

  // Function to split and filter sizes
  function splitAndFilter(input: string): string[] {
    const resultArray = input.split("/");
    return resultArray.filter((item) => item !== "");
  }

  // Normalize input
  let filteredArray: (string | number | boolean)[] = [];

  if (Array.isArray(attributeValue)) {
    filteredArray = attributeValue.filter(
      (item) => item !== null && item !== ""
    ) as string[];
  } else if (typeof attributeValue === "string") {
    filteredArray = splitAndFilter(attributeValue);
  }

   // Handle non-editable mode
   const renderContent = () => {
    if (React.isValidElement(attributeValue)) {
      return attributeValue;
    }

    if (filteredArray.length > 0) {
      return filteredArray.map((item, i) => (
        <span key={i} className="badge badge-ghost text-sm">
          {item}
        </span>
      ));
    }

    if (attributeValue !== null && attributeValue !== "") {
      return <span className="text-sm">{String(attributeValue)}</span>;
    }

    return <span className="text-sm text-gray-500">N/A</span>;
  };

  return (
    <div className="pb-2 border-b border-base-300 flex items-start justify-between">
      

      <div className="flex flex-wrap items-center justify-end gap-2">
      {isEditing ? (
        <fieldset className="fieldset">
          <legend className="fieldset-legend">{attribute}</legend>
          <input type="text" className="input input-sm input-bordered w-full max-w-xs" name={name}
             value={attributeValue !== null ? String(attributeValue) : ""}
             onChange={onChange}/>
        </fieldset>
          // <input
          //   type="text"
          //   name={name}
          //   value={attributeValue !== null ? String(attributeValue) : ""}
          //   onChange={onChange}
          //   className="input input-sm input-bordered w-full max-w-xs"
          // />
        ) : (
          <>
            <p className="text-sm font-semibold text-gray-700">{attribute}</p>
            {renderContent()}
          </>
        )}
      </div>
    </div>
  );
};
