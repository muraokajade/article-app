export const ArticleLayout = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="max-w-3xl mx-auto px-4 py-8 text-white">
    <h1 className="text-3xl font-bold mb-6 border-b border-gray-600 pb-2">
      {title}
    </h1>
    {children}
  </div>
);
