import { ReactNode } from "react";

interface PageHeaderProps {
    icon?: ReactNode;
    title?: string;
    subtitle?: string;
    children?: ReactNode;
}

const PageHeader = ({ icon, title, subtitle, children }: PageHeaderProps) => {
    return (
        <div className="w-full px-4 py-8">
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                    {icon && (
                        <div className="p-2 bg-primary/10 rounded-lg">
                            {icon}
                        </div>
                    )}
                    <div>
                        {title && <h1 className="text-3xl font-bold text-foreground">{title}</h1>}
                        {subtitle && <p className="text-muted-foreground">{subtitle}</p>}
                        {children}
                    </div>
                </div>
            </div>
        </div>

    );
};

export default PageHeader;
