import React, { useState } from 'react'
import { useContext } from 'react/cjs/react.development'
import { UserContext } from '../../api/userContext'

export const Msg = () => {

    const [top, setTop] = useState("5vh")

    const {msg,setMsg} = useContext(UserContext)

    const hide = ()=>{
        setTop("-5vh")
        setTimeout(() => {
            setMsg({ ...msg, text: "" })
        }, 600);
    }
    const style = {
        top
    }

    return (
        <div className={`msg ${msg.color}`} style={style} >
            {/* <p>{props.text}</p> */}
            <p className="_text" >{msg.text}</p>
            <p className="_btn" onClick={hide} >X</p>
        </div>
    )
}
