import React from 'react';

const Layout = ({ children }:any) => {
  return (
    <div>
      <div className="min-h-screen bg-gradient-to-br from-blue-400 via-blue-600 to-blue-800 dark:from-blue-900 dark:via-blue-950 dark:to-black">
        {children}
      </div>
    </div>
  )
}

export default Layout;