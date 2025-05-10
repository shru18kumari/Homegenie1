import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface TimeSlot {
  value: string;
  label: string;
  disabled?: boolean;
}

const DEFAULT_TIME_SLOTS: TimeSlot[] = [
  { value: "9:00 AM - 11:00 AM", label: "9:00 AM" },
  { value: "10:00 AM - 12:00 PM", label: "10:00 AM" },
  { value: "11:00 AM - 1:00 PM", label: "11:00 AM" },
  { value: "1:00 PM - 3:00 PM", label: "1:00 PM" },
  { value: "2:00 PM - 4:00 PM", label: "2:00 PM" },
  { value: "3:00 PM - 5:00 PM", label: "3:00 PM", disabled: true },
];

interface TimePickerProps {
  onTimeSelect: (time: string) => void;
  selectedTime?: string;
  timeSlots?: TimeSlot[];
}

export default function TimePicker({
  onTimeSelect,
  selectedTime,
  timeSlots = DEFAULT_TIME_SLOTS,
}: TimePickerProps) {
  const [selected, setSelected] = useState<string | undefined>(selectedTime);

  useEffect(() => {
    // Select the first available time slot by default if none selected
    if (!selected && timeSlots.length > 0) {
      const firstAvailable = timeSlots.find(slot => !slot.disabled);
      if (firstAvailable) {
        setSelected(firstAvailable.value);
        onTimeSelect(firstAvailable.value);
      }
    }
  }, [timeSlots, selected, onTimeSelect]);

  useEffect(() => {
    if (selectedTime) {
      setSelected(selectedTime);
    }
  }, [selectedTime]);

  const handleTimeClick = (timeSlot: TimeSlot) => {
    if (timeSlot.disabled) return;
    
    setSelected(timeSlot.value);
    onTimeSelect(timeSlot.value);
  };

  return (
    <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
      {timeSlots.map((timeSlot, index) => (
        <button
          key={index}
          className={cn(
            "py-2 px-3 text-center rounded-lg border hover:border-primary/30 hover:bg-primary/5 focus:outline-none focus:ring-2 focus:ring-primary/20",
            selected === timeSlot.value && "bg-primary text-white border-primary",
            timeSlot.disabled && "border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed hover:bg-gray-100 hover:border-gray-300"
          )}
          onClick={() => handleTimeClick(timeSlot)}
          disabled={timeSlot.disabled}
        >
          {timeSlot.label}
        </button>
      ))}
    </div>
  );
}
