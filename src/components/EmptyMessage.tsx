export const EmptyMessage = ({
  icon,
  title,
}: {
  icon: string;
  title: string;
}) => {
  return (
    <div className="w-full flex flex-col justify-center items-center text-center text-muted-foreground py-8">
      <div className="text-4xl mb-4 opacity-50">{icon}</div>
      <p>{title}</p>
    </div>
  );
};
