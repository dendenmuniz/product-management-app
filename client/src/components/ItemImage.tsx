export const ItemImage = ({ alt, url }: { alt: string; url: string }) => {
  return (
    <div className="w-full max-w-xs md:max-w-sm lg:max-w-md xl:max-w-lg mx-auto">
      <img
        src={url}
        alt={alt}
        loading="lazy"
        className="w-full rounded-lg shadow-md ring-1 ring-base-200"
      />
    </div>
  );
};
