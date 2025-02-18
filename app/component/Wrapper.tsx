import React from 'react'
import Sidebar from './SideBar'
import SearchBar from './searchBar'

type WrapperProps = {
  children: React.ReactNode
}

const Wrapper = ({ children }: WrapperProps) => {
  return (
    <div className="flex bg-[#f3f2f7] h-screen">

      <Sidebar />

      <div className="flex-1 px-5 md:px-[10%] mt-8 mb-10 ml-64">
        <SearchBar />
        {children}
      </div>
    </div>
  )
}

export default Wrapper
