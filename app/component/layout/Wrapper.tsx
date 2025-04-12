import React from 'react'
import Sidebar from './SideBar'
import SearchBar from './searchBar'

type WrapperProps = {
  children: React.ReactNode
}

const Wrapper = ({ children }: WrapperProps) => {
  return (
    <div className="bg-[#f3f2f7] min-h-screen">
      <Sidebar />
      <div className="flex-1 px-4 md:px-8 lg:px-[10%] pt-20 md:pt-8 pb-10 md:ml-64 bg-[#f3f2f7]">
        <SearchBar />
        <main className="mt-4">
          {children}
        </main>
      </div>
    </div>
  )
}

export default Wrapper
