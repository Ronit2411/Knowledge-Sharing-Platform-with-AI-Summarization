import './globals.css'
import { Inter } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from '../components/providers/AuthProvider'
import { Header } from '../components/layout/Header'
import { Footer } from '../components/layout/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: process.env.NEXT_PUBLIC_APP_NAME || 'Knowledge Platform',
  description: process.env.NEXT_PUBLIC_APP_DESCRIPTION || 'Share and discover knowledge with AI-powered summaries',
  keywords: ['knowledge', 'articles', 'AI', 'summarization', 'learning'],
  authors: [{ name: 'Knowledge Platform Team' }],
  viewport: 'width=device-width, initial-scale=1',
  robots: 'index, follow',
  openGraph: {
    title: process.env.NEXT_PUBLIC_APP_NAME || 'Knowledge Platform',
    description: process.env.NEXT_PUBLIC_APP_DESCRIPTION || 'Share and discover knowledge with AI-powered summaries',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: process.env.NEXT_PUBLIC_APP_NAME || 'Knowledge Platform',
    description: process.env.NEXT_PUBLIC_APP_DESCRIPTION || 'Share and discover knowledge with AI-powered summaries',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full flex flex-col`}>
        <AuthProvider>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: '#10b981',
                  secondary: '#fff',
                },
              },
              error: {
                duration: 5000,
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  )
} 