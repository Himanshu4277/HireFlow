"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/app/store/

export default function Providers({
  children,
}: {
  children: React.ReactNode;
}) {
  const init = useAuthStore((s) => s.init);

  useEffect(() => {
    init(); // 🔥 load token
  }, [init]);

  return <>{children}</>;
}