import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import Footer from "@/components/footer";

export default function AboutUs() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="mb-10">
          <div className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-xl overflow-hidden relative p-8 md:p-12">
            <div className="max-w-3xl">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">About HomeGenie</h1>
              <p className="text-gray-600 text-lg">Your trusted partner for all home services across India</p>
            </div>
          </div>
        </section>

        {/* Our Story */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Our Story</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <p className="text-gray-600 mb-4">
                Founded in 2023, HomeGenie was born from a simple idea: to make home services hassle-free for homeowners across India. 
                In a country where finding reliable service professionals can be challenging, we set out to build a platform that connects 
                homeowners with skilled and verified experts for all their home service needs.
              </p>
              <p className="text-gray-600 mb-4">
                Starting with just a handful of service providers in Bangalore, we've now expanded to major cities across India, 
                offering a wide range of services from plumbing and electrical work to home renovation and smart home installations.
              </p>
              <p className="text-gray-600">
                Our mission is to transform how Indians access home services by leveraging technology to make the process 
                transparent, reliable, and convenient, while empowering local service professionals with a platform to grow their business.
              </p>
            </div>
            <div className="bg-gray-100 rounded-xl p-6">
              <h3 className="text-xl font-semibold mb-4 text-primary">Our Values</h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <i className="ri-check-line text-primary mt-1 mr-2 text-lg"></i>
                  <div>
                    <h4 className="font-medium">Trust & Reliability</h4>
                    <p className="text-gray-600 text-sm">Every service provider on our platform is thoroughly vetted and verified to ensure quality service.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <i className="ri-check-line text-primary mt-1 mr-2 text-lg"></i>
                  <div>
                    <h4 className="font-medium">Customer Satisfaction</h4>
                    <p className="text-gray-600 text-sm">We prioritize your satisfaction with prompt service and transparent pricing.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <i className="ri-check-line text-primary mt-1 mr-2 text-lg"></i>
                  <div>
                    <h4 className="font-medium">Professionalism</h4>
                    <p className="text-gray-600 text-sm">Our service providers are trained to deliver professional service with courtesy and respect.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <i className="ri-check-line text-primary mt-1 mr-2 text-lg"></i>
                  <div>
                    <h4 className="font-medium">Innovation</h4>
                    <p className="text-gray-600 text-sm">We constantly innovate to make home services more accessible and convenient.</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="mb-12 bg-gray-50 rounded-xl p-8">
          <h2 className="text-2xl font-bold mb-6 text-center">Why Choose HomeGenie?</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="bg-primary/10 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <i className="ri-verified-badge-fill text-primary text-xl"></i>
              </div>
              <h3 className="font-semibold mb-2">Verified Professionals</h3>
              <p className="text-gray-600 text-sm">All our service providers undergo rigorous background checks and skill verification.</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="bg-primary/10 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <i className="ri-24-hours-fill text-primary text-xl"></i>
              </div>
              <h3 className="font-semibold mb-2">24/7 Availability</h3>
              <p className="text-gray-600 text-sm">We offer round-the-clock services for emergencies and urgent needs.</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="bg-primary/10 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <i className="ri-price-tag-3-fill text-primary text-xl"></i>
              </div>
              <h3 className="font-semibold mb-2">Transparent Pricing</h3>
              <p className="text-gray-600 text-sm">Clear upfront pricing with no hidden charges or surprises.</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="bg-primary/10 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <i className="ri-shield-check-fill text-primary text-xl"></i>
              </div>
              <h3 className="font-semibold mb-2">Service Guarantee</h3>
              <p className="text-gray-600 text-sm">We stand behind our work with a satisfaction guarantee on all services.</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="bg-primary/10 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <i className="ri-customer-service-2-fill text-primary text-xl"></i>
              </div>
              <h3 className="font-semibold mb-2">Dedicated Support</h3>
              <p className="text-gray-600 text-sm">Our customer support team is always ready to assist you with any queries.</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="bg-primary/10 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <i className="ri-team-fill text-primary text-xl"></i>
              </div>
              <h3 className="font-semibold mb-2">Growing Community</h3>
              <p className="text-gray-600 text-sm">Join thousands of satisfied customers across India who trust HomeGenie.</p>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="mb-10">
          <div className="bg-gradient-to-r from-primary to-blue-600 rounded-xl overflow-hidden relative p-8 text-white">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to experience hassle-free home services?</h2>
              <p className="mb-6">Join thousands of satisfied customers across India who trust HomeGenie for their home service needs.</p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link href="/book">
                  <Button className="bg-white text-primary hover:bg-gray-100">Book a Service</Button>
                </Link>
                <Link href="/register">
                  <Button variant="outline" className="border-white text-white hover:bg-white/10">Sign Up</Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}