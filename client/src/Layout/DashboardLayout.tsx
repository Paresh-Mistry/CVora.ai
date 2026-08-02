import { motion } from "framer-motion";
import Sidebar from "../components/common/Sidebar";
import Navbar from "../components/common/NavigationBar";

function LayoutBody({ children }) {

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="md:hidden"><Navbar /></div>
      <div className="flex md:pt-0 pt-15 bg-[#F7F9FC]">
        <Sidebar />
        <motion.section
          layout
          transition={{ type: "spring", stiffness: 400, damping: 40 }}
          className="flex-1 overflow-y-auto"
        >
          {children}
        </motion.section>
      </div>
    </main>
  );
}

export default function DashboardLayout({ children }) {
  return (
      <LayoutBody>{children}</LayoutBody>
  );
}