import "../styles/searchPage.css"
import { useContext, useEffect,  useState } from "react"
import { useHistory, useParams } from "react-router-dom"
import { UserContext } from "../api/userContext"
import api from "../api/account"
import { linkClick } from "../components/loadScreen"
import { Footer } from "../components/footer"
import SliderBar from "../components/sliderBar"

import Banner from "../images/Banner1.png"
import miniLogo from "../images/MiniLogo.png"
import backImage from "../images/searchBackImage.png"



import AdSense from 'react-adsense';


const LogOut = () => {
    const history = useHistory()
    const { setUser, setFade, setLoad } = useContext(UserContext)
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
    const history = useHistory()
    const { setFade, setLoad } = useContext(UserContext)
    return (
        <p className="pointer" onClick={() => { linkClick(setFade, setLoad, history, "/") }} >Iniciar Sesion</p>
    )
}

const SearchPage = () => {

    const { text } = useParams()

    const { user, setFade, setLoad, setMsg, } = useContext(UserContext)
    const [input, setInput] = useState("")
    const [data, setData] = useState([])
    const history = useHistory()

    let perfil = "/company/"
    if (user.type) {
        perfil = "/user/"
    }

    const handleEnter = (e) => {
        if (e.key === "Enter") {
            linkClick(setFade, setLoad, history, `/explore/${input}`)
        }
    }

    useEffect(() => {
        (async () => {
            const res = await api.getAll()
            // const res = await api.search(text)
            if (res.status === 200) {
                // setData(arr)
                console.log(res.data)
                setData(res.data)
            } else {
                console.log(res.result);
                setMsg({
                    text: "No se ha podido realizar la busqueda",
                    color: "red"
                })
            }

        })()

        return () => {

        }
    }, [setMsg])


    return (
        <>
            <div className="searchPage">
                <div className="topContent">
                    <img className="_backImage" src={backImage} alt="" />
                    <header className="_header" >
                        <img src={miniLogo} alt="" className="_logo" />
                        <div className="_links">
                            <p className="pointer" onClick={() => { linkClick(setFade, setLoad, history, "/explore/ ") }}>Destacados</p>

                            {user.id !== "" ? <p className="pointer" onClick={() => { linkClick(setFade, setLoad, history, `${perfil + user.id}`) }} >Perfil</p> : null}

                            {user.id !== "" ? <LogOut /> : <LogIn />}
                        </div>
                    </header>
                    <div className="_searchContainer">
                        <p className="_mainText">Realiza una busqueda de tus preferencias y adquiere la casa que tanto ahnelas</p>
                        <input className="_searchBar" spellCheck="false" type="text" placeholder="Buscar..." onChange={
                            (e) => { setInput(e.target.value) }
                        } onKeyDown={(e) => { handleEnter(e) }} />
                        <p className="_sugestText" >Sugerencias : Casa blanca, Casa de tres pisos, Patio grande...</p>
                    </div>
                </div>
                {/* <SliderBar title="Populares en Ventas" /> */}
                <SliderBar data={data} SPV={5} width="90%" />
                <div className="_bannerContainer" >
                    <p className="_text" >Disfruta de nuestro amplio catálogo desde cualquier dispositivo </p>
                    <img src={Banner} alt="" className="banner" />
                </div>
                <SliderBar data={data} SPV={5} width="90%"/>
            </div>
            <div>
                <AdSense.Google
                    client='ca-pub-7292810486004926'
                    slot='7806394673'
                />

            </div>
            <Footer />
        </>
    )
}


export default SearchPage



// import React, { useRef, useState } from "react";
// // Import Swiper React components
// import { Swiper, SwiperSlide } from "swiper/react";

// // Import Swiper styles
// import "swiper/css";
// import "swiper/css/pagination"
// import "swiper/css/navigation"

// import "./styles.css";


// // import Swiper core and required modules
// import SwiperCore, {
//   Pagination,Navigation
// } from 'swiper';

// // install Swiper modules
// SwiperCore.use([Pagination,Navigation]);


// export default function App() {



//   return (
//     <>
//     <Swiper slidesPerView={3} spaceBetween={30} slidesPerGroup={3} loop={true} loopFillGroupWithBlank={true} pagination={{
//   "clickable": true
// }} navigation={true} className="mySwiper">
//   <SwiperSlide>Slide 1</SwiperSlide><SwiperSlide>Slide 2</SwiperSlide><SwiperSlide>Slide 3</SwiperSlide><SwiperSlide>Slide 4</SwiperSlide><SwiperSlide>Slide 5</SwiperSlide><SwiperSlide>Slide 6</SwiperSlide><SwiperSlide>Slide 7</SwiperSlide><SwiperSlide>Slide 8</SwiperSlide><SwiperSlide>Slide 9</SwiperSlide>
//   </Swiper>
//     </>
//   )
// }