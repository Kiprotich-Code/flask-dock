'use client'

import Link from 'next/link'
import { ArrowRight, Briefcase, BookOpen, Users, TrendingUp } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function Homepage() {
  return (
    <main className="flex-1">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-primary/90 text-primary-foreground py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-balance">
              Transform Your Business with Strategic Consulting
            </h1>
            <p className="text-lg md:text-xl text-primary-foreground/90 mb-8 text-balance">
              Access expert consultants, attend industry events, take comprehensive courses, and stay updated with market insights. Everything your business needs to grow.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/signup">
                <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 w-full sm:w-auto">
                  Get Started <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <Link href="/courses">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10 w-full sm:w-auto bg-transparent"
                >
                  Explore Courses
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">Our Solutions</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Comprehensive consulting services designed for modern businesses
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Events */}
            <div className="bg-card rounded-lg p-6 border border-border hover:shadow-lg transition">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-xl font-bold mb-2">Industry Events</h3>
              <p className="text-muted-foreground mb-4">
                Network with industry leaders and participate in exclusive business events
              </p>
              <Link href="/events" className="text-accent font-semibold inline-flex items-center gap-2 hover:gap-3 transition">
                View Events <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Courses */}
            <div className="bg-card rounded-lg p-6 border border-border hover:shadow-lg transition">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                <BookOpen className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-xl font-bold mb-2">Professional Courses</h3>
              <p className="text-muted-foreground mb-4">
                Advance your skills with our curated selection of business and strategy courses
              </p>
              <Link href="/courses" className="text-accent font-semibold inline-flex items-center gap-2 hover:gap-3 transition">
                Browse Courses <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Consultations */}
            <div className="bg-card rounded-lg p-6 border border-border hover:shadow-lg transition">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                <Briefcase className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-xl font-bold mb-2">Expert Consultations</h3>
              <p className="text-muted-foreground mb-4">
                Get personalized guidance from experienced business consultants
              </p>
              <Link href="/consultations" className="text-accent font-semibold inline-flex items-center gap-2 hover:gap-3 transition">
                Book Consultation <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Market Insights */}
            <div className="bg-card rounded-lg p-6 border border-border hover:shadow-lg transition">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-xl font-bold mb-2">Market Insights</h3>
              <p className="text-muted-foreground mb-4">
                Stay informed with in-depth market analysis and industry trends
              </p>
              <Link href="/blog" className="text-accent font-semibold inline-flex items-center gap-2 hover:gap-3 transition">
                Read Articles <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2 text-accent">500+</div>
              <p className="text-primary-foreground/90">Satisfied Clients</p>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2 text-accent">50+</div>
              <p className="text-primary-foreground/90">Expert Consultants</p>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2 text-accent">100+</div>
              <p className="text-primary-foreground/90">Professional Courses</p>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2 text-accent">25+</div>
              <p className="text-primary-foreground/90">Annual Events</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-secondary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-balance">
            Ready to Transform Your Business?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto text-balance">
            Join hundreds of businesses that have already benefited from our consulting services
          </p>
          <Link href="/signup">
            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
              Start Your Journey <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground border-t border-primary/50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-bold mb-4">About</h4>
              <ul className="space-y-2 text-sm text-primary-foreground/80">
                <li><Link href="#" className="hover:text-accent transition">About Us</Link></li>
                <li><Link href="#" className="hover:text-accent transition">Careers</Link></li>
                <li><Link href="#" className="hover:text-accent transition">Press</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Services</h4>
              <ul className="space-y-2 text-sm text-primary-foreground/80">
                <li><Link href="/events" className="hover:text-accent transition">Events</Link></li>
                <li><Link href="/courses" className="hover:text-accent transition">Courses</Link></li>
                <li><Link href="/consultations" className="hover:text-accent transition">Consultations</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-primary-foreground/80">
                <li><Link href="/blog" className="hover:text-accent transition">Blog</Link></li>
                <li><Link href="#" className="hover:text-accent transition">Documentation</Link></li>
                <li><Link href="#" className="hover:text-accent transition">FAQ</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-primary-foreground/80">
                <li><Link href="#" className="hover:text-accent transition">Privacy</Link></li>
                <li><Link href="#" className="hover:text-accent transition">Terms</Link></li>
                <li><Link href="#" className="hover:text-accent transition">Contact</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-primary/50 pt-8 text-center text-sm text-primary-foreground/80">
            <p>&copy; 2026 Wakamiru Consulting. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  )
}
