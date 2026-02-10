'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { Menu, X } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'

export function Navigation() {
  const { data: session } = useSession()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 border-b bg-primary text-primary-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <div className="w-8 h-8 rounded bg-accent flex items-center justify-center text-primary font-bold">
              W
            </div>
            <span>Wakamiru</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/events" className="hover:text-accent transition">
              Events
            </Link>
            <Link href="/courses" className="hover:text-accent transition">
              Courses
            </Link>
            <Link href="/consultations" className="hover:text-accent transition">
              Consultations
            </Link>
            <Link href="/blog" className="hover:text-accent transition">
              Blog
            </Link>
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-4">
            {session ? (
              <>
                <span className="text-sm">{session.user?.email}</span>
                <Link href="/dashboard">
                  <Button variant="outline" size="sm" className="border-accent text-accent hover:bg-accent/10 bg-transparent">
                    Dashboard
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-accent text-accent hover:bg-accent/10 bg-transparent"
                  onClick={() => signOut()}
                >
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="outline" size="sm" className="border-accent text-accent hover:bg-accent/10 bg-transparent">
                    Log In
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-primary-foreground hover:text-accent transition"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-primary-foreground/10 py-4 space-y-4">
            <Link href="/events" className="block hover:text-accent transition">
              Events
            </Link>
            <Link href="/courses" className="block hover:text-accent transition">
              Courses
            </Link>
            <Link href="/consultations" className="block hover:text-accent transition">
              Consultations
            </Link>
            <Link href="/blog" className="block hover:text-accent transition">
              Blog
            </Link>
            <div className="pt-4 border-t border-primary-foreground/10 flex flex-col gap-2">
              {session ? (
                <>
                  <div className="text-sm text-primary-foreground/80">{session.user?.email}</div>
                  <Link href="/dashboard">
                    <Button variant="outline" size="sm" className="w-full border-accent text-accent bg-transparent">
                      Dashboard
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full border-accent text-accent bg-transparent"
                    onClick={() => signOut()}
                  >
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/login" className="w-full">
                    <Button variant="outline" size="sm" className="w-full border-accent text-accent bg-transparent">
                      Log In
                    </Button>
                  </Link>
                  <Link href="/signup" className="w-full">
                    <Button size="sm" className="w-full bg-accent text-accent-foreground">
                      Sign Up
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
