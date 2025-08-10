import React, { ReactNode } from 'react';

interface LayoutwrapProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutwrapProps> = ({ children }) => {
  return (
    <div className="mx-auto pt-16">
      <div className="font">{children}</div>
    </div>
  );
};

export default Layout;
