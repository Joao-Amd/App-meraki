import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

export const NavLink = ({ to, children, className }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={cn(
        "px-4 py-2 rounded-md transition-colors",
        isActive
          ? "bg-primary text-primary-foreground"
          : "hover:bg-muted",
        className
      )}
    >
      {children}
    </Link>
  );
};