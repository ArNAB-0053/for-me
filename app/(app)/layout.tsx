import Header from '@/components/header';
import React from 'react'

const HomeLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className='px-0 lg:px-40 xl:px-49'>
        <Header/>
      {children}
    </div>
  )
}

export default HomeLayout
