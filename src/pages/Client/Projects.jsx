import React from 'react';
import banner from '@/assets/banner.png'
import bannermob from '@/assets/bannermob.png'

function Projects() {
  return (
    <div className="bg-[#F8F8F8] w-full px-4 md:px-10 absolute">
      <div className="w-full items-center mt-10 pb-3">
        <div className='flex flex-col gap-2'>
          <h1 className="text-2xl font-[600] text-[#202224]">Projects</h1>
          <p className="text-[#666666] text-sm text-[500] pb-3">Manage your projects</p>
        </div>

        <img src={banner} alt="banner" className='w-full -mt-5 -ml-10 hidden md:block' />
        <img src={bannermob} alt="banner" className='w-full -mt-5 block md:hidden' />
      </div>
    </div>
  );
}

export default Projects; 