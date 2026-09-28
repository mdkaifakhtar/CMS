import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Menu, X, LogOut, LayoutDashboard } from 'lucide-react';
import { logout } from '../features/auth/authSlice';
import NotificationBell from './NotificationBell';

const navPillClass = ({ isActive }) =>
  `px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
    isActive ? 'bg-volt-500 text-ink' : 'text-slate-300 hover:text-white'
  }`;

const Logo = () => (
  <Link to="/" className="flex items-center flex-shrink-0" aria-label="Car Wash Splash Point OKKAH">
    <img
      src="/images/logo.png"
      alt="Car Wash Splash Point OKKAH"
      className="h-12 sm:h-14 w-auto object-contain"
    />
  </Link>
);

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
    setOpen(false);
  };

  const roleHome = user?.role === 'admin' ? '/admin' : user?.role === 'vendor' ? '/vendor' : '/dashboard';

  return (
    <div className="sticky top-0 z-40 px-3 sm:px-4 pt-3">
      <header className="max-w-7xl mx-auto bg-ink/95 backdrop-blur border border-white/10 rounded-full shadow-lg">
        <div className="h-16 flex items-center justify-between px-3 sm:px-4">
          <Logo />

          <nav className="hidden md:flex items-center gap-0.5 bg-white/5 rounded-full p-1">
            <NavLink to="/" end className={navPillClass}>
              Home
            </NavLink>
            <NavLink to="/services" className={navPillClass}>
              Services
            </NavLink>
            <NavLink to="/vendor/register" className={navPillClass}>
              Become a vendor
            </NavLink>
          </nav>

          <div className="hidden md:flex items-center gap-2">
            {user ? (
              <>
                <NotificationBell />
                <Link
                  to={roleHome}
                  className="focus-ring flex items-center gap-1.5 text-sm font-medium text-white px-4 py-2 rounded-full border border-white/15 hover:bg-white/5 transition-colors"
                >
                  <LayoutDashboard size={15} /> {user.name.split(' ')[0]}
                </Link>
                <button
                  onClick={handleLogout}
                  className="focus-ring flex items-center gap-1.5 text-sm font-medium text-slate-300 hover:text-white px-3 py-2 rounded-full"
                >
                  <LogOut size={15} />
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="focus-ring text-sm font-medium text-white px-4 py-2 rounded-full border border-white/15 hover:bg-white/5 transition-colors"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="focus-ring text-sm font-semibold text-ink bg-volt-500 hover:bg-volt-400 px-4 py-2 rounded-full transition-colors"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>

          <button
            className="md:hidden focus-ring p-2 rounded-full text-white"
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {open && (
          <div className="md:hidden border-t border-white/10 px-5 py-4 space-y-1">
            <NavLink to="/" end onClick={() => setOpen(false)} className={navPillClass}>
              Home
            </NavLink>
            <NavLink to="/services" onClick={() => setOpen(false)} className={navPillClass}>
              Services
            </NavLink>
            <NavLink to="/vendor/register" onClick={() => setOpen(false)} className={navPillClass}>
              Become a vendor
            </NavLink>
            <div className="pt-3 mt-2 border-t border-white/10 flex flex-col gap-1">
              {user ? (
                <>
                  <div className="px-4 py-2">
                    <NotificationBell />
                  </div>
                  <Link to={roleHome} onClick={() => setOpen(false)} className="px-4 py-2 text-sm font-medium text-white flex items-center gap-1.5">
                    <LayoutDashboard size={15} /> Dashboard
                  </Link>
                  <button onClick={handleLogout} className="px-4 py-2 text-sm font-medium text-left text-slate-300 flex items-center gap-1.5">
                    <LogOut size={15} /> Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setOpen(false)} className="px-4 py-2 text-sm font-medium text-white">
                    Log in
                  </Link>
                  <Link to="/register" onClick={() => setOpen(false)} className="px-4 py-2 text-sm font-semibold text-volt-500">
                    Sign up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </header>
    </div>
  );
};

export { Logo };
export default Navbar;
