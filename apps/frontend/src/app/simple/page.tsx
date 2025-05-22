"use client"
import { ModeToggle } from "@/components/theme/theme-toggle"
import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor"
import { useState } from "react"

export default function Page() {
  const [content, setContent] = useState<string>("")

  return <div>
    <div className="flex justify-end">
      <ModeToggle />
    </div>
    <SimpleEditor content={content} setContent={setContent} />
  </div>
}
