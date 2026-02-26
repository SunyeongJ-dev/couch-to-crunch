// app/providers/Sessionprovider.tsx
// This component wraps its children with the next-auth SessionProvider.
// It enables client components that use useSession to work, even when rendered from a server component.
"use client";

import { SessionProvider } from "next-auth/react";

export default function NextAuthProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SessionProvider>{children}</SessionProvider>;
}
