import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { BookOpen, FileText, Upload } from 'lucide-react'

const features = [
  {
    icon: <BookOpen className="h-8 w-8" />,
    title: "Write Your Book",
    description: "Use our intuitive editor to write and organize your book chapters."
  },
  {
    icon: <Upload className="h-8 w-8" />,
    title: "Export to PDF",
    description: "Convert your book to a professional PDF format with a single click."
  },
  {
    icon: <FileText className="h-8 w-8" />,
    title: "Manage Projects",
    description: "Keep track of multiple book projects in one place."
  }
]

export function LandingFeatures() {
  return (
    <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      {features.map((feature, index) => (
        <Card key={index} className="border-slate-800 bg-slate-900/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-4 text-slate-50">
              {feature.icon}
              {feature.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-300">{feature.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
