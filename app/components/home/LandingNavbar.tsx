import { Link } from '@remix-run/react'
import { Button } from "~/components/ui/button"

export function LandingNavbar() {
  return (
    <nav className="border-b border-slate-800 bg-slate-950/50 py-4">
      <div className="container mx-auto flex items-center justify-between px-6">
        <Link to="/" className="text-2xl font-bold text-slate-50">
          WriterLab
        </Link>
        <div className="space-x-4">
          <Button asChild variant="ghost" className="text-slate-300 hover:text-slate-50">
            <Link to="/login">Log in</Link>
          </Button>
          <Button asChild className="border border-gray-600 bg-gray-500/20 hover:bg-gray-500/40">
            <Link to="/signup">Sign up</Link>
          </Button>
        </div>
      </div>
    </nav>
  )
}
