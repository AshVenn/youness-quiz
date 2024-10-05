// components/LayoutWrapper.tsx
'use client';

import { usePathname } from 'next/navigation';
import Navbar from './Navbar';

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const excludedPaths = ['/user', '/admin'];

  // Check if the current path starts with any of the excluded paths
  const isExcluded = excludedPaths.some((path) => pathname.startsWith(path));

  return (
    <>
      {!isExcluded && <Navbar />}
      {children}
    </>
  );
}
