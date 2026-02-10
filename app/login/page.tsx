import { Navigation } from '@/components/navigation'
import { LoginForm } from '@/components/login-form'

export const metadata = {
  title: 'Sign In | Wakamiru Consulting',
  description: 'Sign in to your Wakamiru Consulting account.',
}

export default function LoginPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />
      <main className="flex-1 flex items-center justify-center px-4 py-20">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Sign In</h1>
            <p className="text-muted-foreground">
              Access your Wakamiru Consulting account
            </p>
          </div>
          <LoginForm />
        </div>
      </main>
    </div>
  )
}
