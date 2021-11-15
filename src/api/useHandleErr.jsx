import { useContext } from 'react'
import { UserContext } from './userContext'
export const useHandleErr = () => {

    const { setFade, setLoad, setMsg } = useContext(UserContext)
    const handleError = (res)=>{
        setFade("out")
        setMsg({
            text: res.data.msg,
            color: "red"
        })
        setTimeout(() => {
            setLoad(false)
            setFade("in")
        }, 500);
    }

    return({
        handleError
    })


}
