import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { Appointment } from "@shared/schema";
import AppointmentCard from "@/components/appointment-card";
import { Link } from "wouter";

export default function Profile() {
  const { user, isAuthenticated, logout, isLoading: authLoading } = useAuth();
  const [, navigate] = useLocation();

  // Redirect if not authenticated
  if (!isAuthenticated && !authLoading) {
    navigate("/login");
    return null;
  }

  // Fetch recent appointments
  const { data: appointments, isLoading: appointmentsLoading } = useQuery<Appointment[]>({
    queryKey: ["/api/appointments"],
    enabled: isAuthenticated,
  });

  // Get recent appointments
  const recentAppointments = appointments?.slice(0, 2);

  return (
    <main className="flex-grow container mx-auto px-4 py-6 pb-20 md:pb-6">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">Profile</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* User Info Card */}
        <div className="md:col-span-1">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-xl">Personal Information</CardTitle>
            </CardHeader>
            <CardContent>
              {authLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-6 w-1/2" />
                </div>
              ) : user ? (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-text-secondary">Full Name</h3>
                    <p className="mt-1">{user.fullName}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-text-secondary">Email</h3>
                    <p className="mt-1">{user.email}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-text-secondary">Username</h3>
                    <p className="mt-1">{user.username}</p>
                  </div>
                  {user.apartmentNumber && (
                    <div>
                      <h3 className="text-sm font-medium text-text-secondary">Apartment #</h3>
                      <p className="mt-1">{user.apartmentNumber}</p>
                    </div>
                  )}
                </div>
              ) : null}
              
              <div className="mt-6 pt-6 border-t">
                <Button 
                  variant="outline" 
                  onClick={() => logout()} 
                  className="w-full"
                >
                  Logout
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Recent Appointments */}
        <div className="md:col-span-2">
          <div className="mb-4 flex justify-between items-center">
            <h2 className="text-xl font-semibold">Recent Appointments</h2>
            <Link href="/history">
              <a className="text-primary font-medium hover:underline">View All</a>
            </Link>
          </div>
          
          {appointmentsLoading ? (
            Array(2).fill(0).map((_, i) => (
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
          ) : recentAppointments && recentAppointments.length > 0 ? (
            recentAppointments.map((appointment) => (
              <AppointmentCard key={appointment.id} appointment={appointment} />
            ))
          ) : (
            <div className="bg-white rounded-xl shadow-sm p-6 text-center">
              <p className="text-gray-500 mb-4">You don't have any appointments yet</p>
              <Link href="/book">
                <Button>Book an Appointment</Button>
              </Link>
            </div>
          )}
          
          <div className="mt-6">
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-xl">Account Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Button variant="outline" className="w-full">Change Password</Button>
                  <Button variant="outline" className="w-full">Notification Preferences</Button>
                  <Button variant="outline" className="w-full">Update Profile Information</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
