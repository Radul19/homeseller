import { useContext, useState } from "react"
import { useHistory } from "react-router-dom"
import { UserContext } from "../api/userContext"
import miniLogo from "../images/MiniLogo.png"
import { linkClick } from "./loadScreen"

const Header = () => {

    const [input, setInput] = useState("")

    const history = useHistory()

    const { user, setUser, setFade, setLoad } = useContext(UserContext)
    let perfil = "/company/"
    if (user.type) {
        perfil = "/user/"
    }

    const LogOut = () => {
        return (
            <p className="pointer" onClick={() => {
                setUser({
                    user: "",
                    email: "",
                    id: "",
                })
                linkClick(setFade, setLoad, history, "/")
            }} >Cerrar Sesión</p>
        )
    }

    const LogIn = () => {
        return (
            <p className="pointer" onClick={() => { linkClick(setFade, setLoad, history, "/") }} >Iniciar Sesion</p>
        )
    }

    const handleEnter = (e)=>{
        if(e.key === "Enter"){
            linkClick(setFade,setLoad,history, `/explore/${input}`)
        }
    }


    return (
        <header className="headerFlat" >
            <img src={miniLogo} alt="" className="_logo" onClick={() => { linkClick(setFade, setLoad, history, "/search") }} />
            <input type="text" className="_input" placeholder="Buscar..." value={input} onChange={(e) => {setInput(e.target.value) }} onKeyDown={handleEnter} spellCheck={false} />
            <div className="_links">
                <p className="pointer" onClick={() => { linkClick(setFade, setLoad, history, "/explore/ ") }}>Destacados</p>
                {user.id !== "" ? <p className="pointer" onClick={() => { linkClick(setFade, setLoad, history, `${perfil + user.id }`) }} >Perfil</p> : null}
                {user.id !== "" ? <LogOut /> : <LogIn />}
            </div>
        </header >
    )
}

export default Header