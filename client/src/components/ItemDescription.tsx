import { useState } from "react";

export const ItemDescription = ({ description }: { description: string }) => {
  const [showFullDescription, setShowFullDescription] = useState<boolean>(false);

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
          const label = cells[0]?.textContent?.trim() || "";
          const value = cells[1]?.textContent?.trim() || "";
          formattedLines.push(`${label} ${value}`);
        }
      });
    }

    const specificationsText = formattedLines.join("\n");

    if (textContent.includes("Specifications")) {
      textContent = textContent.replace(/Specifications[\s\S]*/i, "").trim();
    }

    return `${textContent}\n\nSpecifications:\n${specificationsText}`;
  }

  const descriptionText = cleanProductDescription(description || "");

  const displayDescription = showFullDescription
    ? descriptionText
    : descriptionText.substring(0, 200) + "...";

  return (
    <div className="w-full mt-8">
      <h2 className="text-lg font-semibold mb-2 text-base-content">
        Description
      </h2>
      <div className="prose max-w-none whitespace-pre-wrap text-sm text-base-content/80 mb-4">
        {displayDescription}
      </div>
      <button
        className="btn btn-sm btn-link text-primary"
        onClick={() => setShowFullDescription((prev) => !prev)}
      >
        {showFullDescription ? "Show less" : "Show more"}
      </button>
    </div>
  );
};
