import type { Metadata } from "next";
import "./globals.css";
import { SessionProvider } from "@/components/providers/SessionProvider";

export const metadata: Metadata = {
  title: "Acrecer | Crecimiento real para influencers y marcas",
  description:
    "Acrecer potencia el crecimiento orgánico de influencers y marcas en Instagram y TikTok: targeting inteligente, growth managers dedicados y campañas de influencer marketing.",
  metadataBase: new URL("https://acrecermarketing.example"),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
