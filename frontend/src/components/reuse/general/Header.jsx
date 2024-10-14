import React from 'react'

const Header = () => {
  return (
    <div className='bg-slate-50'>
        <div className='flex justify-around pt-14 pb-6 font-medium'>
            <div className='flex'>
                <p className='mr-14'>Contact</p>
                <p className='mr-14'>About</p>
                <p className='mr-14'>Feedback</p>
                <p className='mr-14'>Blog</p>
            </div>
            <div className='flex'>
                <p className='mr-14 text-blue-500'>Login</p>
                <p className='mr-14 text-blue-500 shadow-xl bg-white p-1 rounded-2xl -m-1 pl-3 pr-3 hover:scale-110'>Register</p>
            </div>
        </div>
    </div>
  )
}

export default Header
