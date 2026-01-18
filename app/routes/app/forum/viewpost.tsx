import type { Route } from "./+types/viewpost";
import { caller } from '~/utils/trpc/server'
import { redirect, Form } from 'react-router'
import { Button } from '@polarnl/polarui-react'
import { useNavigate } from "react-router";
import { useState } from "react";

export async function loader(loaderArgs: Route.LoaderArgs) {
    const api = await caller(loaderArgs)
    try {
        const user = await api.forum.getSpecificPost({ postId: loaderArgs.params.postId! })
        if (!user) {
            return redirect('/app/forum')
        }
        return user
    } catch (error) {
        return redirect('/app/forum')
    }
}

export async function action(actionArgs: Route.ActionArgs) {
    const formData = await actionArgs.request.formData();
    const content = formData.get('content') as string;
    const postId = actionArgs.params.postId as string;

    const api = await caller(actionArgs);
    await api.forum.replyToPost({ postId, content });
    return redirect(`/app/forum/${postId}`);
}

export default function Home({ loaderData: user }: Route.ComponentProps) {
    const navigate = useNavigate();
    const [replyview, setReplyview] = useState(false);
    return (
        <div className='flex flex-col items-center justify-center min-h-screen min-w-screen'>
            <div className={replyview ? 'visible' : 'hidden'}>
                <Form method="post" className="flex flex-col space-y-4" onSubmit={() => { setReplyview(false) }}>
                    <label>
                        Reply:
                        <textarea name="content" className="border p-2 w-96 h-32" required />
                    </label>
                    <Button type="submit">Submit Reply</Button>
                    <a onClick={() => { setReplyview(false) }}>nope</a>
                </Form>
            </div>
            <h1 className="text-2xl font-bold">{user?.title}</h1>
            <p className="text-gray-600">By {user?.author.name} on {new Date(user?.createdAt).toLocaleDateString()}</p>
            <p className="mt-4">{user?.content}</p>
            <Button onClick={() => { navigate('/app/forum') }}>Back to Forum</Button>
            <Button onClick={() => { setReplyview(true) }}>reply</Button>
            <h2>replies</h2>
            {user?.replies.map((reply) => (
                <div key={reply.id} className="border p-4 m-2 w-96">
                    <p className="text-gray-600">By {reply.author.name} on {new Date(reply.createdAt).toLocaleDateString()}</p>
                    <p className="mt-2">{reply.content}</p>
                </div>
            ))}
        </div>
    )
}
