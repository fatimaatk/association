"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Error({
  error,
}: {
  error: Error & { digest?: string };
}) {
  const router = useRouter();
  console.error(error);

  useEffect(() => {
    router.replace("/");
  }, [router]);

  return null;
} 