import React, { useContext, useEffect, useRef, useState } from 'react'
import { Avatar, Button, Input, ScrollShadow } from "@nextui-org/react";
import { IoSendSharp } from "react-icons/io5";
import { Context } from '../main';
import { useAuthState } from 'react-firebase-hooks/auth';
import Loader from './loader/Loader';
import { addDoc, collection, onSnapshot, orderBy, query, serverTimestamp } from 'firebase/firestore';
import { useCollection } from 'react-firebase-hooks/firestore';
import { useTheme } from 'next-themes';

const Chat = () => {
  const { auth, firestore } = useContext(Context)
  const [user] = useAuthState(auth)

  const [value, setValue] = useState('')
  const [message, setMessage] = useState([])

  const valueRef = collection(firestore, 'messages')
  const [snapshot, loading, error] = useCollection(valueRef)

  const {theme} = useTheme()

  // getting all messages from db
  useEffect(() => {
    const queryMessages = query(valueRef, orderBy('createdAt', 'asc'))
    const getMess = onSnapshot(queryMessages, (snapshot) => {
      let messages = []
      snapshot.forEach(doc => {
        messages.push({ ...doc.data(), id: doc.id })
      })
      setMessage(messages)
    })
    return () => getMess()
  }, [])

  // submit message in chat
  const submit = async (e) => {
    e.preventDefault()

    if (!Boolean(value)) return
    await addDoc(valueRef, {
      uid: user.uid,
      displayName: user.displayName,
      photoURL: user.photoURL,
      text: value,
      user: user.displayName,
      createdAt: serverTimestamp()
    })
    setValue('')
  }



  const messageEndRef = useRef(null); // Ссылка на конец чата
  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom(); // прокрутка вниз при загрузке
  }, [message]); // Срабатывает каждый раз, когда сообщения обновляются


  if (loading) return <Loader />

  

  return (
    <div className={ ` h-screen pt-[64px] m-auto container ${theme} text-3xl flex  flex-col gap-4 items-start  `}>
      <ScrollShadow className="w-full dark:bg-stone-950 bg-zinc-50 rounded-2xl dark:bg-[url('./../images/chat_bg-dark.jpg')] bg-[url('./../images/chat-bg-light.png')]  mt-4 h-3/4 overflow-y-auto">

        {
          snapshot ?
            message.map((mess) => (
              <div key={mess.uid} className={`flex gap-5 p-5 items-center ${user.uid === mess.uid ? 'justify-end' : 'justify-start'}`}>

                <Avatar
                  isBordered
                  as="button"
                  className={`transition-transform ${user.uid === mess.uid ? 'order-2' : ''}`}
                  color="secondary"
                  size="sm"
                  src={`${mess.photoURL}`}
                />
                <div className='text-base w-64  chat dark:bg-[rgb(2,0,36)]  text-white max-h-72 break-words p-2 rounded-md'>{mess.text}</div>
              </div>
            )) : ''
        }
        <div ref={messageEndRef}></div>
      </ScrollShadow>

      <div className='w-full flex items-center'>
        <form onSubmit={submit} className='w-full flex items-center' onKeyDown={(e) => e.key === 'Enter' && submit}>
          <Input label="Message" className='h-14 ' radius='none' value={value} placeholder="Enter your Message" maxLength={500} onChange={e => setValue(e.target.value)} />
          <Button color='primary' type='submit' className='text-2xl rounded-l-none h-14 ' endContent={<IoSendSharp />}></Button>
        </form>
      </div>
    </div>
  )
}

export default Chat