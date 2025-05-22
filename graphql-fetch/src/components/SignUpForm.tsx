import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { z } from "zod";
import { useSignupFormStore } from "@/store/formStore";
import { useForm } from "@tanstack/react-form";
import { Link, useRouter } from "@tanstack/react-router";
import { toast } from "sonner";
import { useSignupMutation } from "@/hooks/useAuthMutation";

export function SignUpForm({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
  const signupMutation = useSignupMutation();

  const router = useRouter();
  const baseSchema = z.object({
    email: z.string().nonempty({ message: "Email is required" }).email("Invalid email"),
    password: z.string().nonempty({ message: "Password is required" }).min(5, "Password too short"),
    repassword: z.string().nonempty({ message: "Confirm password is required" }).min(5, "Confirm password too short"),
  });

  const schema = baseSchema.refine((data) => data.password === data.repassword, {
    message: "Passwords do not match",
    path: ["repassword"],
  });

  const { email, password, repassword } = useSignupFormStore();
  const form = useForm({
    defaultValues: {
      email,
      password,
      repassword,
    },
    validators: {
      onChange: schema,
    },
    onSubmit: async ({ value }) => {
      const { email, password } = value;
      signupMutation.mutate({ email, password }, {
        onSuccess: () => {
          toast.success('signup success!')
          router.navigate({ to: "/" });
        },
        onError: (error) => {
          console.log("🚀 ~ onSubmit: ~ error:", error)
          toast.success('signup failed!')

        },
      });
    },
  });

  return (
    <div
      className={cn("flex flex-col gap-6", className)}
      {...props}
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Sign Up</CardTitle>
          <CardDescription>Enter your email below to create account</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit(e);
            }}
            className="flex flex-col gap-6"
          >
            {/* Email */}
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <form.Field name="email">
                {(field) => (
                  <>
                    <Input
                      id="email"
                      type="email"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="m@example.com"
                    />
                    {field.state.meta.errors?.[0] && field.state.meta.isTouched && (
                      <p className="text-sm text-red-600 mt-1">{field.state.meta.errors[0]?.message}</p>
                    )}
                  </>
                )}
              </form.Field>
            </div>

            {/* Password */}
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <form.Field name="password">
                {(field) => (
                  <>
                    <Input
                      id="password"
                      type="password"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="Password"
                    />
                    {field.state.meta.errors?.[0] && field.state.meta.isTouched && (
                      <p className="text-sm text-red-600 mt-1">{field.state.meta.errors[0]?.message}</p>
                    )}
                  </>
                )}
              </form.Field>
            </div>

            {/* Confirm Password */}
            <div className="grid gap-2">
              <Label htmlFor="repassword">Confirm Password</Label>
              <form.Field name="repassword">
                {(field) => (
                  <>
                    <Input
                      id="repassword"
                      type="password"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="Confirm Password"
                    />
                    {field.state.meta.errors?.[0] && field.state.meta.isTouched && (
                      <p className="text-sm text-red-600 mt-1">{field.state.meta.errors[0]?.message}</p>
                    )}
                  </>
                )}
              </form.Field>
            </div>

            {/* Submit */}
            <form.Subscribe selector={(state) => [state.isSubmitting, state.canSubmit]}>
              {([isSubmitting, canSubmit]) => (
                <Button
                  type="submit"
                  className="w-full"
                  disabled={!canSubmit}
                >
                  {isSubmitting ? "..." : "Sign Up"}
                </Button>
              )}
            </form.Subscribe>

            <div className="mt-4 text-center text-sm">
              Already have an account?{" "}
              <Link
                to="/"
                className="underline underline-offset-4"
              >
                Sign in
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
