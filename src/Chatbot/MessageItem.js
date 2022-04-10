import React from 'react'
import { List, Avatar } from 'antd'

const MessageItem = (props) => {
  return (
    <List.Item style={{ padding: '1rem' }}>
      <List.Item.Meta
        avatar={<Avatar />}
        title={props.who}
        description={props.text}
      />
    </List.Item>
  )
}

export default MessageItem