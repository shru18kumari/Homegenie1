import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import ServiceCard from "@/components/service-card";
import AppointmentCard from "@/components/appointment-card";
import PostCard from "@/components/post-card";
import ProviderCard from "@/components/provider-card";
import Footer from "@/components/footer";
import { ServiceCategory, Appointment, CommunityPost, ServiceProvider } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";

export default function Home() {
  const { user, isAuthenticated } = useAuth();

  // Fetch categories
  const { data: categories, isLoading: categoriesLoading } = useQuery<ServiceCategory[]>({
    queryKey: ["/api/categories"],
  });

  // Fetch appointments if authenticated
  const { data: appointments, isLoading: appointmentsLoading } = useQuery<Appointment[]>({
    queryKey: ["/api/appointments"],
    enabled: isAuthenticated,
  });

  // Fetch providers
  const { data: providers, isLoading: providersLoading } = useQuery<ServiceProvider[]>({
    queryKey: ["/api/providers"],
  });

  // Fetch community posts
  const { data: posts, isLoading: postsLoading } = useQuery<CommunityPost[]>({
    queryKey: ["/api/posts"],
  });

  return (
    <div className="min-h-screen flex flex-col">
      {/* Quote Banner */}
      <div className="bg-gradient-to-r from-primary/10 to-indigo-100 py-3 border-y border-gray-200">
        <div className="container mx-auto text-center">
          <p className="text-gray-700 font-medium italic flex items-center justify-center">
            <i className="ri-double-quotes-l text-primary mr-2 text-lg"></i>
            On-Demand Home Services at Your Fingertips
            <i className="ri-double-quotes-r text-primary ml-2 text-lg"></i>
          </p>
        </div>
      </div>
      
      <main className="flex-grow container mx-auto px-4 py-6">
        {/* Hero Section */}
        <section className="mb-8">
          <div className="rounded-xl overflow-hidden relative">
            <img 
              src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80" 
              alt="Modern apartment interior" 
              className="w-full h-64 md:h-96 object-cover" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex flex-col justify-end p-6 md:p-8">
              <h1 className="text-white text-2xl md:text-4xl font-bold mb-2">
                {isAuthenticated 
                  ? `Welcome back, ${user?.fullName.split(' ')[0]}` 
                  : "Welcome to HomeGenie"}
              </h1>
              <p className="text-white text-sm md:text-base mb-4">
                {isAuthenticated 
                  ? "Manage your home services and get help when you need it" 
                  : "Book appointments with trusted service professionals"}
              </p>
              <div className="flex flex-wrap gap-2">
                <Link href="/book">
                  <Button className="bg-primary hover:bg-primary/90 text-white flex items-center">
                    <i className="ri-calendar-line mr-2"></i> Book Appointment
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Special Offer Section */}
        {!isAuthenticated && (
          <section className="mb-8">
            <div className="bg-gradient-to-r from-amber-50 to-amber-100 border border-amber-200 rounded-xl p-5 shadow-sm">
              <div className="flex flex-col md:flex-row items-center">
                <div className="bg-gradient-to-br from-amber-500 to-orange-500 text-white p-4 rounded-full mb-4 md:mb-0 md:mr-6">
                  <i className="ri-gift-line text-3xl"></i>
                </div>
                <div className="text-center md:text-left md:flex-1">
                  <h3 className="text-xl font-bold text-amber-800 mb-1">Special Offer for New Users!</h3>
                  <p className="text-amber-700 mb-2">Register today and get <span className="font-bold">15% OFF</span> on your first service booking.</p>
                  <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                    <span className="inline-flex items-center bg-white px-3 py-1 rounded-full border border-amber-200 font-mono text-amber-800 text-sm">
                      <span className="mr-2">Use code:</span>
                      <span className="font-bold">WELCOME15</span>
                    </span>
                    <Link href="/register">
                      <Button variant="default" size="sm" className="bg-amber-600 hover:bg-amber-700">Sign Up Now</Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Services */}
        <section className="mb-10">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Services</h2>
            <Link href="/book">
              <a className="text-primary font-medium hover:underline flex items-center">
                View All <i className="ri-arrow-right-line ml-1"></i>
              </a>
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {categoriesLoading ? (
              Array(8).fill(0).map((_, i) => (
                <div key={i} className="flex flex-col items-center">
                  <Skeleton className="w-12 h-12 rounded-full mb-3" />
                  <Skeleton className="h-4 w-20" />
                </div>
              ))
            ) : (
              categories?.map((category) => (
                <ServiceCard key={category.id} category={category} isLink />
              ))
            )}
          </div>
        </section>

        {/* Upcoming Appointments (only show if authenticated) */}
        {isAuthenticated && (
          <section className="mb-10">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Upcoming Appointments</h2>
              <Link href="/appointments">
                <a className="text-primary font-medium hover:underline">View All</a>
              </Link>
            </div>
            
            {appointmentsLoading ? (
              Array(2).fill(0).map((_, i) => (
                <div key={i} className="bg-white rounded-xl shadow-sm p-4 mb-4">
                  <div className="flex items-start">
                    <Skeleton className="h-12 w-12 rounded-lg mr-4" />
                    <div className="flex-grow">
                      <Skeleton className="h-6 w-40 mb-2" />
                      <Skeleton className="h-4 w-full max-w-md mb-2" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                  </div>
                </div>
              ))
            ) : appointments && appointments.length > 0 ? (
              appointments.slice(0, 2).map((appointment) => (
                <AppointmentCard key={appointment.id} appointment={appointment} />
              ))
            ) : (
              <div className="bg-white rounded-xl shadow-sm p-6 text-center">
                <p className="text-gray-500 mb-4">You don't have any upcoming appointments</p>
                <Link href="/book">
                  <Button>Book an Appointment</Button>
                </Link>
              </div>
            )}
          </section>
        )}

        {/* Service Providers */}
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4">Top Service Providers</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {providersLoading ? (
              Array(3).fill(0).map((_, i) => (
                <div key={i} className="bg-white rounded-xl shadow-sm overflow-hidden">
                  <Skeleton className="w-full h-40" />
                  <div className="p-4">
                    <Skeleton className="h-6 w-40 mb-2" />
                    <Skeleton className="h-4 w-full mb-4" />
                    <Skeleton className="h-8 w-full rounded-lg" />
                  </div>
                </div>
              ))
            ) : (
              providers?.slice(0, 3).map((provider) => (
                <ProviderCard key={provider.id} provider={provider} />
              ))
            )}
          </div>
        </section>

        {/* Testimonials */}
        <section className="mb-10 bg-gradient-to-r from-primary-50 to-blue-50 py-8 px-4 rounded-xl">
          <h2 className="text-xl font-bold mb-6 text-center">What Our Customers Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-5 rounded-lg shadow-sm">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden mr-3">
                  <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80" alt="Testimonial" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="font-semibold">Amit Sharma</h4>
                  <div className="flex text-yellow-400 text-sm">
                    <i className="ri-star-fill"></i>
                    <i className="ri-star-fill"></i>
                    <i className="ri-star-fill"></i>
                    <i className="ri-star-fill"></i>
                    <i className="ri-star-fill"></i>
                  </div>
                </div>
              </div>
              <p className="text-gray-600">"Kumar Electrical fixed my air conditioning in just one hour. Very professional service and reasonable rates. Highly recommended!"</p>
            </div>
            
            <div className="bg-white p-5 rounded-lg shadow-sm">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden mr-3">
                  <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80" alt="Testimonial" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="font-semibold">Priya Patel</h4>
                  <div className="flex text-yellow-400 text-sm">
                    <i className="ri-star-fill"></i>
                    <i className="ri-star-fill"></i>
                    <i className="ri-star-fill"></i>
                    <i className="ri-star-fill"></i>
                    <i className="ri-star-half-fill"></i>
                  </div>
                </div>
              </div>
              <p className="text-gray-600">"Raj Plumbing Services helped me with a major leak emergency. They arrived within 30 minutes and fixed everything perfectly. Great service!"</p>
            </div>
            
            <div className="bg-white p-5 rounded-lg shadow-sm">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden mr-3">
                  <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80" alt="Testimonial" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="font-semibold">Rajesh Verma</h4>
                  <div className="flex text-yellow-400 text-sm">
                    <i className="ri-star-fill"></i>
                    <i className="ri-star-fill"></i>
                    <i className="ri-star-fill"></i>
                    <i className="ri-star-fill"></i>
                    <i className="ri-star-line"></i>
                  </div>
                </div>
              </div>
              <p className="text-gray-600">"Sharma Painting did a wonderful job repainting my entire apartment. They were punctual, clean, and the results exceeded my expectations."</p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
