import type { Metadata } from "next"
export const dynamic = "force-dynamic";

import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import NextTopLoader from 'nextjs-toploader'
import { CartProvider } from "@/components/providers/cart-provider"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { getCurrentUser } from "@/lib/auth"
import { fetchAllCategories } from "@/lib/products"
import { getSettings } from "@/lib/settings"
import { WhatsAppFloat } from "@/components/whatsapp-float"
import Script from "next/script"
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export async function generateMetadata(): Promise<Metadata> {
  // Try to fetch settings using cached helper
  const settings = await getSettings();
  if (settings) {
    console.log("Settings from generateMetadata (cached):", settings);
  }

  const defaultDescription = "Discover authentic, handcrafted shawls from the historic Khyber region. Each piece tells a story of tradition and artistry.";

  return {
    metadataBase: new URL(
      process.env.NODE_ENV === "production" ? "https://khybershawls.store" : "http://localhost:3000"
    ),
    title: {
      default: settings?.websiteName || "Khyber Shawls",
      template: `%s | ${settings?.websiteName || "Khyber Shawls"}`,
    },
    description: defaultDescription,
    openGraph: {
      title: settings?.websiteName || "Khyber Shawls",
      description: defaultDescription,
      url: "/",
      siteName: settings?.websiteName || "Khyber Shawls",
      images: [
        {
          url: settings?.websiteLogoUrl || "/logo.png",
          width: 1200,
          height: 630,
        },
      ],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: settings?.websiteName || "Khyber Shawls",
      description: defaultDescription,
      images: [settings?.websiteLogoUrl || "/logo.png"],
    },
    icons: {
      icon: settings?.websiteFaviconUrl || "/favicon.ico",
      shortcut: settings?.websiteFaviconUrl || "/favicon.ico",
      apple: settings?.websiteFaviconUrl || "/favicon.ico",
    },
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let user: any = null;
  let categories: any[] = [];
  let settings: any = null;

  try {
    user = await getCurrentUser();
    categories = await fetchAllCategories();
    settings = await getSettings();
  } catch (error) {
    console.error("Critical Layout Data Fetch Error:", error);
    // Fallback defaults are already set above
  }

  return (
    <html lang="en">
      <head>
        {/* Smartlook Analytics using next/script */}
        <Script id="smartlook-loader" strategy="afterInteractive">
          {`
            window.smartlook||(function(d) {
              var o=smartlook=function(){ o.api.push(arguments)},h=d.getElementsByTagName('head')[0];
              var c=d.createElement('script');o.api=new Array();c.async=true;c.type='text/javascript';
              c.charset='utf-8';c.src='https://web-sdk.smartlook.com/recorder.js';h.appendChild(c);
            })(document);
            smartlook('init', '593412ebdbe8f7d5f6289953ac3292fffe9670f9', { region: 'eu' });
          `}
        </Script>
      </head>
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} flex min-h-screen flex-col bg-background antialiased`}
      >
        <CartProvider>
          <NextTopLoader color="#b45309" showSpinner={false} />
          <SiteHeader user={user} categories={categories} />
          <main className="flex-1 overflow-clip">
            <div className="mx-auto px-3 pt-8 pb-12">{children}</div>
          </main>
          <SiteFooter settings={settings} />
        </CartProvider>
        <WhatsAppFloat />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
