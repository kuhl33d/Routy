import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUserStore } from "@/stores/user.store";
import { toast } from "react-hot-toast";
// import axios from "@/lib/axios";

const schema = z
  .object({
    email: z.string().email({ message: "Invalid email address" }).optional(),
    phoneNumber: z.string().optional(),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters" }),
  })
  .refine((data) => data.email || data.phoneNumber, {
    message: "Either email or phone number is required",
    path: ["email", "phoneNumber"],
  });

type FormFields = z.infer<typeof schema>;

export default function LoginPage() {
  const { login } = useUserStore();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormFields>({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    try {
      // setError(null);
      login(data);
      console.log(data);
      navigate("/");

      // Call your login API
      // const response = await axios.post("/auth/login", {
      //   email: data.email,
      //   phoneNumber: data.phoneNumber,
      //   password: data.password,
      // });

      // if (response.data.success) {
      //   // Store the token
      //   const { token, user } = response.data;
      //   authLogin(token, user);

      //   // Ensure userLogin completes before proceeding
      //   await userLogin(data);
      //   console.log(data);

      //   // Show success message
      //   toast.success("Logged in successfully");

      //   // Redirect based on user role (optional)
      //   // if (user.role === 'admin') {
      //   //   navigate('/admin');
      //   // } else if (user.role === 'school') {
      //   //   navigate('/school');
      //   // } else if (user.role === 'parent') {
      //   //   navigate('/parent');
      //   // } else {
      //   //   navigate('/dashboard');
      //   // }

      //   // Ensure navbar reload happens after userLogin and console.log
      //   window.location.href = "/";
      // }
      //  else {
      //   throw new Error(response.data.message || "Login failed");
      // }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || err.message || "Login failed";
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md space-y-8">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold">Welcome to KinderRide</h1>
            {error && <p className="text-red-500 text-sm">{error}</p>}
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                placeholder="Enter your email"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                id="phoneNumber"
                placeholder="Enter your phone number"
                {...register("phoneNumber")}
              />
              {errors.phoneNumber && (
                <p className="text-red-500 text-sm">
                  {errors.phoneNumber.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                {...register("password")}
              />
              {errors.password && (
                <p className="text-red-500 text-sm">
                  {errors.password.message}
                </p>
              )}
            </div>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#F7B32B] text-black hover:bg-[#F7B32B]/90"
            >
              {isSubmitting ? "Logging in..." : "Log in"}
            </Button>
          </form>
          <div className="space-y-4 text-center text-sm">
            <Link
              to="/forgot-password"
              className="text-muted-foreground hover:text-[#F7B32B] block"
            >
              Forgot Password?
            </Link>
            <Link
              to="/signup"
              className="text-muted-foreground hover:text-[#F7B32B] block"
            >
              Don&apos;t have an account? Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
