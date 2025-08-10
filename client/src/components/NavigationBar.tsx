import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {


  const NavLink = ({ path, name }: { path: string, name: string }) => {
    return (
      <Link to={path}>{name}</Link>
    )
  }

  return (
    <>
      <nav className='w-full fixed z-20 backdrop-blur-md bg-gradient-to-br md:border-none border-b border-gray-200 py-5 text-[#085776] flex justify-around'>
        <div className='flex items-center gap-2 text-[#212834]'>
          <Link to={'/'} className='text-xl orbitron-head'><span className='mozilla-headline-hero'>Cv</span> Gen</Link>
        </div>
        <div className='hidden sm:block space-x-6'>
          <NavLink path='/' name='Home' />
          <NavLink path='/dashboard' name='Builder' />
          <NavLink path='/about' name='About' />
        </div>
      </nav>
    </>
  );
};

export default Navbar;