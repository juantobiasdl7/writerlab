import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { ChevronDown, LogOut, Search } from 'lucide-react'
import Image from "next/image"

export function DashboardSidebar() {
  return (
    <aside className="w-64 border-r border-slate-800 bg-slate-950/50 p-6">
      <div className="mb-6 flex items-center gap-3">
        <div className="relative h-10 w-10 overflow-hidden rounded-full">
          <Image
            src="/placeholder.svg?height=40&width=40"
            alt="Profile photo"
            width={40}
            height={40}
            className="object-cover"
          />
        </div>
        <div className="flex-1">
          <h2 className="text-sm font-medium text-slate-50">Dashboard</h2>
        </div>
      </div>
      <div className="relative mb-6">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-slate-400" />
        <Input
          placeholder="Quick search"
          className="bg-slate-900 pl-8 text-slate-50 placeholder:text-slate-400"
        />
      </div>
      <Button
        variant="ghost"
        className="mb-6 w-full justify-start text-slate-400 hover:text-slate-50"
      >
        <LogOut className="mr-2 h-4 w-4" />
        Sign out
      </Button>
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm font-medium text-slate-50">
          <span>Books</span>
          <Button variant="ghost" size="icon" className="h-4 w-4 text-slate-400">
            <ChevronDown className="h-4 w-4" />
          </Button>
        </div>
        <div className="space-y-1">
          {Array.from({ length: 4 }).map((_, i) => (
            <Button
              key={i}
              variant="ghost"
              className="w-full justify-start text-slate-400 hover:text-slate-50"
            >
              <span className="mr-2">◇</span>
              Book one
            </Button>
          ))}
        </div>
      </div>
    </aside>
  )
}

