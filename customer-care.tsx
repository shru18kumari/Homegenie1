import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Footer from "@/components/footer";
import { useToast } from "@/hooks/use-toast";

export default function CustomerCare() {
  const { toast } = useToast();
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Message sent!",
      description: "Our team will get back to you within 24 hours.",
    });
    setContactForm({
      name: "",
      email: "",
      subject: "",
      message: ""
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        <div className="bg-gradient-to-b from-primary/10 to-primary/5 py-10">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl font-bold text-center mb-2">Customer Care</h1>
            <p className="text-xl text-center text-gray-600 mb-8">We're here to help you with any questions or concerns</p>
            
            <Tabs defaultValue="contact" className="w-full max-w-4xl mx-auto">
              <TabsList className="grid w-full grid-cols-3 mb-8">
                <TabsTrigger value="contact">Contact Us</TabsTrigger>
                <TabsTrigger value="faq">FAQ</TabsTrigger>
                <TabsTrigger value="support">Support</TabsTrigger>
              </TabsList>
              
              <TabsContent value="contact">
                <Card>
                  <CardHeader>
                    <CardTitle>Get in Touch</CardTitle>
                    <CardDescription>
                      Fill out the form below and our team will get back to you as soon as possible.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleContactSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label htmlFor="name" className="font-medium">Name</label>
                          <Input 
                            id="name" 
                            placeholder="Your name" 
                            value={contactForm.name}
                            onChange={e => setContactForm({...contactForm, name: e.target.value})}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="email" className="font-medium">Email</label>
                          <Input 
                            id="email" 
                            type="email" 
                            placeholder="Your email" 
                            value={contactForm.email}
                            onChange={e => setContactForm({...contactForm, email: e.target.value})}
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="subject" className="font-medium">Subject</label>
                        <Input 
                          id="subject" 
                          placeholder="How can we help?" 
                          value={contactForm.subject}
                          onChange={e => setContactForm({...contactForm, subject: e.target.value})}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="message" className="font-medium">Message</label>
                        <Textarea 
                          id="message" 
                          placeholder="Please provide details about your inquiry" 
                          rows={5}
                          value={contactForm.message}
                          onChange={e => setContactForm({...contactForm, message: e.target.value})}
                          required
                        />
                      </div>
                      <Button type="submit" size="lg" className="w-full">Send Message</Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="faq">
                <Card>
                  <CardHeader>
                    <CardTitle>Frequently Asked Questions</CardTitle>
                    <CardDescription>
                      Find answers to common questions about our services.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <h3 className="text-lg font-medium">How do I book a service?</h3>
                      <p className="text-gray-600">
                        You can book a service by navigating to the "Book" page, selecting your desired service category, 
                        choosing a service provider, selecting a date and time, and entering your service details.
                      </p>
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-lg font-medium">What payment methods do you accept?</h3>
                      <p className="text-gray-600">
                        We accept all major credit cards, debit cards, and digital wallets like Apple Pay and Google Pay.
                        Payment is processed securely through our platform.
                      </p>
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-lg font-medium">Can I reschedule or cancel a service?</h3>
                      <p className="text-gray-600">
                        Yes, you can reschedule or cancel a service up to 24 hours before the scheduled time without any penalty.
                        To do so, visit the "Appointments" page and select the appointment you wish to modify.
                      </p>
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-lg font-medium">Are your service providers vetted?</h3>
                      <p className="text-gray-600">
                        Yes, all our service providers undergo a thorough vetting process, including background checks,
                        license verification, and skills assessment to ensure they meet our quality standards.
                      </p>
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-lg font-medium">What if I'm not satisfied with the service?</h3>
                      <p className="text-gray-600">
                        We offer a satisfaction guarantee. If you're not happy with the service provided,
                        please contact our customer care team within 72 hours, and we'll work to resolve the issue or offer a refund.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="support">
                <Card>
                  <CardHeader>
                    <CardTitle>Support Options</CardTitle>
                    <CardDescription>
                      Choose the support option that works best for you.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="border rounded-lg p-6 text-center">
                        <div className="flex justify-center mb-4">
                          <i className="ri-phone-line text-4xl text-primary"></i>
                        </div>
                        <h3 className="text-lg font-medium mb-2">Phone Support</h3>
                        <p className="text-gray-600 mb-4">
                          Speak directly with our customer care team.
                        </p>
                        <p className="font-medium">(555) 123-4567</p>
                        <p className="text-sm text-gray-500">
                          Available Mon-Fri: 8am-8pm<br />
                          Sat-Sun: 9am-6pm
                        </p>
                      </div>
                      
                      <div className="border rounded-lg p-6 text-center">
                        <div className="flex justify-center mb-4">
                          <i className="ri-chat-1-line text-4xl text-primary"></i>
                        </div>
                        <h3 className="text-lg font-medium mb-2">Live Chat</h3>
                        <p className="text-gray-600 mb-4">
                          Chat with our support agents in real-time.
                        </p>
                        <Button variant="outline" className="w-full">
                          Start Chat
                        </Button>
                        <p className="text-sm text-gray-500 mt-2">
                          Available 24/7
                        </p>
                      </div>
                      
                      <div className="border rounded-lg p-6 text-center">
                        <div className="flex justify-center mb-4">
                          <i className="ri-mail-line text-4xl text-primary"></i>
                        </div>
                        <h3 className="text-lg font-medium mb-2">Email Support</h3>
                        <p className="text-gray-600 mb-4">
                          Send us an email and we'll respond within 24 hours.
                        </p>
                        <p className="font-medium">support@homegenie.com</p>
                        <p className="text-sm text-gray-500">
                          We aim to respond within 24 hours
                        </p>
                      </div>
                    </div>
                    
                    <div className="mt-8 border-t pt-6">
                      <h3 className="text-lg font-medium mb-4">Emergency Support</h3>
                      <p className="text-gray-600 mb-4">
                        For urgent matters requiring immediate assistance, please call our emergency support line.
                      </p>
                      <Button size="lg" variant="destructive">
                        <i className="ri-phone-line mr-2"></i> Call Emergency Support
                      </Button>
                      <p className="text-sm text-gray-500 mt-2">
                        (555) 987-6543 - Available 24/7 for urgent service issues
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}