import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useCreateGame } from "@/hooks/useGameMutation"
import { useUserStore } from "@/store/userStore"
import { useForm } from "@tanstack/react-form"
import { toast } from "sonner"
import { z } from "zod"

export const AddGame = () => {
    const token = useUserStore((state) => state.token)
    const createGame = useCreateGame()

    const baseSchema = z.object({
        title: z
            .string()
            .nonempty({ message: "Title is required" })
            .min(3, "Title too short"),
    })

    const form = useForm({
        defaultValues: {
            title: "",
        },
        validators: {
            onChange: baseSchema,
        },
        onSubmit: async ({ value }) => {
            createGame.mutate(
                { title: value.title, token },
                {
                    onSuccess: () => {
                        toast.success("Game added successfully!")
                        form.reset()
                    },
                    onError: (error) => {
                        console.error("Create game error:", error)
                        toast.error("Failed to add game.")
                    },
                }
            )
        },
    })

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="default" className="w-full mt-5">
                    Add Game
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add Game</DialogTitle>
                    <DialogDescription>
                        Create a new game to review. Click save when you're done.
                    </DialogDescription>
                </DialogHeader>
                <form
                    onSubmit={(e) => {
                        e.preventDefault()
                        form.handleSubmit()
                    }}
                >
                    <div className="py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="title" className="text-right">
                                Title
                            </Label>
                            <div className="col-span-3">
                                <form.Field name="title">
                                    {(field) => (
                                        <>
                                            <Input
                                                id="title"
                                                value={field.state.value}
                                                onBlur={field.handleBlur}
                                                onChange={(e) => field.handleChange(e.target.value)}
                                                placeholder="Game title"
                                            />
                                            {field.state.meta.errors?.[0] && field.state.meta.isTouched && (
                                                <p className="text-sm text-red-600 mt-1">
                                                    {field.state.meta.errors[0].message}
                                                </p>
                                            )}
                                        </>
                                    )}
                                </form.Field>
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose>

                            <form.Subscribe selector={(state) => [state.isSubmitting, state.canSubmit]}>
                                {([isSubmitting, canSubmit]) => (
                                    <Button type="submit" disabled={!canSubmit || isSubmitting}>
                                        {isSubmitting ? "Saving..." : "Save changes"}
                                    </Button>
                                )}
                            </form.Subscribe>
                        </DialogClose>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
