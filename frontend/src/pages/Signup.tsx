import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Link } from "react-router-dom";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUserStore } from "@/stores/user.store";

const schema = z
  .object({
    name: z
      .string()
      .min(3, { message: "Name must at least 3 characters" })
      .max(50),
    role: z.string().min(1, { message: "User type is required" }),
    email: z.string().min(1, { message: "Email is required" }),
    password: z.string().min(6, { message: "Password is required" }),
    confirmPassword: z
      .string()
      .min(6, { message: "Confirm Password is required" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"], // Ensures the error message appears under confirmPassword
  })
  .refine((data) => !data.password.includes(data.name), {
    message: "Password must not contain your name",
    path: ["password"],
  });

type formFields = z.infer<typeof schema>;
export default function SignUpPage() {
  const { signup } = useUserStore();
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm<formFields>({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  const onSubmit: SubmitHandler<formFields> = async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      signup(data);
      console.log(data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md space-y-8">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold">Sign up for KinderRide</h1>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <Label>What kind of user are you?</Label>
              <Controller
                name="role"
                control={control}
                defaultValue="parent"
                render={({ field }) => (
                  <RadioGroup
                    {...field}
                    onValueChange={(value) => setValue("role", value)}
                    className="flex flex-wrap gap-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="parent" id="parent" />
                      <Label htmlFor="parent">Parent</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="driver" id="driver" />
                      <Label htmlFor="driver">Driver</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="school" id="school" />
                      <Label htmlFor="school">School Admin</Label>
                    </div>
                  </RadioGroup>
                )}
              />
              {errors.role && (
                <p className="text-red-500">{errors.role.message}</p>
              )}
            </div>
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    {...register("name")}
                    id="name"
                    placeholder="Enter your Name"
                  />
                  {errors.name && (
                    <p className="text-red-500">{errors.name.message}</p>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-red-500">{errors.email.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter a password"
                  {...register("password")}
                />
                {errors.password && (
                  <p className="text-red-500">{errors.password.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm password"
                  {...register("confirmPassword")}
                />
                {errors.confirmPassword && (
                  <p className="text-red-500">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>
            </div>
            {errors.root && (
              <p className="text-red-500">{errors.root.message}</p>
            )}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#F7B32B] text-black hover:bg-[#F7B32B]/90"
            >
              {isSubmitting ? "Creating..." : "Create account"}
            </Button>
          </form>
          <div className="text-center text-sm">
            <Link
              to="/login"
              className="text-muted-foreground hover:text-[#F7B32B]"
            >
              Already have an account? Log in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
