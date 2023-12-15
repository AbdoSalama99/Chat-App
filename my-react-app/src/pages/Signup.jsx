import React, { useState } from 'react'
import { FaUser } from 'react-icons/fa'
import { Link, useNavigate } from 'react-router-dom'
import FormRow from '../components/FormRow'
import customFetch from '../../../utils/CustomFetch'
import { toast } from 'react-toastify'

const Signup = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handlerSubmit = async (e) => {
    try {
      e.preventDefault()
      const response = await customFetch.post('/auth/signup', {
        username,
        password,
      })
      toast(response.data.msg)
      navigate('/login')
    } catch (error) {
      toast(error.response.data.msg)
      return error
    }
  }

  return (
    <form
      method='post'
      onSubmit={handlerSubmit}
      className='bg-[#3498db] h-screen  w-full flex items-center justify-center'
    >
      <div className='w-[350px] p-[30px] flex flex-col items-center justify-center bg-white shadow-md rounded  '>
        <div className='flex flex-col justify-center items-center gap-2 mb-[50px]'>
          <FaUser className='text-[60px] text-[#3498db] ' />
          <p className=' text-2xl text-[#3498db]'>Signup</p>
        </div>

        <div className='w-[300px]'>
          <FormRow
            type='text'
            name='username'
            placeholder='username'
            onChange={(e) => setUsername(e.target.value)}
          ></FormRow>

          <FormRow
            type='password'
            name='password'
            labelText='Password'
            placeholder='password'
            onChange={(e) => setPassword(e.target.value)}
          ></FormRow>

          <button
            className='w-full h-[50px] rounded text-white text-xl bg-[#3498db]'
            type='submit'
          >
            signup
          </button>

          <div className='mt-6'>
            <p className='flex items-center justify-between text-[#3498db] text-l'>
              Already member{' '}
              <Link
                className='text-xl text-center bg-[#3498db] text-white p-4 w-[100px]  rounded-[8px]'
                to={'/login'}
              >
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </form>
  )
}

export default Signup
