// posts.index.tsx
import { AddGame } from '@/components/AddGame'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useCreateReview, useDeleteReview } from '@/hooks/useReviewMutation'
import { useGames } from '@/hooks/useGames'
import { useUserStore } from '@/store/userStore'
import { useForm } from '@tanstack/react-form'
import { createFileRoute, redirect } from '@tanstack/react-router'
import { toast } from 'sonner'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Loader, Send, Trash } from 'lucide-react'
import { useDeleteGame } from '@/hooks/useGameMutation'

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
    const { token, id: idUser } = useUserStore((state) => state)
    const { data, isLoading, error } = useGames(token)

    if (isLoading) return <p>Loading games...</p>
    if (error) return <p>Error: {(error as Error).message}</p>

    return (
        <div className="flex min-h-svh w-full items-center justify-center">
            <div className="w-full grid md:grid-cols-2 gap-2 mx-auto max-w-3xl p-3">
                {data?.games.map((game) => (
                    <div key={game.id}>
                        <GameCard game={game} token={token} idUser={idUser} />
                    </div>
                ))}
                <div className="w-full col-span-2">
                    <AddGame />
                </div>
            </div>
        </div>
    )
}

// GameCard component
const GameCard = ({ game, token, idUser }: { game: any; token: string; idUser: string; }) => {
    const createReview = useCreateReview()
    const deleteReview = useDeleteReview()
    const deleteGame = useDeleteGame()
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

    const onDelete = (idReview: number) => {
        deleteReview.mutate({ reviewId: idReview, token }, {
            onSuccess: () => {
                toast.success('Review deleted successfully!')
            },
            onError: (error) => {
                console.error('Delete review error:', error)
                toast.error('Failed to delete review.')
            },
        })
    }
    const onDeleteGame = (id: number) => {
        deleteGame.mutate({ gameId: id, token }, {
            onSuccess: () => {
                toast.success('Game deleted successfully!')
            },
            onError: (error) => {
                console.error('Delete game error:', error)
                toast.error('Failed to delete game.')
            },
        })
    }

    return (
        <Card key={game.id}>
            <CardHeader>
                <CardTitle className="text-3xl">{game.title}</CardTitle>
                <CardDescription className='flex justify-between items-center'>
                    <p>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    </p>
                    <div className="">
                        <Button size="icon" className="text-xs" variant={'ghost'} onClick={() => onDeleteGame(game.id)}>
                            <Trash />
                        </Button>
                    </div>
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="mb-3">
                    {game.reviews.map((review: any) => (
                        <div key={review.id} className="mb-1 flex justify-between">
                            <div className="">
                                <span className="text-gray-400 text-xs">{review.user.email}</span>
                                <p className="text-gray-700 text-sm">{review.content}</p>
                            </div>
                            {
                                review.user.id == idUser && (
                                    <Button size="icon" className="text-xs" variant={'ghost'} onClick={() => onDelete(review.id)}>
                                        <Trash />
                                    </Button>
                                )
                            }
                        </div>
                    ))}
                </div>
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


