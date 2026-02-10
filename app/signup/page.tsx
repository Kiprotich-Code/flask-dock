import { Navigation } from '@/components/navigation'
import { SignupForm } from '@/components/signup-form'

export const metadata = {
  title: 'Sign Up | Wakamiru Consulting',
  description: 'Create your Wakamiru Consulting account today.',
}

export default function SignupPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />
      <main className="flex-1 flex items-center justify-center px-4 py-20">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Create Account</h1>
            <p className="text-muted-foreground">
              Join Wakamiru Consulting today
            </p>
          </div>
          <SignupForm />
        </div>
      </main>
    </div>
  )
}
