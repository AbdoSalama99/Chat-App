import React, { useContext, useState } from 'react'
import { FaUser } from 'react-icons/fa'
import { Link, useNavigate } from 'react-router-dom'
import FormRow from '../components/FormRow'
import { UserContext } from '../contexts/UserContext'
import customFetch from '../../../utils/CustomFetch'
import { toast } from 'react-toastify'

const Login = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const { setLoggingUsername, setLoggingId } = useContext(UserContext)

  const navigate = useNavigate()

  const handlerSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await customFetch.post('/auth/login', {
        username,
        password,
      })
      toast(response.data.msg)
      const user = response.data.user
      setLoggingUsername(user.username)
      setLoggingId(user._id)
      navigate('/chatPage')
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
      <div className='w-[300px] max-w-full p-[30px] flex flex-col items-center justify-center bg-white shadow-md rounded  '>
        <div className='flex flex-col justify-center items-center gap-2 mb-[50px]'>
          <FaUser className='text-[60px] text-[#3498db] ' />
          <p className=' text-2xl text-[#3498db]'>Login</p>
        </div>

        <div className='w-[250px]'>
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
            login
          </button>

          <div className='mt-6'>
            <p className='flex items-center justify-between text-[#3498db] text-l'>
              Join if not member{' '}
              <Link
                className='text-xl text-center bg-[#3498db] text-white p-4 w-[100px]  rounded-[8px]'
                to={'/signup'}
              >
                Signup
              </Link>
            </p>
          </div>
        </div>
      </div>
    </form>
  )
}

export default Login
