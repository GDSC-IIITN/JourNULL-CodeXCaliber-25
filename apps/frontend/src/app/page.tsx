'use client'
import { useRouter } from "next/navigation";

export default function Home() {
  const redirect = useRouter()
  redirect.push("/auth/signin");
}
