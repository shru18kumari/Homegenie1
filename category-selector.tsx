import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import ServiceCard from "@/components/service-card";
import { ServiceCategory } from "@shared/schema";

interface CategorySelectorProps {
  onCategorySelect: (categoryId: number) => void;
  selectedCategoryId?: number;
}

export default function CategorySelector({
  onCategorySelect,
  selectedCategoryId,
}: CategorySelectorProps) {
  const { data: categories, isLoading } = useQuery<ServiceCategory[]>({
    queryKey: ["/api/categories"],
  });

  const [selectedId, setSelectedId] = useState<number | undefined>(selectedCategoryId);

  useEffect(() => {
    if (selectedCategoryId) {
      setSelectedId(selectedCategoryId);
    }
  }, [selectedCategoryId]);

  const handleCategoryClick = (categoryId: number) => {
    setSelectedId(categoryId);
    onCategorySelect(categoryId);
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-gray-100 rounded-lg p-4 animate-pulse h-28"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {categories?.map((category) => (
        <ServiceCard
          key={category.id}
          category={category}
          isSelected={selectedId === category.id}
          onClick={() => handleCategoryClick(category.id)}
        />
      ))}
    </div>
  );
}
