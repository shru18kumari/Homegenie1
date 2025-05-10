import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/use-auth";

export default function Header() {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/">
            <a className="flex items-center">
              <i className="ri-home-smile-fill text-primary text-2xl mr-2"></i>
              <span className="font-bold text-xl">
                <span className="text-primary">Home</span>
                <span className="text-indigo-600">Genie</span>
              </span>
            </a>
          </Link>
        </div>
        
        <div className="hidden md:flex items-center space-x-4">
          <Link href="/">
            <a className="px-4 py-2 rounded-md hover:bg-gray-100 transition font-medium">Home</a>
          </Link>
          <Link href="/book">
            <a className="px-4 py-2 rounded-md hover:bg-gray-100 transition font-medium">Book</a>
          </Link>
          <Link href="/customer-care">
            <a className="px-4 py-2 rounded-md hover:bg-gray-100 transition font-medium flex items-center">
              <i className="ri-customer-service-2-line mr-1"></i> Support
            </a>
          </Link>
        </div>
        
        <form className="relative hidden md:flex mx-4" onSubmit={(e) => {
          e.preventDefault();
          const searchInput = e.currentTarget.querySelector('input');
          if (searchInput && searchInput.value) {
            window.location.href = `/book?search=${encodeURIComponent(searchInput.value)}`;
          }
        }}>
          <div className="flex items-center bg-gray-100 rounded-full pl-4 pr-12 py-2">
            <i className="ri-search-line text-gray-500 mr-2"></i>
            <input 
              type="text" 
              placeholder="Search services or providers..." 
              className="bg-transparent outline-none w-64"
            />
          </div>
          <button 
            type="submit"
            className="absolute right-0 top-0 bottom-0 bg-primary hover:bg-primary/90 text-white rounded-full px-4 flex items-center justify-center transition-colors">
            <i className="ri-search-line"></i>
          </button>
        </form>
        
        <div className="flex items-center space-x-2">
          {isAuthenticated ? (
            <>
              <Button variant="ghost" size="icon" className="rounded-full">
                <i className="ri-notification-3-line text-xl"></i>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Avatar>
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {user?.fullName.split(' ').map(n => n[0]).join('').toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href="/profile">
                      <a className="w-full cursor-pointer">Profile</a>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <a className="cursor-pointer" onClick={() => logout()}>Log out</a>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost">Log in</Button>
              </Link>
              <Link href="/register">
                <Button>Sign up</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
