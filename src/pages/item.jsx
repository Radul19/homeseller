import "../styles/itemPage.css";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useContext } from "react/cjs/react.development";
import api from "../api/account";
import { useHandleErr } from '../api/useHandleErr'
import { UserContext } from "../api/userContext";

import { Footer } from "../components/footer";
import Header from "../components/header"
import SliderColum from "../components/sliderColum";
import TextareaAutosize from "react-textarea-autosize";
import Banner from "../images/Banner1.png"
import pay from "../images/pay.png"


//////   ITEM PAGE ////////////////////////////////////////////////////////
const ItemPage = () => {

    const { id } = useParams()
    const { user, setMsg } = useContext(UserContext)
    const { handleError } = useHandleErr()

    ////Componentes ////////////////////////////////////////////////////////////////////////////////////////////////
    //////   MINI IMAGE ////////////////////////////////////////////////////////

    const MiniImage = ({ url, index }) => {
        const click = async () => {
            setShow(url)
            setImgIndex(index)
        }
        return (
            <img src={url} alt="" className="mini-image" onClick={click} />
        )
    }
    //////  COMMENT  ////////////////////////////////////////////////////////
    const Comment = ({ item, index }) => {
        const [input, setInput] = useState("")
        const [username, setUsername] = useState("")

        useEffect(() => {
            (async () => {
                console.log(item)
                const res = await api.getUser(item.user_id)
                console.log(res)
                if (res.status === 200) {
                    setUsername(res.data.name)
                } else {
                    // handleError(res)
                }
            })()
            return 0
            // eslint-disable-next-line
        }, [Comment])

        const replyClick = async () => {
            const commentData = [...dataContainer.comments]
            const position = dataContainer.comments.length - 1 - index
            commentData[position].reply = input
            commentData[position].reply_date = Date.now()
            const res = await api.sendComment(commentData, id)
            if (res.status === 200) {
                setMsg({
                    text: "Comentario publicado satisfactoriamente",
                    color: "green"
                })
                setDataContainer({ ...dataContainer, comments: commentData })
            } else {
                handleError(res)
            }
        }

        return (
            <>
                <div className="comment-display" >
                    <p className="_date" >{username}</p>
                    <p className="_comment">{item.text}</p>
                </div>
                {item.reply === "" ?
                    /////////////
                    dataContainer.owner === user.id ?
                        <div className="_reply-textarea-ctn">
                            <button onClick={replyClick} >Enviar</button>
                            <TextareaAutosize
                                minRows={1}
                                maxRows={3}
                                placeholder={"Escribe aqui..."}
                                value={input}
                                onChange={(e) => {
                                    setInput(e.target.value)
                                    // setDataContainer({...dataContainer,  })
                                }}
                                className="_comment-textarea"
                            />
                        </div>
                        : null
                    /////////////
                    : <div className="reply-display" >
                        <p className="_date" >{`${item.reply_date}`}</p>
                        <p className="_comment">{item.reply}</p>
                    </div>}
            </>
        )
    }

    const [dataContainer, setDataContainer] = useState({
        title: "a",
        price: "b",
        generaldescription: "",
        type: 1,
        comments: [],
        owner: "",
        images: [{
            title: "cargando...",
            detaildescription: ["cargando..."],
            url: ""
        }],
    })
    const [imgIndex, setImgIndex] = useState(0)
    const [show, setShow] = useState(dataContainer.images[imgIndex].url)
    const [commentInput, setCommentInput] = useState("")


    useEffect(() => {
        (async () => {
            const res = await api.getItem(id)
            if (res.status === 200) {
                setDataContainer(res.data)
                setShow(res.data.images[0].url)
                console.log(res);
            } else {
                handleError(res)
            }
        })()
        return () =>{
            // console.log("wat")
            api.plusView(id)
        }
        // eslint-disable-next-line
    }, [])

    const sendComment = async (comment) => {
        const commentData = [...dataContainer.comments, {
            text: comment,
            date: Date.now(),
            user_id: user.id,
            reply: "",
            reply_date: "",
        }]
        const res = await api.sendComment(commentData, id)
        if (res.status === 200) {
            setMsg({
                text: "Comentario publicado satisfactoriamente",
                color: "green"
            })
            setDataContainer({ ...dataContainer, comments: commentData })
        } else {
            handleError(res)
        }
    }

    return (
        <div className="itemPage">
            <Header />
            <main className="_general-div">
                <div className="_title-div">
                    <h1 onClick={() => {
                        // forceUpdate()
                        // console.log(show);
                        // console.log(dataContainer.images[imgIndex].detaildescription);
                        console.log(dataContainer);
                        console.log(dataContainer.comments.length - 1)
                    }} >{dataContainer.title + "  " + dataContainer.price + "$"}</h1>
                </div>
                <div className="_content-div">
                    {/* LEFT CONTENT /////////////////////////////////////////////////////////////// */}
                    <div className="_left-content">
                        <div className="_images-container">
                            <div className="_images-preview">
                                {dataContainer.images.map((value, index) => {
                                    return <MiniImage key={index} index={index} url={value.url} />
                                })}
                            </div>
                            <div className="_image-display">
                                {/* <BigImage url={show} setImgIndex={setImgIndex} /> */}
                                <img src={show} alt="" className="big-image" />
                            </div>
                        </div>
                        <h2 className="_subtitle" >Caracteristicas generales</h2>
                        <p className="_general-description" >{dataContainer.generaldescription}</p>
                        <h2 className="_subtitle" id="title-comment" >Comentarios</h2>
                        <div className="_comment-container">
                            {user.id !== "" ?
                                user.id === dataContainer.owner ? null :
                                    <div className="_textarea-ctn">
                                        <TextareaAutosize
                                            minRows={1}
                                            maxRows={3}
                                            placeholder={"Escribe aqui..."}
                                            value={commentInput}
                                            onChange={(e) => {
                                                setCommentInput(e.target.value)
                                            }}
                                            className="_comment-textarea"
                                        />
                                        <button onClick={() => { sendComment(commentInput) }} >Enviar</button>
                                    </div>
                                : null}
                            {/* <Comment /> */}
                            {dataContainer.comments.slice(0).reverse().map((item, index) => {
                                return <Comment key={index} index={index} item={item} owner={user.id === dataContainer.owner ? true : false} />
                            })}
                        </div>
                        <div className="_bannerContainer small-banner " >
                            <p className="_text" >Disfruta de nuestro amplio catálogo desde cualquier dispositivo </p>
                            <img src={Banner} alt="" className="banner" />
                        </div>
                    </div>
                    {/* RIGHT CONTENT /////////////////////////////////////////////////////////////// */}
                    <aside className="_right-content">
                        <h2 className="_room-name">{dataContainer.images[imgIndex].title}</h2>
                        <p className="_dtd" style={
                            dataContainer.images[imgIndex].detaildescription.length > 0 ? null : { display: "none" }
                        } >Descripcion detallada</p>
                        <div className="_dtd-container"
                        // style={
                        //     dataContainer.images[imgIndex].detaildescription.length > 0 ? null : { display: "none" }
                        // }
                        >
                            {dataContainer.images[imgIndex].detaildescription.map((item, index) => {
                                return <p key={index} >{item}</p>
                            })}
                        </div>

                        <h2 className="_pay-title" >Metodos de pago</h2>
                        <img src={pay} alt="" className="_pay-img" />
                        <button className="_btn" >Comprar</button>
                        <h2 className="_pay-title" >Busquedas Similares</h2>
                        <SliderColum />
                    </aside>
                </div>
            </main>
            <Footer/>
        </div>
    )
}


export default ItemPage