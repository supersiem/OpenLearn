import type { Route } from "./+types/home";
import { caller } from '~/utils/trpc/server'
import { redirect } from 'react-router'
import { Button } from '@polarnl/polarui-react'
import { authClient } from '~/utils/auth/client'
import { useNavigate } from "react-router";

export async function loader(loaderArgs: Route.LoaderArgs) {
    const api = await caller(loaderArgs)
    try {
        const user = await api.user.user()
        if (!user) {
            return redirect('/')
        }
        return user
    } catch (error) {
        return redirect('/')
    }
}

export default function Home({ loaderData: user }: Route.ComponentProps) {
    const signOut = async () => {
        await authClient.signOut({
        })
    }
    const navigate = useNavigate();
    return (
        <div className='flex flex-col items-center justify-center min-h-screen min-w-screen'>
            Hello! {user?.name}
            <Button onClick={() => { navigate('/app/forum') }}>Forum</Button>
            <Button onClick={signOut}>log uit</Button>
        </div>
    )
}
