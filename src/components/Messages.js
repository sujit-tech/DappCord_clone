import { useEffect, useState, useRef } from 'react'
import { io } from "socket.io-client"

// Assets
import person from '../assets/person.svg'
import send from '../assets/send.svg'

// Socket
const socket = io('ws://localhost:3030')

const Messages = ({ account, messages, currentChannel }) => {
  const [message, setMessage] = useState("")
  const messageEndRef = useRef(null)
  const sendMessage = async (e) => {
    e.preventDefault()
    const messageObj = {
      channel: currentChannel.id.toString(),
      account: account,
      text: message
    }
    if (message !== "") {
      socket.emit('new message', messageObj)
    } setMessage("")
  }
  const scrollHandler = () => {
    setTimeout(() => {
      messageEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }, 500)
  }

  useEffect(() => {
    scrollHandler()
  })
  return (
    <div className="text">
      <div className="messages">
        {currentChannel && messages.filter(messaage => messaage.channel === currentChannel.id.toString()).map((messaage, index) => (
          <div className='message' key={index}>
            <img src={person} alt='person' />
            <div className='message__content'>
              <h3>{messaage.account.slice(0, 6) + "..." + messaage.account.slice(38, 42)}</h3>
              <p>
                {messaage.text}
              </p>
            </div>
          </div>
        ))}
        <div ref={messageEndRef}></div>
      </div>
      <form onSubmit={sendMessage}>
        {currentChannel && account ? (
          <input type='text' value={message} placeholder={`messaging on#${currentChannel}`} onChange={(e) => setMessage(e.target.value)} />) :
          (<input type='text' value="" placeholder={"only channel joiners can sent message"} disabled />)}
        <button type='submit'>
          <img src={send} alt='send message' />
        </button>
      </form>

    </div>
  );
}

export default Messages;