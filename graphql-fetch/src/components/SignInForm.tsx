import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { z } from "zod"
import { useLoginFormStore } from "@/store/formStore"
import { useForm } from "@tanstack/react-form"
import { useSigninMutation } from "@/hooks/useAuthMutation"
import { toast } from "sonner"
import { useRouter } from "@tanstack/react-router"

export function SignInForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const signinMutation = useSigninMutation();
  const router = useRouter();
  const baseSchema = z.object({
    email: z.string().nonempty({ message: "Email is required" }).email("Invalid email"),
    password: z.string().nonempty({ message: "Password is required" }),
  });

  const { email, password, } = useLoginFormStore();
  const form = useForm({
    defaultValues: {
      email,
      password,
    },
    validators: {
      onChange: baseSchema,
    },
    onSubmit: async ({ value }) => {
      const { email, password } = value
      signinMutation.mutate({ email, password }, {
        onSuccess: () => {
          toast.success('signin success!')
          router.navigate({ to: "/games" });
        },
        onError: (error) => {
          console.log("🚀 ~ onSubmit: ~ error:", error)
          toast.success('signin failed!')

        },
      });

    },
  });
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit(e);
          }}>
            <div className="flex flex-col gap-6">
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
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
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
              <form.Subscribe selector={(state) => [state.isSubmitting, state.canSubmit]}>
                {([isSubmitting, canSubmit]) => (
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={!canSubmit}
                  >
                    {isSubmitting ? "..." : "Sign In"}
                  </Button>
                )}
              </form.Subscribe>
            </div>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <a href="/sign-up" className="underline underline-offset-4">
                Sign up
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
