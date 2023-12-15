import React from 'react'
import { Link } from 'react-router-dom'
import { FaArrowRight } from 'react-icons/fa'
import chatImg from '../assets/imgs/chatimg.jpg'

const LandingPage = () => {
  return (
    <div className='custom-grid '>
      <div className='main-div'>
        <div className='text-center max-w-full w-[500px] mb-[32px]'>
          <h1 className='text-4xl font-bold text-white '>
            <span className='text-[#3498db]'>Join</span> Our{' '}
            <span className='text-[#3498db]'>Chat</span> Community
          </h1>
          <br />
          <p className='text-xl font-bold text-gray-300 leading-8'>
            Our community help you to commnicate with alot of people to make
            friends{' '}
          </p>
        </div>
        <div className='bg-blue-500 p-16 rounded-[8px] mt-8'>
          <div className='flex gap-4 justify-between items-center mb-8'>
            <p className='text-xl font-bold text-gray-300 leading-8 flex gap-4 items-center'>
              if you already a member
              <FaArrowRight className='text-2xl text-gray-300' />
            </p>

            <Link
              className='text-xl text-center bg-gray-500 text-white p-4 w-[100px]  rounded-[8px]'
              to={'login'}
            >
              Login
            </Link>
          </div>
          <div className='flex gap-4 justify-between items-center'>
            <p className='text-xl font-bold text-gray-300 leading-8 flex gap-4 items-center'>
              Join To Us
              <FaArrowRight className='text-2xl text-gray-300' />
            </p>
            <Link
              className='text-xl text-center bg-gray-500 text-white p-4 w-[100px]   rounded-[8px]'
              to={'signup'}
            >
              Signup
            </Link>
          </div>
        </div>
      </div>
      <div className='hidden pt-12 pr-16 lg:block'>
        <img
          src={chatImg}
          alt='chatImg'
          className='rounded-tr-[50px] h-full'
        ></img>
      </div>
    </div>
  )
}

export default LandingPage
