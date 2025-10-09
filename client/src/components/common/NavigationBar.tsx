// import { Link } from 'react-router-dom';

// const Navbar: React.FC = () => {


//   const NavLink = ({ path, name }: { path: string, name: string }) => {
//     return (
//       <Link to={path}>{name}</Link>
//     )
//   }

//   return (
//     <>
//       <nav className='w-full fixed z-20 backdrop-blur-md bg-gradient-to-br md:border-none border-b border-gray-200 py-5 text-[#085776] flex justify-around'>
//         <div className='flex items-center gap-2 text-[#212834]'>
//           <Link to={'/'} className='text-xl orbitron-head'><span className='mozilla-headline-hero'>Cv</span> Gen</Link>
//         </div>
//         <div className='hidden sm:block space-x-6'>
//           <NavLink path='/' name='Home' />
//           <NavLink path='/dashboard' name='Builder' />
//           <NavLink path='/about' name='About' />
//         </div>
//       </nav>
//     </>
//   );
// };

// export default Navbar;









import React from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

const Navbar: React.FC = () => {
  const location = useLocation();

  const NavLink = ({
    path,
    name,
  }: {
    path: string;
    name: string;
  }) => {
    const isActive = location.pathname === path;
    return (
      <motion.div whileHover={{ scale: 1.05 }}>
        <Link
          to={path}
          className={`relative font-medium transition-colors duration-300 ${
            isActive ? "text-[#11a8e4]" : "text-[#212834] hover:text-[#11a8e4]"
          }`}
        >
          {name}
          {isActive && (
            <motion.span
              layoutId="active-link"
              className="absolute -bottom-1 left-0 right-0 h-[2px] bg-[#11a8e4] rounded-full"
            />
          )}
        </Link>
      </motion.div>
    );
  };

  const navItems = [
    { path: "/", name: "Home" },
    { path: "/dashboard", name: "Builder" },
    { path: "/about", name: "About" },
  ];

  return (
    <nav className="w-full fixed z-20 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-5 flex items-center gap-2 text-[#212834] justify-center md:justify-between py-4">
        {/* Logo */}
        <Link to={'/'} className='text-xl orbitron-head'><span className='mozilla-headline-hero'>Cv</span> Gen</Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <NavLink key={item.path} {...item} />
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
