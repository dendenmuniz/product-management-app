import { useState } from "react";

export const ItemImage = ({
  alt,
  url,
  isEditing,
  onChange,
}: {
  alt: string;
  url: string;
  isEditing?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => {
  const [hasError, setHasError] = useState(false);

  const displayUrl = hasError
    ? "https://raw.githubusercontent.com/dendenmuniz/assets/main/image_placeholder.png"
    : url;

  return (
    <div className="w-full max-w-xs md:max-w-sm lg:max-w-md xl:max-w-lg mx-auto text-lef">
      <img
        src={displayUrl}
        alt={alt}
        loading="lazy"
        className="w-full rounded-lg shadow-md ring-1 ring-base-200 mb-2"
        onError={() => setHasError(true)}
      />
      {isEditing && onChange && (
        
        
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Image URL</legend>
          <input
            id="imageUrl"
            type="text"
            name="imageUrl"
            value={url}
            onChange={onChange}
            className="input input-sm input-bordered w-full"
            placeholder="Enter image URL"
          />
          </fieldset>
        
      )}
    </div>
  );
};
