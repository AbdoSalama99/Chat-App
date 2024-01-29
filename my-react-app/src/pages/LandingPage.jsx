import React from 'react'
import { Link } from 'react-router-dom'
import { FaArrowRight } from 'react-icons/fa'
import chatImg from '../assets/imgs/chatimg.jpg'

const LandingPage = () => {
  return (
    <div className='flex flex-wrap items-center justify-items-center h-screen w-screen lg:bg-white'>
      <div className='w-full h-full max-h-screen flex flex-col items-center justify-items-center p-[40px] rounded-2xl lg:p-[25px] bg-[#3498db] lg:w-1/2 lg:mr-0 lg:mx-auto  lg:rounded-tr-none lg:rounded-br-none lg:p-[35px] lg:h-[550px] lg:m-[50px] '>
        <div className='text-center max-w-full  mb-[32px]'>
          <h1 className='text-2xl font-bold text-white lg:text-4xl'>
            Join Our Chat Community
          </h1>
          <br />
          <p className='text-xl font-bold text-white leading-8'>
            Our community help you to commnicate with alot of people to make
            friends{' '}
          </p>
        </div>

        <div className='bg-white p-8 rounded-[8px] mt-8 lg:p-16'>
          <div className='flex gap-4 justify-between items-center mb-8'>
            <p className=' font-bold text-[#3498db]  flex gap-4 items-center'>
              if you already a member
              <FaArrowRight className='text-l  lg:text-2xl' />
            </p>

            <Link
              className='text-xl text-center bg-[#3498db] text-white p-4 w-[100px]  rounded-[8px]'
              to={'login'}
            >
              Login
            </Link>
          </div>
          <div className='flex gap-4 justify-between items-center'>
            <p className=' font-bold text-[#3498db]  flex gap-4 items-center'>
              Join To Us
              <FaArrowRight className='text-l lg:text-2xl ' />
            </p>
            <Link
              className='text-xl text-center bg-[#3498db] text-white p-4 w-[100px]   rounded-[8px]'
              to={'signup'}
            >
              Signup
            </Link>
          </div>
        </div>
      </div>

      <div className=' hidden flex items-center max-h-screen p-8 pl-[0px] w-[41%] lg:block '>
        <img
          src={chatImg}
          alt='chatImg'
          className='rounded-tr-[15px] rounded-br-[15px] h-[550px]'
        ></img>
      </div>
    </div>
  )
}

export default LandingPage
