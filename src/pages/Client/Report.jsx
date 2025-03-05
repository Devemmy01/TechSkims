import React from 'react'
import ProjectAnalytics from './components/ProjectAnalytics'

const Report = () => {
  return (
    <div className="bg-[#F8F8F8] w-full px-4 md:px-10 absolute lg:w-[calc(100%-256px)] h-screen overflow-y-scroll scrollbar-custom">
      <style jsx>{`
            .scrollbar-custom::-webkit-scrollbar {
              width: 4px;
              height: 4px;
            }
            .scrollbar-custom::-webkit-scrollbar-track {
              background: #f1f1f1;
              border-radius: 4px;
            }
            .scrollbar-custom::-webkit-scrollbar-thumb {
              background: #888;
              border-radius: 4px;
            }
            .scrollbar-custom::-webkit-scrollbar-thumb:hover {
              background: #555;
            }
          `}</style>
      <ProjectAnalytics />
    </div>
  )
}

export default Report