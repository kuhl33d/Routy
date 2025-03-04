import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, Bell, Users, UserCircle, Building2, Car } from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero Section - Full width */}
      <section className="relative h-[600px] w-full flex items-center justify-center">
        <img
          src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fimages.vexels.com%2Fmedia%2Fusers%2F3%2F155560%2Fraw%2F792fd524109799c5e9d86b22d5246c47-travelling-school-bus-illustration.jpg"
          alt="School bus illustration"
          className="w-full h-full object-cover brightness-[0.7] absolute inset-0"
          loading="eager" // This replaces the priority prop
        />
        <div className="container relative z-10 text-center px-4">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-8">
            The easiest way to track student transportation
          </h1>
          <Button className="bg-[#F7B32B] text-black hover:bg-[#F7B32B]/90 text-lg px-8">
            See how it works
          </Button>
        </div>
      </section>

      {/* Features Grid */}
      <section className="w-full py-16">
        <div className="container">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="pt-6">
                <Clock className="h-8 w-8 mb-4 text-[#F7B32B]" />
                <h3 className="font-semibold mb-2">Real-time tracking</h3>
                <p className="text-muted-foreground">
                  Locate your students on their route
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <Clock className="h-8 w-8 mb-4 text-[#F7B32B]" />
                <h3 className="font-semibold mb-2">Predictive arrival times</h3>
                <p className="text-muted-foreground">
                  Know when your bus will arrive, not just when it's supposed to
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <Bell className="h-8 w-8 mb-4 text-[#F7B32B]" />
                <h3 className="font-semibold mb-2">Customized notifications</h3>
                <p className="text-muted-foreground">
                  Get alerts for delays, accidents, or other disruptions
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <Users className="h-8 w-8 mb-4 text-[#F7B32B]" />
                <h3 className="font-semibold mb-2">
                  Easy parent and admin access
                </h3>
                <p className="text-muted-foreground">
                  Use our app to view student routes and transportation history
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* User Types Section - Full width */}
      <section className="w-full py-16 bg-gray-50 dark:bg-gray-800">
        <div className="container">
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="pt-6">
                <UserCircle className="h-8 w-8 mb-4 text-[#F7B32B]" />
                <h3 className="font-semibold mb-2">For parents</h3>
                <p className="text-muted-foreground">
                  Easy-to-use app for tracking your child's bus in real time
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <Building2 className="h-8 w-8 mb-4 text-[#F7B32B]" />
                <h3 className="font-semibold mb-2">For schools</h3>
                <p className="text-muted-foreground">
                  Manage your entire fleet from a single platform
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <Car className="h-8 w-8 mb-4 text-[#F7B32B]" />
                <h3 className="font-semibold mb-2">For drivers</h3>
                <p className="text-muted-foreground">
                  Get the info you need to drive safely and efficiently
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="w-full py-16">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">How it works</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <UserCircle className="h-12 w-12 mx-auto mb-4 text-[#F7B32B]" />
              <h3 className="font-semibold mb-2">Parents</h3>
              <p className="text-muted-foreground">
                Download the KinderRide app and sign up
              </p>
            </div>
            <div className="text-center">
              <Building2 className="h-12 w-12 mx-auto mb-4 text-[#F7B32B]" />
              <h3 className="font-semibold mb-2">Schools</h3>
              <p className="text-muted-foreground">Contact us to get started</p>
            </div>
            <div className="text-center">
              <Car className="h-12 w-12 mx-auto mb-4 text-[#F7B32B]" />
              <h3 className="font-semibold mb-2">Drivers</h3>
              <p className="text-muted-foreground">
                Follow the instructions in the app to start tracking
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
