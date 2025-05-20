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
import { z } from 'zod'
import { useSignupFormStore } from "@/store/formStore"
import { useForm } from '@tanstack/react-form'

export function SignUpForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {

  const baseSchema = z.object({
    email: z.string().email('Invalid email'),
    password: z.string().min(5, 'Password too short'),
    repassword: z.string().min(5, 'Repeat password too short'),
  })

  const schema = baseSchema.refine((data) => data.password === data.repassword, {
    message: 'Passwords do not match',
    path: ['repassword'], // This makes the error specifically for repassword
  })

  type FormData = z.infer<typeof schema>;

  const { email, password, repassword, setField } = useSignupFormStore();

  const form = useForm({
    defaultValues: {
      email: email,
      password: password,
      repassword: repassword,
    },
    validators: {
      // The onChange validator is the primary place to handle Zod errors
      onChange: ({ value }) => {
        const result = schema.safeParse(value);
        if (!result.success) {
          // Map Zod errors to the format expected by @tanstack/react-form
          const fieldErrors: Partial<Record<keyof FormData, string[]>> = {};
          result.error.errors.forEach(err => {
            const field = err.path[0] as keyof FormData;
            if (!fieldErrors[field]) {
              fieldErrors[field] = [];
            }
            fieldErrors[field]?.push(err.message);
          });
          return fieldErrors;
        }
        return undefined; // No errors
      },
    },
    onSubmit: async ({ value }) => {
      // Perform a final validation check before submission
      const result = schema.safeParse(value);

      if (!result.success) {
        // If validation fails here, it implies a bug or a race condition
        // The onChange validator should have already caught these errors.
        // For robustness, you can set errors manually if needed, but the onChange
        // validator should be the primary source.
        result.error.errors.forEach(err => {
          const field = err.path[0] as keyof FormData;
          // You can choose to set the field to a failed state or just log
          // In a real application, you might want to show a general form error
          // or re-trigger field validation explicitly if needed.
          // For now, let's just log and rely on onChange for visual feedback.
          console.error(`Submission error for field ${String(field)}: ${err.message}`);
          // If you really need to set errors manually here,
          // ensure it doesn't conflict with onChange validation.
          // Example: You might set a specific 'submitError' meta property
          // form.setFieldMeta(field, (prev) => ({
          //   ...prev,
          //   submitErrors: [...(prev?.submitErrors || []), err.message],
          // }));
        });
        return; // Prevent submission
      }

      // If validation is successful at this point, update your Zustand store
      // and proceed with actual form submission logic (e.g., API call)
      setField('email', result.data.email);
      setField('password', result.data.password);
      // You might or might not want to store repassword in the global state
      // setField('repassword', result.data.repassword);

      alert('Submitted successfully!\n' + JSON.stringify(result.data, null, 2));

      // Clear the form after successful submission if needed
      // form.reset();
    },
  });

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Sign Up</CardTitle>
          <CardDescription>
            Enter your email below to create account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={(e) => form.handleSubmit(e)}>
            <div className="flex flex-col gap-6">
              {/* Email */}
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <form.Field name="email">
                  {(field) => (
                    <>
                      <Input
                        id="email"
                        name="email"
                        placeholder="m@example.com"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                      {field.state.meta.errors && field.state.meta.errors.length > 0 && (
                        <p className="text-sm text-red-600 mt-1">{field.state.meta.errors[0]}</p>
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
                        name="password"
                        placeholder="Password"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                      {field.state.meta.errors && field.state.meta.errors.length > 0 && (
                        <p className="text-sm text-red-600 mt-1">{field.state.meta.errors[0]}</p>
                      )}
                    </>
                  )}
                </form.Field>
              </div>

              {/* Repeat Password */}
              <div className="grid gap-2">
                <Label htmlFor="repassword">Confirm Password</Label>
                <form.Field name="repassword">
                  {(field) => (
                    <>
                      <Input
                        id="repassword"
                        type="password"
                        name="repassword"
                        placeholder="Confirm Password"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                      {field.state.meta.errors && field.state.meta.errors.length > 0 && (
                        <p className="text-sm text-red-600 mt-1">{field.state.meta.errors[0]}</p>
                      )}
                    </>
                  )}
                </form.Field>
              </div>

              <form.Subscribe
                selector={(state) => [state.isSubmitting]}
                children={([isSubmitting]) => (
                  <Button type="submit" className="w-full" >
                    {isSubmitting ? '...' : 'Sign Up'}
                  </Button>
                )}
              />
            </div>

            <div className="mt-4 text-center text-sm">
              Already have an account?{" "}
              <a href="/" className="underline underline-offset-4">
                Sign in
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}