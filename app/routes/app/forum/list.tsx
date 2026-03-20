import type { Route } from "./+types/list";
import { caller } from '~/utils/trpc/server'
import { useNavigate } from "react-router";
import { auth } from '~/utils/auth/server'
import { Button } from "~/components/button/button";
import { ListContainer, ListItem } from "~/components/list/list";

export async function loader(loaderArgs: Route.LoaderArgs) {
  const api = await caller(loaderArgs);
  const headers = new Headers(loaderArgs.request.headers)
  const result = await auth.api.getSession({ headers })
  const user = result?.user
  const forumPosts = await api.forum.getPosts({});
  return { forum: forumPosts, user: user };
}

export default function ForumHome({ loaderData: { forum: forumPosts, user: user } }: Route.ComponentProps) {
  const navigate = useNavigate();
  return (
    <div className='flex flex-col items-center justify-center min-h-screen min-w-screen'>
      <h1>Forum</h1>
      <Button onClick={() => navigate('/app/forum/make')}>
        Create New Post
      </Button>
      <ListContainer>
        {forumPosts?.map((post) => (
          <ListItem key={post.id}>
            <a key={post.id} href={`/app/forum/${post.id}`}>
              <div className="border p-4 m-2 w-96">
                <h2 className="text-xl font-bold">{post.title}</h2>
                <p className="text-gray-600">By {post.author.name} on {new Date(post.createdAt).toLocaleDateString()}</p>
                <p className="mt-2">{post.content}</p>
              </div>
            </a>
          </ListItem>
        ))}
      </ListContainer>
    </div>
  )
}
