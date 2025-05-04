'use client'
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const redirect = useRouter()
  useEffect(() => {
    redirect.push("/auth/signin");
  }, []);
  return null;
}
