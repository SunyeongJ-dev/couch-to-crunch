export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className="sm:pl-56">{children}</div>;
}
