// posts.index.tsx
import { useUserStore } from '@/store/userStore'
import { createFileRoute, redirect } from '@tanstack/react-router'

// Note the trailing slash, which is used to target index routes
export const Route = createFileRoute('/games/')({
    loader: () => {
        const isAuthenticated = useUserStore.getState().isAuthenticated
        if (!isAuthenticated()) {
            throw redirect({
                to: '/',
            })
        }
    },
    component: PostsIndexComponent,
})

function PostsIndexComponent() {
    return <div>Please select a post!</div>
}
