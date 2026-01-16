import { Zen_Maru_Gothic } from 'next/font/google'
import './globals.css'

const zenMaru = Zen_Maru_Gothic({
  weight: ['400', '700'],
  subsets: ['latin'],
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body className={zenMaru.className}>
        {children}
      </body>
    </html>
  )
}
