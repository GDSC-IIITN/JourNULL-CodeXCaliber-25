"use client"
import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor"
import { useState } from "react"

export default function Page() {
  const [content, setContent] = useState<string>("")

  return <SimpleEditor content={content} setContent={setContent} />
}
