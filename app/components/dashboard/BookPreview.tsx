import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"

interface BookPreviewProps {
  title: string
  preview: string
}

export function BookPreview({ title, preview }: BookPreviewProps) {
  return (
    <Card className="overflow-hidden border-slate-800 bg-slate-900/50">
      <CardHeader className="border-b border-slate-800">
        <div className="aspect-[2/1] overflow-hidden rounded-lg">
          <Image
            src={preview}
            alt={`Preview of ${title}`}
            width={400}
            height={200}
            className="object-cover"
          />
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <CardTitle className="text-base text-slate-50">{title}</CardTitle>
      </CardContent>
    </Card>
  )
}

