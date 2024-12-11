import { Button } from "~/components/ui/button"
import { Card } from "~/components/ui/card"
import { PlusCircle } from 'lucide-react'
import { DashboardSidebar } from "~/components/dashboard/DashboardSidebar"
import { BookPreview } from "~/components/dashboard/BookPreview"

const books = [
  { id: 1, title: "Book one", preview: "/placeholder.svg?height=200&width=400" },
  { id: 2, title: "Book one", preview: "/placeholder.svg?height=200&width=400" },
  { id: 3, title: "Book one", preview: "/placeholder.svg?height=200&width=400" },
  { id: 4, title: "Book one", preview: "/placeholder.svg?height=200&width=400" },
  { id: 5, title: "Book one", preview: "/placeholder.svg?height=200&width=400" },
  { id: 6, title: "Book one", preview: "/placeholder.svg?height=200&width=400" },
]

export default function DashboardPage() {
  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-950/40 to-slate-900/60 dark">
      <DashboardSidebar />
      <main className="flex-1 overflow-auto p-6">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-slate-50">Dashboard</h1>
          <Button className="border border-gray-600 bg-gray-500/20 hover:bg-gray-500/40">
            <PlusCircle className="mr-2 h-4 w-4" />
            New Book
          </Button>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {books.map((book) => (
            <BookPreview key={book.id} title={book.title} preview={book.preview} />
          ))}
        </div>
      </main>
    </div>
  )
}

