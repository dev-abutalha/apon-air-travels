'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';

export default function RouteLoader() {
  const pathname = usePathname();
  const prev = useRef(pathname);
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (pathname === prev.current) return;
    prev.current = pathname;

    setProgress(0);
    setVisible(true);

    const timer = setInterval(() => {
      setProgress((p) => {
        if (p >= 0.9) return p;
        return Math.min(0.9, p + (0.9 - p) * 0.25);
      });
    }, 90);

    const done = setTimeout(() => {
      clearInterval(timer);
      setProgress(1);
      setTimeout(() => {
        setVisible(false);
        setProgress(0);
      }, 250);
    }, 450);

    return () => {
      clearInterval(timer);
      clearTimeout(done);
    };
  }, [pathname]);

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 top-0 z-50 h-1 bg-transparent">
      <div
        className="h-full bg-gradient-to-r from-blue-500 via-sky-400 to-blue-600 shadow-[0_0_8px_rgba(59,130,246,0.6)] transition-[width] duration-150 ease-out"
        style={{ width: `${progress * 100}%` }}
      />
    </div>
  );
}
