import { Inter } from 'next/font/google'
import { AuthProvider } from '../hooks/useAuth';
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'TechPulse - Latest Technology News, Reviews and Guides',
  description: 'Stay updated with the latest technology trends, reviews, and buying guides for gadgets, software, and tech innovations.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        {/* Google AdSense will be added through next/script in production */}
      </head>
      <body className={inter.className}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}