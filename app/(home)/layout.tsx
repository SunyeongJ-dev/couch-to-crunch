// app/(home)/layout.tsx
// Layout for the home page, which includes the video grid and sidebar.
// This has an extra wrapper around the main content to add padding for the sidebar on larger screens.
import "../globals.css";

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className="sm:pl-56">{children}</div>;
}
