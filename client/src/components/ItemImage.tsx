export const ItemImage = ({ alt, url }: { alt: string; url: string }) => {
  return (
    <>
      <div className="xl:w-2/6 lg:w-2/5 w-80 md:block hidden">
        <img className="w-full" alt={alt} src={url} />
      </div>
      <div className="md:hidden">
        <img className="w-full" alt={alt} src={url} />
      </div>
    </>
  );
};
