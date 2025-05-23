// posts.index.tsx
import { AddGame } from '@/components/AddGame'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useCreateReview } from '@/hooks/useReviewMutation'
import { useGames } from '@/hooks/useGames'
import { useUserStore } from '@/store/userStore'
import { useForm } from '@tanstack/react-form'
import { createFileRoute, redirect } from '@tanstack/react-router'
import { toast } from 'sonner'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Loader, Send } from 'lucide-react'

// Route definition
export const Route = createFileRoute('/games/')({
    loader: () => {
        const isAuthenticated = useUserStore.getState().isAuthenticated
        if (!isAuthenticated()) {
            throw redirect({ to: '/' })
        }
    },
    component: PostsIndexComponent,
})

function PostsIndexComponent() {
    const token = useUserStore((state) => state.token)
    const { data, isLoading, error } = useGames(token)

    if (isLoading) return <p>Loading games...</p>
    if (error) return <p>Error: {(error as Error).message}</p>

    return (
        <div className="flex min-h-svh w-full items-center justify-center">
            <div className="w-full grid md:grid-cols-2 gap-2 mx-auto max-w-3xl p-3">
                {data?.games.map((game) => (
                    <GameCard key={game.id} game={game} token={token} />
                ))}
                <div className="w-full col-span-2">
                    <AddGame />
                </div>
            </div>
        </div>
    )
}

// GameCard component
const GameCard = ({ game, token }: { game: any; token: string }) => {
    const createReview = useCreateReview()

    const schema = z.object({
        content: z.string().nonempty({ message: 'Review is required' }).min(3, 'Review too short'),
    })

    const form = useForm({
        defaultValues: { content: '' },
        validators: { onChange: schema },
        onSubmit: async ({ value }) => {
            createReview.mutate(
                { content: value.content, token, gameId: game.id },
                {
                    onSuccess: () => {
                        toast.success('Review added successfully!')
                        form.reset()
                    },
                    onError: (error) => {
                        console.error('Create review error:', error)
                        toast.error('Failed to add review.')
                    },
                }
            )
        },
    })


    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-3xl">{game.title}</CardTitle>
                <CardDescription>Lorem ipsum dolor sit amet consectetur adipisicing elit.</CardDescription>
            </CardHeader>
            <CardContent>
                {game.reviews.map((review: any) => (
                    <div key={review.id} className="mb-3">
                        <span className="text-gray-400 text-xs">{review.user.email}</span>
                        <p className="text-gray-700 text-sm">{review.content}</p>
                    </div>
                ))}
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        form.handleSubmit(e);
                    }}
                    className="flex flex-col gap-6"
                >
                    <div className="grid gap-2">
                        <Label htmlFor="content">Review</Label>
                        <div className="flex gap-2">
                            <form.Field name="content">
                                {(field) => (
                                    <div>
                                        <Input
                                            id="review"
                                            type="review"
                                            value={field.state.value}
                                            onBlur={field.handleBlur}
                                            onChange={(e) => field.handleChange(e.target.value)}
                                            placeholder="Review"
                                        />
                                        {field.state.meta.errors?.[0] && field.state.meta.isTouched && (
                                            <p className="text-sm text-red-600 mt-1">{field.state.meta.errors[0]?.message}</p>
                                        )}
                                    </div>
                                )}
                            </form.Field>
                            <form.Subscribe selector={(state) => [state.isSubmitting, state.canSubmit]}>
                                {([isSubmitting, canSubmit]) => (
                                    <Button
                                        type="submit"
                                        disabled={!canSubmit}
                                    >
                                        {isSubmitting ? <Loader className="animate-spin" /> : <Send />}
                                    </Button>
                                )}
                            </form.Subscribe>
                        </div>
                    </div>
                </form>
            </CardContent>
        </Card>
    )
}


