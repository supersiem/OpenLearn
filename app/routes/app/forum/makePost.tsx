import type { Route } from "./+types/list";
import { caller } from '~/utils/trpc/server'
import { redirect, Form } from 'react-router'
import { Button } from '@polarnl/polarui-react'

export async function action(actionArgs: Route.ActionArgs) {
    const formData = await actionArgs.request.formData();
    const title = formData.get('title') as string;
    const content = formData.get('content') as string;

    const api = await caller(actionArgs);
    await api.forum.makePost({ title, content, subject: 'NL' });
    return redirect('/app/forum');
}

export default function ForumHome() {
    return (
        <div className='flex flex-col items-center justify-center min-h-screen min-w-screen'>
            <h1 className='text-2xl font-bold mb-6'>Create a New Post</h1>
            <Form method='post' className='flex flex-col gap-4 w-full max-w-md'>
                <input
                    type='text'
                    name='title'
                    placeholder='Post title'
                    className='border rounded px-4 py-2'
                />
                <textarea
                    name='content'
                    placeholder='Write your post content...'
                    rows={6}
                    className='border rounded px-4 py-2'
                />
                <Button type='submit'>Submit Post</Button>
            </Form>
        </div>
    )
}
