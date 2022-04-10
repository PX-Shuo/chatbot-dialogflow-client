import React, { useEffect } from 'react'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'


import { saveMessage } from '../_actions/message_actions'
import MessageItem from './MessageItem'

const Chatbot = () => {

  const dispatch = useDispatch()
  const msgFromRedux = useSelector(state => state.message.messages)

  // show greeting message when app first launch
  useEffect(() => {
    const eventQuery = async (event) => {

      // 2. take care of the message Chatbot sent
  
      const eventQueryVariables = {
        event
      }
  
      try {
        
        // send request to the textQuery route
        const response = await axios.post('https://dialogflow.transcribestreamingapp.store/api/dialogflow/eventQuery', eventQueryVariables)
        for (let content of response.data.fulfillmentMessages) {
          let conversation = {
            who: 'Chatbot',
            content: content
          }
    
          dispatch(saveMessage(conversation))
        }
  
      } catch (err) {
  
        let conversation = {
          who: 'Chatbot',
          content: {
            text: {
              text: 'Error occured'
            }
          }
        }
  
        dispatch(saveMessage(conversation))
  
      }
    }
    eventQuery('initializeChatBot')
  },[dispatch])

  const textQuery = async (text) => {

    // 1. take care of the message I sent
    let conversation = {
      who: 'user',
      content: {
        text: {
          text: text
        }
      }
    }

    dispatch(saveMessage(conversation))

    // 2. take care of the message Chatbot sent

    const textQueryVariables = {
      text
    }

    try {
      
      // send request to the textQuery route
      const response = await axios.post('https://dialogflow.transcribestreamingapp.store/api/dialogflow/textQuery', textQueryVariables)
      
      for (let content of response.data.fulfillmentMessages) {
        conversation = {
          who: 'Chatbot',
          content: content
        }
  
        dispatch(saveMessage(conversation))
      }


    } catch (err) {

      conversation = {
        who: 'Chatbot',
        content: {
          text: {
            text: 'Error occured'
          }
        }
      }

      dispatch(saveMessage(conversation))

    }
  }


  


  // When Enter is pressed, do this
  const keyDownHandler = (e) => {
    if(e.key==='Enter') {
      if(!e.target.value) {
        return alert('Please type something before sending')
      }

      // send request to text query route
      textQuery(e.target.value)

      e.target.value = ''
    }
  }

  const renderSingleMsg = (msg, i) => {
    return (
      <MessageItem key={i} who={msg.who} text={msg.content.text.text} />
    )
  }
  const rendermsg = (returnedMessages) => {
    if(returnedMessages) {
      return returnedMessages.map((msg, i) => {
        return renderSingleMsg(msg, i)
      })
    } else {
      return null
    }
  }

  return (
    <div style={{
      height: 700, width: 700,
      border: '3px solid black', borderRadius: '7px'
    }}>
      <div style={{ height: 644, width: '100%', overflow: 'auto' }}>
        {rendermsg(msgFromRedux)}
      </div>
      <input
        style={{
          margin: 0, width: '100%', height: 50,
          borderRadius: '4px', padding: '5px', fontSize: '1rem'
        }}
        placeholder='Send a message...'
        onKeyDown={e => keyDownHandler(e)}
        type='text'
      />
    </div>
  )
}

export default Chatbot