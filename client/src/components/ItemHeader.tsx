export const ItemHeader = ({
  itemManufector,
  itemName,
}: {
  itemManufector:  React.ReactNode;
  itemName: string;
}) => {
  return (
    <div className="border-b border-base-300 pb-6 mb-4">
      <p className="label-text">{itemManufector}</p>
      <h1 className="text-2xl font-bold text-base-content tracking-wide">
        {itemName}
      </h1>
    </div>
  );
};
