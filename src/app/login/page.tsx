import AuthForm from '@/components/AuthForm'

export const dynamic = 'force-dynamic'

export default function LoginPage() {
  return (
    <main className="min-h-dvh flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm flex flex-col gap-10">
        {/* Brand */}
        <div className="text-center">
          <h1 className="font-serif text-3xl text-ink mb-2">shoots.life</h1>
          <p className="font-sans text-ink/40 text-sm">One photo. One day. Just for you.</p>
        </div>

        <AuthForm />
      </div>
    </main>
  )
}
