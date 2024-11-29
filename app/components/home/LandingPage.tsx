import { Link } from '@remix-run/react'
import { Button } from "~/components/ui/button"
import { ArrowRight } from 'lucide-react'
import { LandingNavbar } from './LandingNavbar'
import { LandingFeatures } from './LandingFeatures'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950/40 to-slate-900/60 text-slate-50">
      <LandingNavbar />
      <main className="container mx-auto px-6 py-12">
        <div className="text-center">
          <h1 className="mb-6 text-5xl font-bold">Write your book, export to PDF</h1>
          <p className="mb-8 text-xl text-slate-300">
            A minimalist application to help you write your book and export it to PDF.
          </p>
          <div className="flex justify-center gap-4">
            <Button asChild className="bg-slate-50 text-slate-900 hover:bg-slate-200">
              <Link to="/signup">Get started</Link>
            </Button>
            <Button asChild variant="outline" className="border-slate-50 text-slate-50 hover:bg-slate-800">
              <Link to="/login">
                Learn more
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
        <LandingFeatures />
      </main>
    </div>
  )
}
