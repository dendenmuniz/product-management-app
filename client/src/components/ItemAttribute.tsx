import React from "react";

export const ItemAttribute = ({
  attribute,
  attributeValue,
}: {
  attribute: React.ReactNode;
  attributeValue: string | null | (string | null)[] | React.ReactNode;
}) => {
  // Function to split and filter sizes
  function splitAndFilter(input: string): string[] {
    const resultArray = input.split("/");
    return resultArray.filter((item) => item !== "");
  }

  let filteredArray: string[] = [];

  if (Array.isArray(attributeValue)) {
    filteredArray = attributeValue.filter(
      (item) => item !== null && item !== ""
    ) as string[];
  } else if (typeof attributeValue === "string") {
    filteredArray = splitAndFilter(attributeValue);
  }

  if (filteredArray.length === 0 && typeof attributeValue === "string") {
    filteredArray = [attributeValue];
  }

  return (
    <div className="py-2 border-b border-base-300 flex items-start justify-between">
      <p className="text-sm font-semibold text-gray-700">{attribute}</p>

      <div className="flex flex-wrap items-center justify-end gap-2">
        {React.isValidElement(attributeValue) ? (
          attributeValue
        ) : filteredArray.length > 0 ? (
          filteredArray.map((item, index) => (
            <span key={index} className="badge badge-ghost text-sm">
              {item}
            </span>
          ))
        ) : (
          <span className="text-sm text-gray-500">N/A</span>
        )}
      </div>
    </div>
  );
};
