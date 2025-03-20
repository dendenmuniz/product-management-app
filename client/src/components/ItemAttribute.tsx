export const ItemAttribute = ({
  attribute,
  attributeValue,
}: {
  attribute: string;
  attributeValue: string | null | (string | null)[];
}) => {
  // Function to split and filter sizes
  function splitAndFilter(input: string): string[] {
    const resultArray: string[] = input.split("/");
    const filteredArray: string[] = resultArray.filter((item) => item !== "");
    return filteredArray;
  }

  let filteredArray: string[] = [];
  if (Array.isArray(attributeValue)) {
    // If attributeList is an array, filter it directly
    filteredArray = attributeValue.filter(
      (item) => item !== null && item !== ""
    ) as string[];
  } else if (typeof attributeValue === "string") {
    // If attributeList is a string, split and filter it
    filteredArray = splitAndFilter(attributeValue);
  }

  if (filteredArray.length === 0 && typeof attributeValue === "string") {
    filteredArray = [attributeValue]; // Treat the single string as an array
  }

  return (
    <>
      <div className="py-2 border-b border-gray-200 flex items-center justify-between">
        <p className="text-base leading-4 text-gray-800 ">{attribute}</p>
        <div className="flex items-center justify-center">
          {filteredArray.length > 0 ? (
            filteredArray.map((size, index) => (
              <p
                key={index}
                className="text-sm leading-none text-gray-600 mr-3">
                {size}
              </p>
            ))
          ) : (
            <p className="text-sm leading-none text-gray-600">N/A</p>
          )}
        </div>
      </div>
    </>
  );
};
