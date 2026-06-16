import './globals.css';

export const metadata = {
  title: 'Job Tracker · Francisco Soto',
  description: 'Seguimiento de postulaciones laborales en Santiago, Chile',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
