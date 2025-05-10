import { Appointment, ServiceProvider, ServiceCategory } from "@shared/schema";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { format } from "date-fns";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface AppointmentWithDetails extends Appointment {
  provider?: ServiceProvider;
  category?: ServiceCategory;
}

interface AppointmentCardProps {
  appointment: AppointmentWithDetails;
}

export default function AppointmentCard({ appointment }: AppointmentCardProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

  const statusColorMap: Record<string, string> = {
    pending: "warning",
    confirmed: "primary",
    completed: "success",
    cancelled: "destructive",
  };

  const statusColor = statusColorMap[appointment.status] || "secondary";

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      const res = await apiRequest("PATCH", `/api/appointments/${id}/status`, { status });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/appointments"] });
      toast({
        title: "Appointment updated",
        description: "The appointment status has been updated",
      });
      setIsUpdating(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update appointment",
        variant: "destructive",
      });
      setIsUpdating(false);
    },
  });

  const confirmAppointment = () => {
    setIsUpdating(true);
    updateStatusMutation.mutate({ id: appointment.id, status: "confirmed" });
  };

  const cancelAppointment = () => {
    setIsUpdating(true);
    updateStatusMutation.mutate({ id: appointment.id, status: "cancelled" });
  };

  const rescheduleAppointment = () => {
    // In a real app, this would open a reschedule dialog
    toast({
      title: "Reschedule",
      description: "Reschedule functionality would open a dialog here",
    });
  };

  const formatDate = (dateString: Date | string) => {
    const date = new Date(dateString);
    return format(date, "E, MMM d");
  };

  return (
    <div className={`bg-white rounded-xl shadow-sm p-4 mb-4 border-l-4 border-${statusColor}`}>
      <div className="flex items-start">
        <div className={`bg-${appointment.category?.color || 'primary'}/10 rounded-lg p-3 mr-4`}>
          <i className={`ri-${appointment.category?.icon || 'tools-line'} text-xl text-${appointment.category?.color || 'primary'}`}></i>
        </div>
        <div className="flex-grow">
          <h3 className="font-semibold text-lg">
            {appointment.category?.name || "Service"} with {appointment.provider?.name || "Provider"}
          </h3>
          <p className="text-text-secondary mb-2">{appointment.description}</p>
          <div className="flex items-center text-text-secondary text-sm">
            <i className="ri-calendar-line mr-1"></i>
            <span>{formatDate(appointment.date)}, {appointment.timeSlot}</span>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <Badge variant={statusColor === "primary" ? "default" : "outline"} className={`bg-${statusColor}/10 text-${statusColor}`}>
            {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
          </Badge>
          
          {appointment.status === "pending" && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={confirmAppointment} 
              disabled={isUpdating}
              className="mt-2"
            >
              {isUpdating ? "Updating..." : "Confirm"}
            </Button>
          )}
          
          {appointment.status === "confirmed" && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={rescheduleAppointment}
              className="mt-2"
            >
              Reschedule
            </Button>
          )}
          
          {(appointment.status === "pending" || appointment.status === "confirmed") && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={cancelAppointment} 
              disabled={isUpdating}
              className="mt-2 text-destructive hover:text-destructive"
            >
              Cancel
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
