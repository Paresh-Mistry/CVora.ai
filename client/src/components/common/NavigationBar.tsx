import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, CreditCard, CreditCardIcon, File, LayoutTemplate, LogOutIcon, Menu, Sparkles, Star, User, X, Zap } from "lucide-react";
import { useLogout, useUser } from "../../hooks/useAuth";
import { Button } from "../ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { useCredits } from "../../hooks/useAI";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

const Navbar: React.FC = () => {
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const navItems = [
    { path: "/", icon: Sparkles, name: "Features" },
    { path: "/dashboard", icon: LayoutTemplate, name: "Templates" },
    { path: "/pricing", icon: CreditCard, name: "Pricing" },
  ];

  const { data: credits } = useCredits();
  const totalRemaining =
    (credits?.ai.remaining ?? 0) +
    (credits?.ats.remaining ?? 0)

  const { data: user } = useUser();
  const logout = useLogout();
  console.log("User data : ", user)

  const NavLink = ({
    path,
    name,
    mobile = false,
    icon
  }: {
    path: string;
    name: string;
    mobile?: boolean;
    icon?: React.ElementType | any
  }) => {
    const isActive = location.pathname === path;
    const Icon = icon
    return (
      <motion.div
        whileHover={{ scale: mobile ? 1 : 1.05 }}
        onClick={() => setOpen(false)}
      >
        <Link
          to={path}
          className={`relative flex items-center gap-1.5 font-medium transition-colors duration-300 ${isActive
            ? "text-[#11a8e4]"
            : "text-[#212834] hover:text-[#11a8e4]"
            }`}
        >
          <Icon key={name} size={18} />
          {name}

          {isActive && !mobile && (
            <motion.span
              layoutId="active-link"
              className="absolute -bottom-1 left-0 right-0 h-[2px] bg-[#11a8e4] rounded-full"
            />
          )}
        </Link>
      </motion.div>
    );
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-white/80 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-5 py-3 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="text-xl orbitron-head">
            <span className="mozilla-headline-hero">Cv</span> Ora
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => {
              return (
                <NavLink key={item.path} {...item} />
              )
            })}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">

            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger className="flex focus:outline-none">
                  <Button variant="ghost">
                    <Avatar>
                      <AvatarImage
                        src="https://github.com/shadcn.png"
                        alt="@shadcn"
                      />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    {user.full_name}<ChevronDown />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>
                    <User />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <File />
                    <Link to={"/history"}>My Templates</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <CreditCardIcon />
                    Billing
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="bg-[#f6edd4]">
                    <Star fill="#eab420" />
                    {user.plan.toUpperCase()} Plan
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="bg-[#d4f0f6] mt-1"
                    title={`AI: ${credits?.ai.remaining} · ATS: ${credits?.ats.remaining}`}
                  >
                    <Zap fill="#46afc7" />
                    {totalRemaining} CREDITS
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={logout} variant="destructive">
                    <LogOutIcon />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) || (
                <Link
                  to="/login"
                  className="text-sm font-medium text-gray-700 hover:text-gray-900 transition"
                >
                  Login
                </Link>
              )}

            <Link
              to="/dashboard"
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2 rounded-full transition"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile Menu Button */}

          <div className="md:hidden flex items-center gap-3">
            <div>
              {user && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Avatar>
                      <AvatarImage
                        src="https://github.com/shadcn.png"
                        alt="@shadcn"
                      />
                      <AvatarFallback>CN</AvatarFallback>
                      {user.full_name}<ChevronDown />
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>
                      <User />
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <File />
                      <Link to={"/history"}>My Templates</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <CreditCardIcon />
                      Billing
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="bg-[#f6edd4]">
                      <Star fill="#eab420" />
                      {user.plan.toUpperCase()} Plan
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="bg-[#d4f0f6] mt-1"
                      title={`AI: ${credits?.ai.remaining} · ATS: ${credits?.ats.remaining}`}
                    >
                      <Zap fill="#46afc7" />
                      {totalRemaining} CREDITS
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={logout} variant="destructive">
                      <LogOutIcon />
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) || (
                  <Link
                    to="/login"
                    onClick={() => setOpen(false)}
                    className="text-center border border-gray-200 rounded-full py-2 font-medium"
                  >
                    Login
                  </Link>
                )}
            </div>
            <button
              aria-label="Toggle Menu"
              onClick={() => setOpen(!open)}
              className="md:hidden"
            >
              {open ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav >

      {/* Mobile Menu */}
      <AnimatePresence>
        {
          open && (
            <>
              <motion.div
                className="fixed inset-0 bg-black/20 z-40"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setOpen(false)}
              />

              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ duration: 0.25 }}
                className="fixed top-0 right-0 h-screen w-[280px] bg-white shadow-xl z-50 p-6"
              >
                <div className="flex justify-end mb-10">
                  <button onClick={() => setOpen(false)}>
                    <X size={24} />
                  </button>
                </div>

                <div className="flex flex-col gap-6">
                  {navItems.map((item) => (
                    <NavLink
                      key={item.path}
                      {...item}
                      mobile
                    />
                  ))}
                </div>

                <div className="mt-6 flex flex-col gap-4">
                  <Link
                    to="/dashboard"
                    onClick={() => setOpen(false)}
                    className="bg-blue-600 text-white text-center rounded-full py-2 font-medium"
                  >
                    Get Started
                  </Link>
                </div>
              </motion.div>
            </>
          )
        }
      </AnimatePresence >
    </>
  );
};

export default Navbar;