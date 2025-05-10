import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import AppointmentCard from "@/components/appointment-card";
import { Appointment } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";
import { Link, useLocation } from "wouter";

export default function History() {
  const { isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState("all");

  // Redirect if not authenticated
  if (!isAuthenticated) {
    navigate("/login");
    return null;
  }

  // Fetch appointments
  const { data: appointments, isLoading } = useQuery<Appointment[]>({
    queryKey: ["/api/appointments"],
  });

  // Filter appointments based on active tab
  const filteredAppointments = appointments?.filter(appointment => {
    if (activeTab === "all") return true;
    return appointment.status === activeTab;
  });

  return (
    <main className="flex-grow container mx-auto px-4 py-6 pb-20 md:pb-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl md:text-3xl font-bold">Appointment History</h1>
        <Link href="/book">
          <Button>Book New</Button>
        </Link>
      </div>
      
      <Tabs defaultValue="all" onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="confirmed">Confirmed</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab}>
          {isLoading ? (
            Array(3).fill(0).map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm p-4 mb-4">
                <div className="flex items-start">
                  <Skeleton className="h-12 w-12 rounded-lg mr-4" />
                  <div className="flex-grow">
                    <Skeleton className="h-6 w-64 mb-2" />
                    <Skeleton className="h-4 w-full max-w-md mb-2" />
                    <Skeleton className="h-4 w-40" />
                  </div>
                  <div className="flex flex-col items-end">
                    <Skeleton className="h-6 w-20 mb-2" />
                    <Skeleton className="h-8 w-24" />
                  </div>
                </div>
              </div>
            ))
          ) : filteredAppointments && filteredAppointments.length > 0 ? (
            filteredAppointments.map((appointment) => (
              <AppointmentCard key={appointment.id} appointment={appointment} />
            ))
          ) : (
            <div className="bg-white rounded-xl shadow-sm p-6 text-center">
              <p className="text-gray-500 mb-4">No {activeTab === "all" ? "" : activeTab} appointments found</p>
              <Link href="/book">
                <Button>Book an Appointment</Button>
              </Link>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </main>
  );
}
