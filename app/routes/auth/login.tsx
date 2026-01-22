import { authClient } from '~/utils/auth/client'
import { Button, Input } from '@polarnl/polarui-react'
import { KeyRound, LogIn, User } from 'lucide-react'
import i18next from 'i18next'
import zod from 'zod'
import { useNavigate } from 'react-router'

export function geti18nAuthMessageByCode(code: string) {
  switch (code) {
    case "USERNAME_IS_INVALID":
      return i18next.t('auth:errors.usernameIsInvalid')
    case "INVALID_EMAIL_OR_PASSWORD":
      return i18next.t('auth:errors.invcreds')
    default:
      return i18next.t('auth:errors.unknown')
  }
}

export default function SignIn() {

  const navigate = useNavigate()

  return (
    <div className='min-h-screen flex flex-col items-center justify-center p-4 gap-4'>
      <Button
        onClick={async () => {
          await authClient.signIn.social({
            provider: 'PolarNL-StaffAuth',
            callbackURL: '/user'
          })
        }}
      >
        login with PolarNL
      </Button>
      <form onSubmit={async (event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const emailOrUsername = formData.get('emailOrUsername') as string;
        const password = formData.get('password') as string;
        
        if (zod.email().safeParse(emailOrUsername).success) {
          await authClient.signIn.email({
            email: emailOrUsername,
            password,
          },
            {
              onError(context) {
                alert(geti18nAuthMessageByCode(context.error.code))
              },
              onSuccess(context) {
                navigate('/user')
              },
            }
          )
        } else {
          await authClient.signIn.username({
            username: emailOrUsername,
            password,
          },
            {
              onError(context) {
                alert(geti18nAuthMessageByCode(context.error.code))
              },
              onSuccess(context) {
                navigate('/user')
              }
            })
        }
      }}>
        <Input type="email" placeholder={i18next.t('auth:emailOrUsername')} name="emailOrUsername" className="mb-2" icon={<User />} scheme='dark' />
        <Input type="password" placeholder={i18next.t('auth:password')} name="password" className="mb-4" scheme='dark' icon={<KeyRound />} />
        <Button type="submit" icon={<LogIn />}>
          {i18next.t('auth:login')}
        </Button>
      </form>
    </div>
  )
}
