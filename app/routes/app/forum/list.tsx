import type { Route } from "./+types/list";
import { caller } from '~/utils/trpc/server'
import { redirect } from 'react-router'
import { Button } from '@polarnl/polarui-react'
import { useNavigate } from "react-router";

export async function loader(loaderArgs: Route.LoaderArgs) {

    const api = await caller(loaderArgs)
    const forumPosts = await api.forum.getPosts({})
    return forumPosts
}

export default function ForumHome({ loaderData: forumPosts }: Route.ComponentProps) {
    const navigate = useNavigate();

    return (
        <div className='flex flex-col items-center justify-center min-h-screen min-w-screen'>
            <h1>Forum</h1>
            <Button onClick={() => { navigate('/app/forum/make') }}>Make forum post</Button>
            <Button onClick={() => { navigate('/app') }}>terug</Button>
            <div>
                {forumPosts?.map((post) => (
                    <a key={post.id} href={`/app/forum/${post.id}`}>
                        <div className="border p-4 m-2 w-96">
                            <h2 className="text-xl font-bold">{post.title}</h2>
                            <p className="text-gray-600">By {post.author.name} on {new Date(post.createdAt).toLocaleDateString()}</p>
                            <p className="mt-2">{post.content}</p>
                        </div>
                    </a>
                ))}
            </div>
        </div>
    )
}
