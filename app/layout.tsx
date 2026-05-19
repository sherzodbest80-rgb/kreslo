import type { Metadata } from "next";
import Script from "next/script";
import { Inter, Manrope } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin", "cyrillic"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Damber — Ota-onalarini qadrlovchilar uchun | Premium massaj kreslolari",
  description:
    "Damber massaj kreslolari bilan ota-onangizni xursand qiling. O'zbekiston bo'ylab bepul yetkazib berish, 3 yil kafolat, 24/7 qo'llab-quvvatlash.",
  keywords: ["massaj kreslosi", "kreslo massajor", "Damber", "Tashkent", "O'zbekiston"],
  openGraph: {
    title: "Damber — Ota-onalarini qadrlovchilar uchun",
    description: "Premium massaj kreslolari, 3 yil kafolat, bepul yetkazib berish",
    type: "website",
    locale: "uz_UZ",
  },
};

// MUHIM: Damber uchun YANGI Pixel ID kiriting
// Facebook Events Manager'dan oling: business.facebook.com → Events Manager → Yangi Pixel
const META_PIXEL_ID = "1499115881892405"; // Bu yerga Damber Pixel ID kiriting

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="uz" className={`${inter.variable} ${manrope.variable}`}>
      <body className="font-sans bg-white">
        {children}

        {/* Meta Pixel Code */}
        <Script id="meta-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${META_PIXEL_ID}');
            fbq('track', 'PageView');
          `}
        </Script>
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
            alt=""
          />
        </noscript>
        {/* End Meta Pixel Code */}
      </body>
    </html>
  );
}
