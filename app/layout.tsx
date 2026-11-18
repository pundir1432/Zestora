import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { HospitalityProvider } from '@/context/HospitalityContext';

export const metadata: Metadata = {
  title: 'Zestora — Unified Hospitality SaaS (Restaurant, Hotel, Hostel, Camp & Compliance)',
  description: 'All-in-one Hospitality Cloud OS for Restaurants, Cafes, Hotels, Homestays, Hostels, Adventure Camps, Form III FRRO & GST Compliance.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" 
          rel="stylesheet" 
        />
      </head>
      <body style={{ fontFamily: "'Inter', sans-serif" }}>
        <AuthProvider>
          <HospitalityProvider>
            {children}
          </HospitalityProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
