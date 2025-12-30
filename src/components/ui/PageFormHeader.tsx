interface PageFormHeaderProps {
  title: string;
  subtitle?: string;
}

const PageFormHeader = ({ title, subtitle }: PageFormHeaderProps) => {
  return (
    <div className="mb-8">
      <h1 className="text-4xl font-bold text-foreground">{title}</h1>
      {subtitle && (
        <p className="text-muted-foreground mt-2">{subtitle}</p>
      )}
    </div>
  );
};

export default PageFormHeader;
