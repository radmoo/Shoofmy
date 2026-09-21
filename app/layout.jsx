import "./globals.css";
import { SessionProvider } from "@/lib/context/SessionContext";
import { MissionProvider } from "@/lib/context/MissionContext";
import NetlifyBadgeKiller from "@/components/NetlifyBadgeKiller";

export const metadata = {
  title: "Shoofmy",
  description: "Voyez n'importe où, en direct, à travers les yeux d'un Reporter sur place.",
  icons: {
    icon: "/shoofmy-icon.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Big+Shoulders+Display:wght@600;700;800&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {/* SessionProvider = qui est connecté (participant/reporter), remplace le
           saut direct aux dashboards. MissionProvider = mission en cours, pour que
           Paiement -> Live -> Historique se parlent entre eux. */}
        <SessionProvider>
          <MissionProvider>{children}</MissionProvider>
        </SessionProvider>
        <NetlifyBadgeKiller />
      </body>
    </html>
  );
}
