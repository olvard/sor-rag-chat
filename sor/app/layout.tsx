//import { describe } from "node:test"
import "../styles/globals.css"

export const metadata = {
	title: "sorgpt",
	description: "Sunrise Of The Reaping GPT"
}

export default function RootLayout({

  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}