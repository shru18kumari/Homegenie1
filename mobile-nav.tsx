import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";

export default function MobileNav() {
  const [location] = useLocation();

  const navItems = [
    { href: "/", icon: "ri-home-4-line", label: "Home" },
    { href: "/book", icon: "ri-calendar-line", label: "Book" },
    { href: "/appointments", icon: "ri-file-list-3-line", label: "Appointments" },
    { href: "/customer-care", icon: "ri-customer-service-2-line", label: "Support" },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white shadow-lg z-40">
      <div className="flex justify-around py-2">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href}>
            <a className={cn(
              "flex flex-col items-center p-2",
              location === item.href ? "text-primary" : "text-gray-500"
            )}>
              <i className={`${item.icon} text-xl`}></i>
              <span className="text-xs mt-1">{item.label}</span>
            </a>
          </Link>
        ))}
      </div>
    </div>
  );
}
