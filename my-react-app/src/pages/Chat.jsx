import React, { useContext, useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserContext } from '../contexts/UserContext'
import Avatar from '../components/Avatar'
import customFetch from '../../../utils/CustomFetch'
import { EmojiPickerComponent } from '../components'

const Chat = () => {
  const divRef = useRef(null)
  const navigate = useNavigate()
  const [ws, setws] = useState()
  const [onlinePeople, setOnlinePeople] = useState({})
  const [offlinePeople, setOfflinePeople] = useState({})
  const [selectedUserId, setSelectedUserId] = useState('')
  const [newTextMsg, setNewTextMsg] = useState('')
  const [myMessages, setMyMessages] = useState([])
  const [showEmoji, setShowEmoji] = useState(false)
  const [onlinePeopleVisible, setOnlinePeopleVisible] = useState(false)
  const { loggingUsername, setLoggingUsername, loggingId, setLoggingId } =
    useContext(UserContext)

  const connectToWs = () => {
    const hostname = window.location.hostname
    const port = window.location.port
    const protocol = window.location.protocol === 'https:' ? 'wss://' : 'ws://'

    // Check if the port is explicitly specified, otherwise use a default
    const portSuffix = port ? `:${port}` : ''

    const websocketUrl = `${protocol}${hostname}${portSuffix}/websocket`

    const ws = new WebSocket(websocketUrl)
    setws(ws)
    ws.addEventListener('message', handleMessage)
    ws.addEventListener('close', () => {
      setTimeout(() => {
        console.log('reconnecting')
        connectToWs()
      }, 1000)
    })
  }

  useEffect(() => {
    connectToWs()
  }, [])

  // check if user authenticated and his data in the local storage
  useEffect(() => {
    const username = localStorage.getItem('username')
    const userId = localStorage.getItem('userId')
    if (!username && !userId) {
      navigate('/login')
    }
  }, [])

  // get messages with specific user
  useEffect(() => {
    if (selectedUserId) {
      const fetchMessages = async () => {
        const response = await customFetch('/messages/' + selectedUserId)
        setMyMessages(response.data)
        return
      }
      fetchMessages()
    }
  }, [selectedUserId])

  // handle incoming messages
  const handleMessage = (ev) => {
    const messageData = JSON.parse(ev.data)
    if ('online' in messageData) {
      storePeople(messageData.online, setOnlinePeople)
    } else if ('text' in messageData) {
      setMyMessages((prev) => [...prev, { ...messageData }])
    }
    return true
  }

  // convert people from arr to obj and store it
  const storePeople = (peopleArr, setFunc) => {
    const people = {}
    peopleArr.forEach((client) => {
      people[client._id] = client.username
    })
    // console.log(people)
    setFunc(people)
  }

  // get all users
  useEffect(() => {
    const getAllUsers = async () => {
      const response = await customFetch('/users')
      return response
    }
    getAllUsers().then((response) => {
      storePeople(response.data.users, setOfflinePeople)
    })
  }, [])

  Object.keys(onlinePeople).forEach((key) => {
    delete offlinePeople[key]
  })
  // delete the current user form online people
  delete onlinePeople[loggingId]

  // delete the current user form offline people
  delete offlinePeople[loggingId]

  // send messages
  const sendMessage = (e) => {
    e.preventDefault()
    ws.send(
      JSON.stringify({
        message: { recipient: selectedUserId, text: newTextMsg },
      })
    )
    setNewTextMsg('')
    setMyMessages((prev) => [
      ...prev,
      {
        text: newTextMsg,
        sender: loggingId,
        recipient: selectedUserId,
        _id: Date.now(),
      },
    ])
    return true
  }

  // auto scrolling
  useEffect(() => {
    const div = divRef.current
    if (div) {
      div.scrollIntoView({ behavior: 'smooth', block: 'end' })
    }
  }, [myMessages])

  // remove the repetitions and empty messages
  const messagesSet = myMessages.filter(
    // Check if the object is the first occurrence with the same id and text
    // Exclude messages with empty text
    ({ _id, text }, index, self) =>
      index === self.findIndex((o) => o._id === _id && o.text === text) &&
      text.trim() !== ''
  )

  // logout handler
  const handleLogout = async () => {
    const response = await customFetch.post('/auth/logout').then(() => {
      setws(null)
      setLoggingId(null)
      setLoggingUsername(null)
    })
    return navigate('/')
  }

  const handleChatsMenuClick = () => {
    setOnlinePeopleVisible(!onlinePeopleVisible)
  }

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth',
    })
    setSelectedUserId('')
  }, [onlinePeopleVisible])

  return (
    <div className='h-screen grid grid-cols-1 sm:grid-cols-4'>
      {/* chats info */}
      <div className='h-full sm:col-end-2'>
        <div className='z-40 bg-white fixed w-full text-lg text-gray-600 p-4 flex  items-center justify-between border-2 border-gray-300 shadow h-[10vh] sm:w-1/4 '>
          <div className='flex items-center gap-2'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='#3498db'
              viewBox='0 0 24 24'
              strokeWidth={1.5}
              stroke='#3498db'
              className='w-10 h-10'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z'
              />
            </svg>
            <p className='text-3xl text-[#3498db] font-bold'>MernChat</p>
          </div>
          <button
            onClick={handleChatsMenuClick}
            className='text-white bg-blue-500 p-2 text-2xl rounded-md sm:hidden'
          >
            chats menu
          </button>
        </div>

        <div className='h-[100vh]'>
          <div className='flex flex-col justify-between h-full '>
            {/* online and offline people */}
            <div className='mt-[10vh]'>
              {Object.keys(onlinePeople).map((userId) => (
                <div
                  onClick={() => setSelectedUserId(userId)}
                  key={userId}
                  className={
                    'border-b border-gray-100 flex items-center gap-2 cursor-pointer p-4 ' +
                    (selectedUserId === userId ? 'bg-blue-50' : '')
                  }
                >
                  <Avatar
                    userId={userId}
                    username={onlinePeople[userId]}
                    online={true}
                  />
                  <p className='min-w-[100px]'>{onlinePeople[userId]}</p>
                </div>
              ))}

              {Object.keys(offlinePeople).map((userId) => (
                <div
                  onClick={() => setSelectedUserId(userId)}
                  key={userId}
                  className={
                    'border-b border-gray-100 flex items-center gap-2 cursor-pointer p-4 ' +
                    (selectedUserId === userId ? 'bg-blue-50' : '')
                  }
                >
                  <Avatar
                    userId={userId}
                    username={offlinePeople[userId]}
                    online={false}
                  />
                  <p className='min-w-[100px]'>{offlinePeople[userId]}</p>
                </div>
              ))}
            </div>

            {/* logout container */}
            <div className='border border-gray-300 shadow-md flex gap-20 font-bold items-center justify-between pl-10 text-gray-600'>
              <span>Welcome {loggingUsername}</span>
              <button
                className='max-h-full p-4 bg-blue-500 text-white'
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* messages info */}
      <div
        className={
          'min-h-screen bg-blue-300  flex flex-col p-2 overflow-y-scroll sm:col-end-5 sm:col-start-2'
        }
      >
        {/* messages     */}
        <div className=' flex-grow w-full p-2  '>
          {!selectedUserId ? (
            <div className='text-2xl text-gray-600 m-auto text-center'>
              select chat from onlinePeople
            </div>
          ) : (
            <div className='pt-4 pr-4 pl-4 '>
              {messagesSet.map((message) => {
                return (
                  <div className='grid ' key={message._id}>
                    <p
                      className={
                        'pt-2 pb-2 pl-4 pr-4 mb-4 text-center w-fit rounded text-[18px] ' +
                        (message.sender === loggingId
                          ? 'bg-blue-600 text-white justify-self-end'
                          : 'bg-gray-400 text-white')
                      }
                    >
                      {message.text}
                    </p>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* send message form */}
        {selectedUserId && (
          <>
            <form
              className='flex gap-2 mb-4 ml-4 mr-4 rounded relative'
              onSubmit={sendMessage}
            >
              <input
                value={newTextMsg}
                onChange={(e) => setNewTextMsg(e.target.value)}
                placeholder='write the message'
                className='bg-white flex-grow border rounded-sm p-2 outline-0 '
              />

              <button
                className='bg-blue-500 p-2 text-white'
                type='button'
                onClick={() => setShowEmoji(!showEmoji)}
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth='1.5'
                  stroke='currentColor'
                  className='w-6 h-6'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z'
                  />
                </svg>
              </button>

              {showEmoji && (
                <EmojiPickerComponent
                  newTextMsg={newTextMsg}
                  setNewTextMsg={setNewTextMsg}
                  setShowEmoji={setShowEmoji}
                  showEmoji={showEmoji}
                />
              )}

              <button
                type='submit'
                className='bg-blue-500 p-2 text-white rounded-sm'
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={1.5}
                  stroke='currentColor'
                  className='w-6 h-6'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5'
                  />
                </svg>
              </button>
            </form>
            <div ref={divRef}></div>
          </>
        )}
      </div>
    </div>
  )
}

export default Chat
