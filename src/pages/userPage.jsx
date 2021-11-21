import "../styles/userPage.css"
import { useContext, useEffect, useState } from "react"
import { useParams } from "react-router"
import { UserContext } from "../api/userContext"
import api from "../api/account"
import { useHandleErr } from "../api/useHandleErr"

import Header from "../components/header"
import SliderColum from "../components/sliderColum"
import { Footer } from "../components/footer"
import SliderBar from "../components/sliderBar"
import profileIcon from "../images/profile-icon.jpg"


const UserPage = () => {
    const { id } = useParams()

    const { user, setMsg } = useContext(UserContext)
    const [data, setData] = useState([])
    const { handleError } = useHandleErr()
    const [edit, setEdit] = useState(false)
    const [prevData, setPrevData] = useState({
        name: "",
        id: "",
        description: "",
        email: ""
    })
    const [userData, setUserData] = useState({
        name: "",
        id: "",
        description: "",
        email: ""
    })
    const handleEdit = (name, value) => setUserData({ ...userData, [name]: value });
    const handleEditFetch = async () => {
        const res = await api.editData(data, user.type)
        if (res.status === 200) {
            console.log(res)
            setEdit(false)
            setPrevData(data)
            setMsg({
                text: "Datos actualizados corrrectamente",
                color: "green"
            })
        } else {
            handleError(res)
        }
    }

    useEffect(() => {
        (async () => {
            console.log(id)
            const res = await api.getUser(id)
            if (res.status === 200) {
                const res2 = await api.getAll()
                if (res2.status === 200) {
                    // setData(arr)
                    console.log(res2.data)
                    setData(res2.data)
                } else {
                    console.log(res2.result);
                    setMsg({
                        text: "No se ha podido realizar la busqueda",
                        color: "red"
                    })
                }
            } else {
                handleError(res)
            }
        })()
        return () => {
        }
        // eslint-disable-next-line
    }, [])
    return (
        <>
            <div className="userPage">
                <Header />
                <main className="_general-container">
                    <div className="_left-content">
                        <div className="_user-info-container">
                            <div className="_img-div">
                                <img src={profileIcon} alt="" className="_profile-picture" />
                            </div>
                            <div className="_info-div">
                                {!edit ? (
                                    <>
                                        <p style={{ fontSize: "1.4em" }} >{userData.name}</p>
                                        <p>{userData.description}</p>
                                        <p>{userData.email}</p>
                                    </>
                                ) :
                                    <>
                                        <input className="_input-edit" placeholder="Nombre de usuario" type="text" onChange={(e) => { handleEdit("name", e.target.value) }} value={userData.name} />
                                        <input className="_input-edit" placeholder="Correo" type="text" onChange={(e) => { handleEdit("email", e.target.value) }} value={userData.email} />
                                    </>
                                }
                                {edit ? <p className="_edit" onClick={handleEditFetch} >&#9998; Realizar cambios</p>
                                    : <p className="_edit" onClick={() => { setEdit(!edit) }} >&#9998; Editar datos</p>}
                                {!edit ? null : <p className="_edit-cancel" onClick={() => {
                                    setUserData(prevData)
                                    setEdit(!edit)
                                }} >&#10006; Cancelar</p>}
                            </div>
                        </div>
                        <h2 style={{ color: "#000" }}  >Title</h2>
                        <SliderBar data={data} SPV={4} />
                        <SliderBar data={data} SPV={4} />
                    </div>
                    <aside className="_right-content">
                        <h2 className="_subtitle" >Busquedas Relacionadas</h2>
                        <SliderColum />
                    </aside>
                </main>
            </div>
            <Footer />
        </>
    )
}

export default UserPage