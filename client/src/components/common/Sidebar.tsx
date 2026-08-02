import { Link, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
    LayoutDashboard,
    Users,
    BarChart3,
    HelpCircle,
    ChevronsLeft,
    LogOut,
    Home,
} from "lucide-react";
import { cn } from "../../lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useLogout, useUser } from "../../hooks/useAuth";
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";
import { useSidebarStore } from "../../store/sidebar.store";

const NAV_ITEMS = [
    { label: "Home", to: "/", icon: Home },
    { label: "Dashboard", to: "/dashboard", icon: LayoutDashboard },
    { label: "My Resumes", to: "/history", icon: Users },
    { label: "Analytics", to: "/analytics", icon: BarChart3 },
];

export default function Sidebar() {
    const { pathname } = useLocation();
    const { collapsed, toggleCollapsed, mobileOpen, setMobileOpen } = useSidebarStore();
    const { data: user } = useUser()
    const railWidth = collapsed ? 72 : 240;
    const { mutate: logout, isPending } = useLogout();

    const content = (
        <nav className="flex h-full flex-col py-4">
            {!collapsed && (
                <>
                    <Link to="/" className="text-xl mx-auto pb-3 orbitron-head">
                        <span className="mozilla-headline-hero">Cv</span> Ora
                    </Link>
                    <Separator />
                </>)
            }
            <div className="my-3 flex items-center mx-3">
                <Avatar className={cn(!collapsed ? "w-12 h-12" : "w-10 h-10 mx-auto")}>
                    <AvatarImage
                        src={user?.image || "https://github.com/shadcn.png"}
                        alt={user?.full_name}
                        className="object-cover"
                    />
                    <AvatarFallback>
                        {user?.full_name?.charAt(0) ?? "U"}
                    </AvatarFallback>
                </Avatar>
                {!collapsed && <div className="flex flex-col gap-1">
                    <span className="ml-2">{user?.full_name}</span>
                    <Badge variant={"secondary"} className="ml-2 text-xs">{user?.email}</Badge>
                </div>}
            </div>
            <ul className="flex flex-1 flex-col my-3 gap-1 px-3">
                {NAV_ITEMS.map((item) => {
                    const active = pathname === item.to;
                    const Icon = item.icon;
                    return (
                        <li key={item.to} className="relative">
                            {active && (
                                <motion.div
                                    layoutId="active-nav-pill"
                                    className="absolute inset-0 rounded-full"
                                    transition={{ type: "spring", stiffness: 500, damping: 40 }}
                                />
                            )}
                            <Link
                                to={item.to}
                                className={cn(
                                    "relative z-10 flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                                    active
                                        ? "text-black"
                                        : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                                )}
                            >
                                <Icon className="h-[18px] w-[18px] shrink-0" strokeWidth={2} />
                                <AnimatePresence initial={false}>
                                    {!collapsed && (
                                        <motion.span
                                            initial={{ opacity: 0, width: 0 }}
                                            animate={{ opacity: 1, width: "auto" }}
                                            exit={{ opacity: 0, width: 0 }}
                                            transition={{ duration: 0.15 }}
                                            className="overflow-hidden whitespace-nowrap"
                                        >
                                            {item.label}
                                        </motion.span>
                                    )}
                                </AnimatePresence>
                            </Link>
                        </li>
                    );
                })}
            </ul>

            <div className="mt-auto flex flex-col gap-1 px-3">
                <Link
                    to="/dashboard/help"
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
                >
                    <HelpCircle className="h-[18px] w-[18px] shrink-0" strokeWidth={2} />
                    {!collapsed && <span className="whitespace-nowrap">Help</span>}
                </Link>

                <button className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
                    onClick={() => logout()}
                    disabled={isPending}
                >
                    <LogOut className="h-[18px] w-[18px] shrink-0" strokeWidth={2} />
                    {!collapsed && <span className="whitespace-nowrap">Logout</span>}
                </button>

                <span
                    onClick={toggleCollapsed}
                    className="absolute top-[50%] -right-3 bg-white p-1 rounded-full border"
                >
                    <motion.span
                        animate={{ rotate: collapsed ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                        className="flex shrink-0"
                    >
                        <ChevronsLeft className="h-[18px] w-[18px]" strokeWidth={2} />
                    </motion.span>
                </span>
            </div>
        </nav>
    );

    return (
        <>
            {/* Desktop rail — animates width */}
            <motion.aside
                animate={{ width: railWidth }}
                transition={{ type: "spring", stiffness: 400, damping: 40 }}
                className="sticky top-0 hidden h-screen shrink-0 border-r border-slate-200 bg-white lg:block"
            >
                {content}
            </motion.aside>

            {/* Mobile drawer — slides in over the content */}
            <AnimatePresence>
                {mobileOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => (setMobileOpen as (open: boolean) => void)(false)}
                            className="fixed inset-0 z-40 bg-slate-900/30 lg:hidden"
                        />
                        <motion.aside
                            initial={{ x: -280 }}
                            animate={{ x: 0 }}
                            exit={{ x: -280 }}
                            transition={{ type: "spring", stiffness: 400, damping: 40 }}
                            className="fixed inset-y-0 left-0 z-50 w-[240px] border-r border-slate-200 bg-white lg:hidden"
                        >
                            {content}
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
