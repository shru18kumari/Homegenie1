import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t mt-auto">
      <div className="container mx-auto py-8 px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <i className="ri-home-smile-fill text-primary text-2xl mr-2"></i>
              <span className="font-bold text-xl">
                <span className="text-primary">Home</span>
                <span className="text-indigo-600">Genie</span>
              </span>
            </div>
            <p className="text-gray-600 mb-4">
              Your trusted partner for home services. Quality work, guaranteed satisfaction.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-500 hover:text-primary">
                <i className="ri-facebook-fill text-xl"></i>
              </a>
              <a href="#" className="text-gray-500 hover:text-primary">
                <i className="ri-twitter-fill text-xl"></i>
              </a>
              <a href="#" className="text-gray-500 hover:text-primary">
                <i className="ri-instagram-line text-xl"></i>
              </a>
              <a href="#" className="text-gray-500 hover:text-primary">
                <i className="ri-linkedin-fill text-xl"></i>
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">Services</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-600 hover:text-primary">Plumbing</a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-primary">Electrical</a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-primary">Cleaning</a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-primary">Painting</a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-primary">Pest Control</a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-primary">Home Renovation</a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/">
                  <a className="text-gray-600 hover:text-primary">Home</a>
                </Link>
              </li>
              <li>
                <Link href="/book">
                  <a className="text-gray-600 hover:text-primary">Book Service</a>
                </Link>
              </li>
              <li>
                <Link href="/community">
                  <a className="text-gray-600 hover:text-primary">Community</a>
                </Link>
              </li>
              <li>
                <Link href="/customer-care">
                  <a className="text-gray-600 hover:text-primary">Support</a>
                </Link>
              </li>
              <li>
                <Link href="/about-us">
                  <a className="text-gray-600 hover:text-primary">About Us</a>
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">Contact</h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <i className="ri-phone-line text-primary mt-1 mr-2"></i>
                <span className="text-gray-600">+91 1800-2000-100</span>
              </li>
              <li className="flex items-start">
                <i className="ri-whatsapp-line text-primary mt-1 mr-2"></i>
                <span className="text-gray-600">+91 9876543210</span>
              </li>
              <li className="flex items-start">
                <i className="ri-mail-line text-primary mt-1 mr-2"></i>
                <span className="text-gray-600">support@homegenie.in</span>
              </li>
              <li className="flex items-start">
                <i className="ri-time-line text-primary mt-1 mr-2"></i>
                <span className="text-gray-600">Mon-Sat: 9am-7pm<br />Sun: 10am-5pm</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-600 mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} HomeGenie. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <a href="#" className="text-gray-600 hover:text-primary">Privacy Policy</a>
            <a href="#" className="text-gray-600 hover:text-primary">Terms of Service</a>
            <a href="#" className="text-gray-600 hover:text-primary">FAQ</a>
          </div>
        </div>
      </div>
    </footer>
  );
}