import React, { ReactNode } from 'react';
import Navbar from '../components/common/NavigationBar';

interface LayoutwrapProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutwrapProps> = ({ children }) => {
  return (
    <main>
      <Navbar />
      <div className="mx-auto pt-16">
        <div className="font">{children}</div>
      </div>
    </main>
  );
};

export default Layout;
