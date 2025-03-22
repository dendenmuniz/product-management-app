interface HeaderProps {
  sectionName: string;
}

export const Header = ({ sectionName }: HeaderProps) => {
  return (
    <header className="bg-white border-b shadow-sm sticky top-0 z-10">
      <div className="flex items-center justify-between px-6 py-4">
        <h1 className="text-2xl font-semibold text-gray-800">{sectionName}</h1>
        {/* Placeholder para futuro: avatar, logout, etc. */}
        {/* <div>Usuário / Logout</div> */}
      </div>
    </header>
  );
};
