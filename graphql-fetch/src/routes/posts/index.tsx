// posts.index.tsx
import { createFileRoute } from '@tanstack/react-router'

// Note the trailing slash, which is used to target index routes
export const Route = createFileRoute('/posts/')({
    component: PostsIndexComponent,
})

function PostsIndexComponent() {
    return <div>Please select a post!</div>
}
