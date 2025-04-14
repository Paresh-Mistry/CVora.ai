import { Menu } from 'lucide-react';
import React from 'react';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
    return (
      <>
      <nav className='flex md:justify-around justify-between md:px-0 px-3 md:py-5 py-3  items-center'>
        <div className='flex items-center gap-2 text-red-500'>
          <h1 className='text-xl font-semibold'>CV Gen</h1>
        </div>
        <div className='hidden sm:block space-x-6'>
          <Link to={'/'}>Home</Link>
          <Link to={'/dashboard'}>AI Generate</Link>
        </div>
        <div className='md:hidden'>
          <Menu/>
        </div>
      </nav>
    </>
    );
};

export default Navbar;