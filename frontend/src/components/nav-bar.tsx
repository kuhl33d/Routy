import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useUserStore } from "@/stores/user.store";

export default function NavBar() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { user } = useUserStore();

  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2">
            <Home className="h-5 w-5" />
            <span className="font-semibold">KinderRide</span>
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-6">
          <Link
            to="/school"
            className="text-sm font-medium text-muted-foreground hover:text-primary"
          >
            School
          </Link>
          <Link
            to="/parent"
            className="text-sm font-medium text-muted-foreground hover:text-primary"
          >
            Parent
            {/* How it works */}
          </Link>
          <Link
            to="/driver"
            className="text-sm font-medium text-muted-foreground hover:text-primary"
          >
            Driver
          </Link>
          <Link
            to="/admin"
            className="text-sm font-medium text-muted-foreground hover:text-primary"
          >
            Admin
          </Link>
          <Link
            to="/home2"
            className="text-sm font-medium text-muted-foreground hover:text-primary"
          >
            Home2
          </Link>
          <Link to="/login">
            <Button variant="ghost" className="text-sm font-medium">
              You are {user?.role}
            </Button>
            <Button variant="ghost" className="text-sm font-medium">
              Your name {user?.name}
            </Button>
          </Link>
          <Link to="/login">
            <Button variant="ghost" className="text-sm font-medium">
              Log in
            </Button>
          </Link>
          <Link to="/signup">
            <Button className="bg-[#F7B32B] text-black hover:bg-[#F7B32B]/90">
              Sign up
            </Button>
          </Link>
          <Button
            className="bg-[#F7B32B] text-black hover:bg-[#F7B32B]/90"
            onClick={toggleDarkMode}
          >
            Toggle
          </Button>
        </nav>

        <div className="flex items-center gap-4"></div>
      </div>
    </header>
  );
}
