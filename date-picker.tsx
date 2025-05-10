import { useState, useEffect, useMemo } from "react";
import { format, addDays, startOfDay } from "date-fns";
import { cn } from "@/lib/utils";

interface DateOption {
  date: Date;
  dayName: string;
  dayNumber: string;
  month: string;
}

interface DatePickerProps {
  onDateSelect: (date: Date) => void;
  selectedDate?: Date;
  numDays?: number;
}

export default function DatePicker({
  onDateSelect,
  selectedDate,
  numDays = 7,
}: DatePickerProps) {
  const today = startOfDay(new Date());

  // Generate date options for the next numDays days
  const dateOptions = useMemo(() => {
    return Array.from({ length: numDays }, (_, i) => {
      const date = addDays(today, i);
      return {
        date,
        dayName: format(date, "EEE"),
        dayNumber: format(date, "d"),
        month: format(date, "MMM"),
      };
    });
  }, [today, numDays]);

  const [selected, setSelected] = useState<Date | undefined>(
    selectedDate || dateOptions[0].date
  );

  useEffect(() => {
    if (!selected && dateOptions.length > 0) {
      setSelected(dateOptions[0].date);
      onDateSelect(dateOptions[0].date);
    }
  }, [dateOptions, selected, onDateSelect]);

  useEffect(() => {
    if (selectedDate) {
      setSelected(selectedDate);
    }
  }, [selectedDate]);

  const handleDateClick = (dateOption: DateOption) => {
    setSelected(dateOption.date);
    onDateSelect(dateOption.date);
  };

  return (
    <div className="overflow-x-auto scrollbar-hide">
      <div className="flex space-x-2 pb-2" style={{ minWidth: "max-content" }}>
        {dateOptions.map((dateOption) => (
          <button
            key={dateOption.date.toISOString()}
            className={cn(
              "flex flex-col items-center px-4 py-3 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/20 border-2 border-transparent",
              selected &&
                selected.getTime() === dateOption.date.getTime() &&
                "border-primary bg-primary/5"
            )}
            onClick={() => handleDateClick(dateOption)}
          >
            <span className="text-sm text-text-secondary">{dateOption.dayName}</span>
            <span className="text-lg font-bold">{dateOption.dayNumber}</span>
            <span className="text-sm text-text-secondary">{dateOption.month}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
