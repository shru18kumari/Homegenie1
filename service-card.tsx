import { Link } from "wouter";
import { ServiceCategory } from "@shared/schema";
import { cn } from "@/lib/utils";

interface ServiceCardProps {
  category: ServiceCategory;
  isSelected?: boolean;
  onClick?: () => void;
  isLink?: boolean;
}

export default function ServiceCard({ 
  category, 
  isSelected = false, 
  onClick, 
  isLink = false 
}: ServiceCardProps) {
  const content = (
    <div 
      className={cn(
        "flex flex-col items-center",
        isLink ? "bg-white hover:shadow-md transition rounded-xl p-4 shadow-sm" : 
                "bg-gray-50 hover:bg-primary/5 rounded-lg p-4 transition border-2 border-transparent hover:border-primary/20 focus:border-primary focus:outline-none",
        isSelected && "border-primary bg-primary/5"
      )}
      onClick={onClick}
    >
      <div className={`w-12 h-12 rounded-full bg-${category.color}/10 flex items-center justify-center mb-${isLink ? '3' : '2'}`}>
        <i className={`ri-${category.icon} text-xl text-${category.color}`}></i>
      </div>
      <span className="text-center font-medium">{category.name}</span>
    </div>
  );

  if (isLink) {
    return (
      <Link href={`/book?category=${category.id}`}>
        <a>{content}</a>
      </Link>
    );
  }

  return content;
}
