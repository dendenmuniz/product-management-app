import { useState } from "react";

export const ItemDescription = ({ description }: { description: string }) => {
  const [showFullDescription, setShowFullDescription] =
    useState<boolean>(false);

  function cleanProductDescription(html: string): string {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    let textContent = doc.body.textContent || "";
    const formattedLines: string[] = [];

    const table = doc.querySelector("table#spectable");
    if (table) {
      const rows = table.querySelectorAll("tr");
      rows.forEach((row) => {
        const cells = row.querySelectorAll("td");
        if (cells.length >= 2) {
          // Ensure there are at least two cells
          const label = cells[0]?.textContent?.trim() || "";
          const value = cells[1]?.textContent?.trim() || "";
          formattedLines.push(`${label} ${value}`);
        }
      });
    } else {
      console.warn("No specifications table found.");
    }

    const specificationsText = formattedLines.join("\n");
    // Check if "Specifications" is in the textContent
    if (textContent.includes("Specifications")) {
      // Remove "Specifications" from textContent
      textContent = textContent.replace(/Specifications[\s\S]*/i, "").trim();
    }

    return `${textContent}\n\nSpecifications:\n${specificationsText}`;
  }

  const descriptionText = cleanProductDescription(description || "");

  const displayDescription = showFullDescription
    ? descriptionText
    : descriptionText.substring(0, 90) + "...";

  if (!showFullDescription) {
    description = description.substring(0, 90) + "...";
  }
  return (
    <div className="w-full py-2">
      <p className="text-base leading-4 text-gray-800 ">Description</p>
      <div className="text-base lg:leading-tight leading-normal text-gray-600 mt-7">
        {displayDescription.split("\n").map((line, index) => (
          <span key={index}>
            {line}
            <br />
          </span>
        ))}
      </div>
      <button
        className="text-violet-400 mb-5 hover:text-violet-700"
        onClick={() => setShowFullDescription((prevState) => !prevState)}>
        {showFullDescription ? "Less" : "More"}
      </button>
    </div>
  );
};
