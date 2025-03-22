export const Card = ({
  children,
  bg = "bg-gray-50",
  classN = "p-6 rounded-lg shadow-md",
}: {
  children: React.ReactNode;
  bg?: string;
  classN?: string;
}) => {
  return <div className={`${bg} ${classN}`}>{children}</div>;
};
