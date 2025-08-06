import "./globals.css";



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-gradient-to-br from-indigo-50 via-white to-pink-300">
        {children}
      </body>
    </html>
  );
}
