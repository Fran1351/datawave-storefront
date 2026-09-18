"use client";

import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import Script from "next/script";
import { hasAnalyticsConsent } from "@/app/lib/cookie-consent";

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

export default function GoogleAnalytics() {
  const [consentGiven, setConsentGiven] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Se fija el consentimiento al montar, y escucha si el usuario lo cambia
  // (por ejemplo, tocando "Aceptar" en el banner sin recargar la página).
  useEffect(() => {
    setConsentGiven(hasAnalyticsConsent());

    const handleConsentChange = () => setConsentGiven(hasAnalyticsConsent());
    window.addEventListener("cookie-consent-changed", handleConsentChange);
    return () => window.removeEventListener("cookie-consent-changed", handleConsentChange);
  }, []);

  // Next.js (App Router) navega sin recargar la página, así que hay que
  // avisarle a GA manualmente cada vez que cambia la ruta.
  useEffect(() => {
    if (!consentGiven || !GA_MEASUREMENT_ID || typeof window.gtag !== "function") return;

    const query = searchParams.toString();
    const url = query ? `${pathname}?${query}` : pathname;
    window.gtag("config", GA_MEASUREMENT_ID, { page_path: url });
  }, [pathname, searchParams, consentGiven]);

  if (!consentGiven || !GA_MEASUREMENT_ID) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}');
        `}
      </Script>
    </>
  );
}