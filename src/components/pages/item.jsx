import "../../styles/itemPage.css";
import Header from "../components/header"
import SliderColum from "../components/sliderColum";
import Comment from "../components/comment"
import TextareaAutosize from "react-textarea-autosize";

import Banner from "../../images/Banner1.png"
import plusCube from "../../images/PlusCube.png"
import pay from "../../images/pay.png"

import { useContext, useEffect, useRef, useState } from "react";
import { useHistory, useParams } from "react-router";
import { getItem } from "../../api/account";
import { UserContext } from "../../api/userContext";
import { loadOut } from "../components/loadScreen";
import { useHandleErr } from '../../api/useHandleErr'

//////   BIG IMAGE ////////////////////////////////////////////////////////
const BigImage = (props) => {
    return (
        <img src={props.url} alt="" className="big-image" />
    )
}
//////   ITEM PAGE ////////////////////////////////////////////////////////
const ItemPage = () => {
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

    const { id } = useParams()

    const { user, setLoad, setFade, setMsg } = useContext(UserContext)
    const history = useHistory()




    //////////  /////////  //////////  //////////  //      //
    ///         ///           ///      //      //   //   //
    ////STATES                                                                  /////////   /////////     ///      //      //     //
    const [files, setFiles] = useState([])                                      ///               ///     ///      //      //     //
    const [imgTitleInput, setImgTitleInput] = useState("")                      /////////   ////////      ///      //////////     //

    const [dtdCount, setDtdCount] = useState(0)                               /////   /////   /////////  /////   /////   /////////  //////////
    const [miniImgArray, setMiniImgArray] = useState([])                      /// // // ///   //     //  /// // // ///   //     //  //      //
    const [isId, setIsId] = useState(true)                                    ///  //   ///   /////////  ///  //   ///   /////////  //      //
    const [imgDtdArray, setImgDtdArray] = useState([])                        ///       ///   //     //  ///       ///   //     //  //      //
    const [dataContainer, setDataContainer] = useState({                      ///       ///   //     //  ///       ///   //     //  //////////
        title: "a",
        price: "b",
        images: [{
            title: "cargando...",
            detaildescription: ["cargando..."],
            url: ""
        }],
        generaldescription: "",
        type: 1,
        comments: [{}],
        ownerId: ""
    })
    const [imgIndex, setImgIndex] = useState(0)
    const [show, setShow] = useState(dataContainer.images[imgIndex].url)


    const handleData = (name, value) => { setDataContainer({ ...dataContainer, [name]: value }) }


    const deleteCurrentImage = () => {
        if (imgIndex !== -1) {
            dataContainer.images.splice(imgIndex, 1)
            miniImgArray.splice(imgIndex, 1)
            if (imgIndex !== 0) {
                setShow(dataContainer.images[imgIndex - 1].url)
            } else if (imgIndex === 0) {
                setShow("")
            }
            setImgIndex(imgIndex - 1)
            // console.log(dataContainer.images[imgIndex]);
        }
    }
    const forceUpdate = () => {
        setDataContainer({ ...dataContainer })
    }



    useEffect(() => {
        (async () => {
            const res = await getItem(id)
            if (res.status === 200) {
                setDataContainer(res.data.item)
                setShow("http://" + res.data.item.images[0].url)
                console.log(res);
            } else {
                handleError(res)
            }
        })()
    }, [])

    // useEffect(() => {
    //     return () => {
    //         setShow("http://" + dataContainer.images[imgIndex].url)
    //     }
    // }, [dataContainer])

    return (
        <div className="itemPage">
            <Header />
            <main className="_general-div">
                <div className="_title-div">
                    <h1 onClick={() => {
                        // forceUpdate()
                        console.log(show);
                        console.log(dataContainer.images[imgIndex].detaildescription);
                        console.log(dataContainer);
                    }} >{dataContainer.title + "  " + dataContainer.price + "$"}</h1>
                </div>
                <div className="_content-div">
                    {/* LEFT CONTENT /////////////////////////////////////////////////////////////// */}
                    <div className="_left-content">
                        <div className="_images-container">
                            <div className="_images-preview">
                                {dataContainer.images.map((value, index) => {
                                    return <MiniImage key={index} index={index} url={"http://" + value.url} />
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
                            {dataContainer.comments.map((item, index) => {
                                return <Comment key={index} />
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
            {/* <img src="http://localhost:4000/uploads/1636728603903--doge.png" alt="" style={{width:"100px",height:"100px"}}  /> */}
        </div>
    )
}

const InputDetail = ({ imgDtdArray, setImgDtdArray, dataContainer, id, imgIndex, item }) => {

    const [input, setInput] = useState("")

    useEffect(() => {
        // console.log("reload input");
        if (item !== undefined) {
            setInput(item)
        }
    }, [dataContainer.images[imgIndex].detailDescription])

    return (
        <div className="_input-dtd" key={id} >
            <TextareaAutosize onChange={(e) => {
                dataContainer.images[imgIndex].detailDescription[id] = e.target.value
                imgDtdArray[id] = e.target.value
                setInput(e.target.value)
            }} name="input" id={id} minRows={1} maxRows={5} spellCheck={false} onClick={e => console.log(e.target)} value={input} />
        </div>
    )
}

export default ItemPage