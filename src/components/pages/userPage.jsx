import "../../styles/userPage.css"
import Header from "../components/header"
import MiniSlideBar from "../components/miniSlideBar"
// import SliderBar from "../components/sliderBar"
import profileIcon from "../../images/profile-icon.jpg"
import SliderColum from "../components/sliderColum"
import { UserContext } from "../../api/userContext"
import { useContext, useEffect, useState } from "react"
import editData from "../../api/account"
import getAll from "../../api/account"
import getUser from "../../api/account"
import Card from "../components/card"
import { useHandleErr } from "../../api/useHandleErr"


import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import 'swiper/swiper-bundle.min.css'
import 'swiper/swiper.min.css'
// import Swiper core and required modules
import SwiperCore, {
    Pagination, Navigation
} from 'swiper';
import { useParams } from "react-router"

// install Swiper modules
SwiperCore.use([Pagination, Navigation]);

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
        const res = await editData(data, user.type)
        if (res.status === 200) {
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
            const res = await getUser(id)
            if (res.status === 200) {
                console.log(res.data);
                setUserData(res.data)
                setPrevData(res.data)
                //////////////////////////
                const res2 = await getAll()
                let arr = []
                let i = 0

                // for(i;i < 10;i++){
                //     arr.push(res.data.items[i])
                // }

                if (res2.status == 200) {
                    // setData(arr)
                    console.log(res2.data.items)
                    setData(res2.data.items)
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
    }, [])

    const arrayX = [1, 2, 3, 4, 5, 6, 7, 8]

    return (
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
                    <Swiper slidesPerView={4} spaceBetween={40} slidesPerGroup={4} loop={true} loopFillGroupWithBlank={true} navigation={true} className="mySwiper">
                        {data.map((item, index) => {
                            return (
                                <SwiperSlide key={index}>
                                    <Card key={index} item={item} />
                                </SwiperSlide>
                            )
                        })}
                        <h2 style={{ color: "#000" }} >Title</h2>
                    </Swiper>
                    <Swiper slidesPerView={4} spaceBetween={40} slidesPerGroup={4} loop={true} loopFillGroupWithBlank={true} navigation={true} className="mySwiper">
                        {data.map((item, index) => {
                            return (
                                <SwiperSlide>
                                    <Card key={index} item={item} />
                                </SwiperSlide>
                            )
                        })}
                    </Swiper>
                </div>
                <aside className="_right-content">
                    <h2 className="_subtitle" >Busquedas Relacionadas</h2>
                    <SliderColum />
                </aside>
            </main>
        </div>
    )
}

export default UserPage