import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "wouter";
import { Appointment } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";
import { format } from "date-fns";
import Footer from "@/components/footer";

type AppointmentWithDetails = Appointment & {
  provider?: {
    id: number;
    name: string;
    imageUrl?: string;
  };
  category?: {
    id: number;
    name: string;
    icon?: string;
  };
};

export default function Appointments() {
  const { isAuthenticated, user } = useAuth();
  const [activeTab, setActiveTab] = useState("upcoming");

  const { data: appointments, isLoading } = useQuery<AppointmentWithDetails[]>({
    queryKey: ["/api/appointments"],
    enabled: isAuthenticated,
  });

  // Filter appointments based on active tab
  const filteredAppointments = appointments?.filter(appointment => {
    if (activeTab === "upcoming") {
      return ["pending", "confirmed"].includes(appointment.status);
    } else if (activeTab === "completed") {
      return appointment.status === "completed";
    } else if (activeTab === "cancelled") {
      return appointment.status === "cancelled";
    }
    return true;
  });

  const statusColorMap = {
    pending: "bg-yellow-100 text-yellow-800",
    confirmed: "bg-blue-100 text-blue-800",
    completed: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col">
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="text-center py-16">
            <h1 className="text-3xl font-bold mb-4">Please Log In</h1>
            <p className="text-gray-600 mb-8">You need to be logged in to view your appointments.</p>
            <Link href="/login">
              <Button size="lg">Log In</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        <div className="bg-gradient-to-b from-primary/10 to-primary/5 py-10">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold mb-2">My Appointments</h1>
                <p className="text-gray-600">Manage and track all your service appointments</p>
              </div>
              <Link href="/book">
                <Button className="mt-4 md:mt-0">
                  <i className="ri-add-line mr-2"></i> Book New Service
                </Button>
              </Link>
            </div>
            
            <Tabs defaultValue="upcoming" value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3 md:w-auto md:inline-grid mb-8">
                <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
                <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
              </TabsList>
              
              <TabsContent value={activeTab}>
                {isLoading ? (
                  <div className="grid grid-cols-1 gap-6">
                    {[1, 2, 3].map((_, index) => (
                      <Card key={index} className="bg-white/50 animate-pulse h-40"></Card>
                    ))}
                  </div>
                ) : filteredAppointments && filteredAppointments.length > 0 ? (
                  <div className="grid grid-cols-1 gap-6">
                    {filteredAppointments.map((appointment) => (
                      <Card key={appointment.id} className="overflow-hidden">
                        <CardContent className="p-0">
                          <div className="flex flex-col md:flex-row">
                            {appointment.provider?.imageUrl && (
                              <div className="w-full md:w-48 h-40 bg-gray-100">
                                <img 
                                  src={appointment.provider.imageUrl} 
                                  alt={appointment.provider.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            )}
                            <div className="p-6 flex-1">
                              <div className="flex flex-col md:flex-row justify-between mb-2">
                                <div>
                                  <h3 className="text-xl font-semibold">
                                    {appointment.provider?.name || 'Service Provider'}
                                  </h3>
                                  <p className="text-gray-600">
                                    {appointment.category?.name || 'Service'}
                                  </p>
                                </div>
                                <Badge className={statusColorMap[appointment.status as keyof typeof statusColorMap] || "bg-gray-100"}>
                                  {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                                </Badge>
                              </div>
                              
                              <div className="mt-4 flex flex-wrap gap-4">
                                <div>
                                  <p className="text-sm text-gray-500">Date</p>
                                  <p className="font-medium">
                                    {format(new Date(appointment.date), 'MMMM d, yyyy')}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-500">Time</p>
                                  <p className="font-medium">{appointment.timeSlot}</p>
                                </div>
                              </div>
                              
                              <p className="mt-4 text-gray-700 line-clamp-2">{appointment.description}</p>
                              
                              <div className="mt-4 flex flex-wrap gap-2">
                                {appointment.status === "pending" && (
                                  <>
                                    <Button variant="outline" size="sm">
                                      <i className="ri-calendar-event-line mr-2"></i> Reschedule
                                    </Button>
                                    <Button variant="outline" size="sm" className="text-red-600 border-red-200 hover:bg-red-50">
                                      <i className="ri-close-line mr-2"></i> Cancel
                                    </Button>
                                  </>
                                )}
                                {appointment.status === "confirmed" && (
                                  <>
                                    <Button variant="outline" size="sm">
                                      <i className="ri-message-3-line mr-2"></i> Contact Provider
                                    </Button>
                                    <Button variant="outline" size="sm" className="text-red-600 border-red-200 hover:bg-red-50">
                                      <i className="ri-close-line mr-2"></i> Cancel
                                    </Button>
                                  </>
                                )}
                                {appointment.status === "completed" && (
                                  <Button variant="outline" size="sm">
                                    <i className="ri-star-line mr-2"></i> Leave Review
                                  </Button>
                                )}
                                <Button variant="ghost" size="sm">
                                  <i className="ri-more-2-fill"></i>
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardHeader className="text-center py-10">
                      <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <i className="ri-calendar-line text-2xl text-gray-400"></i>
                      </div>
                      <CardTitle>No {activeTab} appointments found</CardTitle>
                      <CardDescription>
                        {activeTab === "upcoming" 
                          ? "You don't have any upcoming appointments. Book a new service to get started." 
                          : activeTab === "completed" 
                            ? "You don't have any completed appointments yet." 
                            : "You don't have any cancelled appointments."}
                      </CardDescription>
                      {activeTab === "upcoming" && (
                        <div className="mt-6">
                          <Link href="/book">
                            <Button>
                              <i className="ri-add-line mr-2"></i> Book New Service
                            </Button>
                          </Link>
                        </div>
                      )}
                    </CardHeader>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}