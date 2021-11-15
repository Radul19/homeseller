import '../../styles/MainPage.css'
import mainBackground from '../../images/imageMain.png'
import logo from '../../images/LogoWhite.png'
import { useContext, useState } from 'react'
import register from '../../api/account'
import loginUser from '../../api/account'
import { useHistory } from 'react-router-dom'
// import LoadScreen from '../components/loadScreen'
import { UserContext } from '../../api/userContext'





import { linkClick, loadOut } from '../components/loadScreen'
import { useHandleErr } from '../../api/useHandleErr'

const MainPage = () => {

    const [loginInputs, setLoginInputs] = useState({
        email: "",
        password: "",
    })
    const [registerInputs, setRegisterInputs] = useState({
        email: "",
        password: "",
        confirmPasword: "",
        username: "",
    })
    const [type, setType] = useState(true)
    const { setUser, setLoad, setFade, setMsg } = useContext(UserContext)
    const { handleError } = useHandleErr()


    const history = useHistory()
    /////////////////////////////////////////////////////// Styles
    const [loginRight, setloginRight] = useState("-40vw")
    const [registerLeft, setRegisterLeft] = useState("-40vw")
    const [mainContainerLeft, setMainContainerLeft] = useState("0vw")
    const [blackScreenOpacity, setBlackScreenOpacity] = useState("0")
    const [opacity, setOpacity] = useState("1")

    const handleLogin = (name, value) => setLoginInputs({ ...loginInputs, [name]: value });
    const handleRegister = (name, value) => setRegisterInputs({ ...registerInputs, [name]: value });

    const toggleType = () => {
        setType(!type)
    }

    const blackScreenClick = () => {
        if (loginRight === "0vw") {
            setloginRight("-40vw")
        }
        if (registerLeft === "0vw") {
            setRegisterLeft("-40vw")
        }
        setMainContainerLeft("0vw")
        setBlackScreenOpacity("0")
        setOpacity("1")
    }

    const showHide = (type) => {
        if (type === "login") {
            setloginRight("0vw")
            setMainContainerLeft("-100vw")
            setBlackScreenOpacity("1")
        } else if (type === "register") {
            setRegisterLeft("0vw")
            setMainContainerLeft("100vw")
            setBlackScreenOpacity("1")
        }
        setOpacity("0")
    }

    /*///////////////////////////////////////////*/
    /*HANDLE CLICKS RETURN*/
    /*///////////////////////////////////////////*/
    const handleRegisterReturn = async () => {
        setLoad(true)
        const res = await register(registerInputs, type)
        if (res.status === 200) {
            loadOut(setFade, setLoad, history, "/search")
            setUser({
                user: res.data.username,
                id: res.data.id,
                type: res.data.type
            })
            setMsg({
                text: "Cuenta creada satisfactoriamente",
                color: "green"
            })
        } else {
            handleError(res)
        }
    }

    const handleLoginReturn = async () => {
        setLoad(true)
        const res = await loginUser(loginInputs)
        console.log(res);
        if (res.status === 200) {
            console.log("good");
            loadOut(setFade, setLoad, history, "/search")
            setUser({
                user: res.data.username,
                id: res.data.id,
                type: res.data.type
            })
        } else {
            handleError(res)
        }

    }


    const styles = {
        registerAside: {
            left: registerLeft
        },
        loginAside: {
            right: loginRight
        },
        mainContainer: {
            marginLeft: mainContainerLeft,
            opacity: opacity,
        }, blackScreen: {
            opacity: blackScreenOpacity,
        }

    }

    return (
        <div className="generalContainer" >
            <img src={mainBackground} alt="" className="mainBackground" />
            <div className="blackScreen" style={styles.blackScreen} onClick={blackScreenClick} ></div>
            {/*REGISTER ASIDE*/}
            <aside className="login" style={styles.registerAside} >
                <p className="register-subtitle" >Registro</p>
                <form >
                    <p className="_subtitle" >Seleccione su tipo de cuenta</p>
                    <div className="check-ctn">
                        <label className="_user-ctn">
                            <input checked={type} onChange={toggleType} type="checkbox" name="user" id="1" />
                            Comprador
                        </label>
                        <label className="_company-ctn">
                            <input checked={!type} onChange={toggleType} type="checkbox" name="user" id="2" />
                            Compañía
                        </label>
                    </div>
                    <label htmlFor="Username">{
                        type ? "Nombre de usuario" : "Nombre de la Compania"
                    }</label>
                    <input className="_input" autoComplete="off" onChange={(e) => {
                        handleRegister("username", e.target.value)
                    }} type="text" name="username" />
                    <label htmlFor="Username">Email</label>
                    <input className="_input" autoComplete="off" onChange={(e) => {
                        handleRegister("email", e.target.value)
                    }} type="text" name="email" />
                    <label htmlFor="Password"  >Contraseña</label>
                    <input className="_input" autoComplete="off" onChange={(e) => {
                        handleRegister("password", e.target.value)
                    }} type="text" name="password" />
                    <label htmlFor="Password"  >Confirmar contraseña</label>
                    <input className="_input" autoComplete="off" onChange={(e) => {
                        handleRegister("confirmPassword", e.target.value)
                    }} type="text" name="password" />
                    <button type="button" onClick={handleRegisterReturn} >Crear cuenta</button>
                </form>
            </aside>
            {/*HERO PAGE*/}
            <main className="mainContainer" style={styles.mainContainer} >
                <div className="itemsContainer" >
                    <img src={logo} alt="imagen" className="logoWhite" />
                    <p className="firstText">No necesitas construir tu futuro cuando puedes comprarlo!!</p>
                    <p className="secondText">Echa un vistazo a nuestro amplio catalogo de casas y departamentos</p>
                    <div className="btnContainer" >
                        <button className="btnMain" onClick={() => { showHide("register") }} >Registrarse</button>
                        <button className="btnMain" onClick={() => { showHide("login") }}>Iniciar Sesión</button>
                    </div>
                    <div className="thirdTextContainer" >
                        <p onClick={() => { linkClick(setFade, setLoad, history, "/search") }} className="thirdText" >Continuar como invitado</p>

                    </div>
                </div>
            </main>
            {/*LOGIN ASIDE*/}
            <aside className="login" style={styles.loginAside} >
                <p className="loginSubtitle" >Iniciar Sesión</p>
                <form action="#">
                    <label htmlFor="email">Email</label>
                    <input className="_input" autoComplete="off" onChange={(e) => { handleLogin("email", e.target.value) }} type="text" value={loginInputs.email} name="email" />
                    <label htmlFor="password"  >Contraseña</label>
                    <input className="_input"  autoComplete="off" onChange={(e) => { handleLogin("password", e.target.value) }} type="password" name="password" />
                    <button type="button" onClick={handleLoginReturn} >Ingresar</button>
                </form>
            </aside>
        </div>
    )
}




export default MainPage