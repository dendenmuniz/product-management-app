export const ItemHeader = ({
  itemManufector,
  itemName,
}: {
  itemManufector: string;
  itemName: string;
}) => {
  return (
    <>
      <div className="border-b border-gray-200 pb-6">
        <p className="text-sm leading-none text-gray-600 ">{itemManufector}</p>
        <h1 className="lg:text-2xl text-xl font-semibold lg:leading-6 leading-7 text-gray-800 ">
          {itemName}
        </h1>
      </div>
    </>
  );
};
