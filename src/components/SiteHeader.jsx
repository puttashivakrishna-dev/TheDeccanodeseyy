import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import BrandMark from '@/components/BrandMark';

const NAV = [
  { to: '/', label: 'Home' },
  { to: '/explore', label: 'Explore' },
  { to: '/plan', label: 'Plan a Trip' },
  { to: '/saved', label: 'Saved Trips' },
];

export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setOpen(false);
  }, [location.pathname, location.search]);

  return (
    <header className="no-print sticky top-0 z-40 border-b border-ink/10 bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-[72px] max-w-6xl items-center justify-between gap-6 px-5 sm:px-8">
        <BrandMark compact />

        <nav aria-label="Primary" className="hidden items-center gap-1 md:flex">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `relative rounded-full px-4 py-2 text-[13.5px] transition-colors duration-300 ${
                  isActive
                    ? 'text-ink'
                    : 'text-muted-foreground hover:text-ink'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {item.label}
                  <span
                    className={`absolute inset-x-4 -bottom-0.5 h-px origin-left bg-clay transition-transform duration-300 ${
                      isActive ? 'scale-x-100' : 'scale-x-0'
                    }`}
                    aria-hidden="true"
                  />
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="hidden md:block">
          <Link
            to="/plan"
            className="inline-flex items-center rounded-full bg-ink px-5 py-2.5 text-[13px] font-medium text-ivory transition-colors duration-300 hover:bg-clay"
          >
            Plan My Trip
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? 'Close menu' : 'Open menu'}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-ink/15 text-ink md:hidden"
        >
          {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </div>

      {open && (
        <div id="mobile-nav" className="border-t border-ink/10 bg-background md:hidden">
          <nav aria-label="Mobile" className="mx-auto flex max-w-6xl flex-col px-5 py-3">
            {NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `border-b border-border/70 py-3.5 text-[15px] last:border-0 ${
                    isActive ? 'text-clay' : 'text-ink'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
            <Link
              to="/plan"
              className="my-3 inline-flex items-center justify-center rounded-full bg-ink px-5 py-3 text-sm font-medium text-ivory"
            >
              Plan My Trip
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}