import { useState } from "react";

interface Props {
  attribute: React.ReactNode;
  values: string[];
  name: string;
  isEditing: boolean;
  onChange: (name: string, newValues: string[]) => void;
}

export const ItemAttributeArray = ({
  attribute,
  values,
  name,
  isEditing,
  onChange,
}: Props) => {
  const [inputValue, setInputValue] = useState("");

  const handleAdd = () => {
    const trimmed = inputValue.trim();
    if (trimmed && !values.includes(trimmed)) {
      onChange(name, [...values, trimmed]);
      setInputValue("");
    }
  };

  const handleRemove = (index: number) => {
    const updated = [...values];
    updated.splice(index, 1);
    onChange(name, updated);
  };

  return (
    <div className="border-b border-base-300 w-full ">
      <div className="flex flex-col gap-2 w-full">
        {isEditing ? (
          <>
            <div className="flex items-start justify-between gap-2 w-full">
              <fieldset className="fieldset w-full">
                <legend className="fieldset-legend ">{attribute}</legend>
                <input
                  type="text"
                  className="input input-sm input-bordered w-full"
                  name={name}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                />
                <span className="flex flex-wrap gap-2 mt-2">
                  {values.map((val, i) => (
                    <div key={i} className="badge badge-ghost badge-dismiss-dark gap-1">
                      {val}
                      <button
                        type="button"
                        className="inline-flex items-center p-1 ms-2 text-sm text-gray-400 bg-transparent rounded-xs hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-gray-300"
                        data-dismiss-target="#badge-dismiss-dark"
                        aria-label="Remove"
                        onClick={() => handleRemove(i)}
                      >
                        <svg
                          className="w-2 h-2"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 14 14"
                        >
                          <path
                            stroke="currentColor"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                          />
                        </svg>
                        <span className="sr-only">Remove badge</span>
                      </button>
                    </div>
                  ))}
                </span>
              </fieldset>

              <button
                type="button"
                className="btn btn-sm btn-outline self-start mt-[30px]" // aligns with input
                onClick={handleAdd}
              >
                Add
              </button>
            </div>
          </>
        ) : values.length > 0 ? (
          <fieldset className="fieldset w-full">
            <legend className="fieldset-legend">{attribute}</legend>
            <div className="flex flex-wrap justify-start gap-2">
              {values.map((val, i) => (
                <span key={i} className="badge badge-ghost text-sm">
                  {val}
                </span>
              ))}
            </div>
          </fieldset>
        ) : (
          <fieldset className="fieldset w-full">
            <legend className="fieldset-legend">{attribute}</legend>
            <span className="text-sm text-gray-300">N/A</span>
          </fieldset>
        )}
      </div>
    </div>
  );
};
