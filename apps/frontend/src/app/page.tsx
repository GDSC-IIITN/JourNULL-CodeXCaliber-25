'use client'
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import JournalEditor from '../components/editor/JournalEditor';

export default function Home() {
  const redirect = useRouter()
  useEffect(() => {
    redirect.push("/auth/signin");
  }, [redirect]);
  return (
    <div>
      <h1>Welcome to Journull Editor</h1>
      <JournalEditor />
    </div>
  );
}
