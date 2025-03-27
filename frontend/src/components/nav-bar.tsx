import { Button } from "@/components/ui/button";
import { Home, LogOut, Moon, Sun } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "@/components/AuthProvider";

export default function NavBar() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

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

  const handleLogout = () => {
    logout();
    // navigate('/');
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
          {/* Public Links */}
          <Link
            to="/"
            className="text-sm font-medium text-muted-foreground hover:text-primary"
          >
            Home
          </Link>

          {/* Authenticated Links */}
          {isAuthenticated && (
            <>
              {/* Show links based on user role */}
              {user?.role === 'admin' && (
                <>
                  <Link
                    to="/admin"
                    className="text-sm font-medium text-muted-foreground hover:text-primary"
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/school"
                    className="text-sm font-medium text-muted-foreground hover:text-primary"
                  >
                    School Dashboard
                  </Link>
                  <Link
                    to="/parent"
                    className="text-sm font-medium text-muted-foreground hover:text-primary"
                  >
                    Parent Dashboard
                  </Link>
                  <Link
                    to="/tracking"
                    className="text-sm font-medium text-muted-foreground hover:text-primary"
                  >
                    Track Child
                  </Link>
                  <Link
                  to="/driver"
                  className="text-sm font-medium text-muted-foreground hover:text-primary"
                  >
                    Driver Dashboard
                  </Link>
                </>
              )}

              {user?.role === 'school' && (
                <Link
                  to="/school"
                  className="text-sm font-medium text-muted-foreground hover:text-primary"
                >
                  School Dashboard
                </Link>
              )}

              {user?.role === 'parent' && (
                <>
                  <Link
                    to="/parent"
                    className="text-sm font-medium text-muted-foreground hover:text-primary"
                  >
                    Parent Dashboard
                  </Link>
                  <Link
                    to="/tracking"
                    className="text-sm font-medium text-muted-foreground hover:text-primary"
                  >
                    Track Child
                  </Link>
                </>
              )}

              {user?.role === 'driver' && (
                <Link
                  to="/driver"
                  className="text-sm font-medium text-muted-foreground hover:text-primary"
                >
                  Driver Dashboard
                </Link>
              )}
            </>
          )}

          {/* Auth Buttons */}
          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <>
                <div className="flex items-center gap-2 px-4 py-2 rounded-md bg-gray-100 dark:bg-gray-800">
                  <span className="text-sm font-medium">
                    {user?.name} ({user?.role})
                  </span>
                </div>
                <Button
                  variant="ghost"
                  className="text-sm font-medium"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <>
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
              </>
            )}

            {/* Theme Toggle Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleDarkMode}
              className="w-10 h-10"
            >
              {isDarkMode ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
          </div>
        </nav>

        {/* Mobile Menu Button (you can add mobile menu implementation) */}
        <div className="md:hidden">
          <Button variant="ghost" size="icon">
            <span className="sr-only">Open menu</span>
            {/* Add your menu icon here */}
          </Button>
        </div>
      </div>
    </header>
  );
}