import "../../styles/itemPage.css";
import Header from "../components/header"
import TextareaAutosize from "react-textarea-autosize";
import plusCube from "../../images/PlusCube.png"

import { useContext, useEffect, useRef, useState } from "react";
import { useHistory } from "react-router";
import { createItem } from "../../api/account";
import { UserContext } from "../../api/userContext";
import { loadOut } from "../components/loadScreen";
import { useHandleErr } from '../../api/useHandleErr'


//////   BIG IMAGE ////////////////////////////////////////////////////////
const BigImage = (props) => {
    const click = () => {
        // props.setImgIndex(props.imgIndex - 1)
    }
    return (
        <img src={props.url} alt="" className="big-image" onClick={click} />
    )
}
//////   ITEM PAGE ////////////////////////////////////////////////////////
const ItemPageNew = () => {

    const { handleError } = useHandleErr()

    ////Componentes ////////////////////////////////////////////////////////////////////////////////////////////////
    //////   MINI IMAGE ////////////////////////////////////////////////////////

    const MiniImage = ({ url, index }) => {
        const inputFile = useRef(null)
        const click = async () => {
            if (url !== plusCube) {
                setShow(url)
                setImgIndex(index)

            } else {
                inputFile.current.click();
            }
        }
        return (
            <>
                <img src={url} alt="" className="mini-image" onClick={click} />
                {url === plusCube ?
                    <input type='file' id='file' name="images" ref={inputFile} style={{ display: 'none' }} onChange={(e) => {
                        console.log("some?");
                        if (e.target.files[0]) {
                            let file = e.target.files[0];
                            let reader = new FileReader();
                            reader.onload = function (event) {
                                // The file's text will be printed here
                                dataContainer.images.push({
                                    url: event.target.result,
                                    title: "",
                                    detaildescription: [],
                                })
                                files.push(file)

                                setImgIndex(imgIndex + 1)
                                setMiniImgArray([...miniImgArray, event.target.result])
                                setShow(event.target.result)
                                console.log(event.target)
                            };
                            reader.readAsDataURL(file);
                        }

                    }} /> : null}
            </>
        )
    }


    const { user, setLoad, setFade, setMsg } = useContext(UserContext)
    const history = useHistory()
    useEffect(() => {
        console.log(user);
        if (!user.type && user.type !== "") {
            console.log(user.type !== "");
            setIsId(false)
        } else {
            setLoad(true)
            setMsg({
                text: "Ha intentado ingresar a una pagina a la cual no tiene acceso",
                color: "red"
            })
            loadOut(setFade, setLoad, history, "/search")
        }

    }, [])

    //                                                                          //////////  /////////  //////////  //////////  //      //
    //                                                                          ///         ///           ///      //      //   //   //
    ////STATES                                                                  /////////   /////////     ///      //      //     //
    const [files, setFiles] = useState([])                                      ///               ///     ///      //      //     //
    const [imgTitleInput, setImgTitleInput] = useState("")                      /////////   ////////      ///      //////////     //
    const [imgDtdArray, setImgDtdArray] = useState([])
    const [dtdCount, setDtdCount] = useState(0)                               /////   /////   /////////  /////   /////   /////////  //////////
    const [miniImgArray, setMiniImgArray] = useState([])                      /// // // ///   //     //  /// // // ///   //     //  //      //
    const [isId, setIsId] = useState(true)                                    ///  //   ///   /////////  ///  //   ///   /////////  //      //
    const [show, setShow] = useState(``)                                      ///       ///   //     //  ///       ///   //     //  //      //
    const [dataContainer, setDataContainer] = useState({                      ///       ///   //     //  ///       ///   //     //  //////////
        title: "",
        price: "",
        images: [],
        generaldescription: "",
        type: 1,
        owner: user.id
    })


    const handleData = (name, value) => { setDataContainer({ ...dataContainer, [name]: value }) }

    const [imgIndex, setImgIndex] = useState(-1)

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

    // useEffect(() => {
    //     console.log("Data Update");
    //     return () => {
    //     }
    // }, [dataContainer])

    const createClick = async () => {
        setLoad(true)
        const res = await createItem(dataContainer, files)
        console.log(res);
        if (res.status === 200) {
            loadOut(setFade, setLoad, history, `/itemPage/${res.data.id}`)
        } else {
            handleError(res)
        }
    }


    return (
        <div className="itemPage">
            <Header />
            <section className="_choice-ctn">
                <button>Cancelar</button>
                <button onClick={createClick} >Finalizar</button>
            </section>
            <main className="_general-div">
                <div className="_title-div">
                    <input className="_title-input" type="text" placeholder="Titulo" maxLength={60} spellCheck={false} onChange={(e) => {
                        handleData("title", e.target.value)
                    }} />
                    <input className="_price-input" type="text" placeholder="/Precio" spellCheck={false} value={dataContainer.price} onChange={(e) => {
                        console.log(e.target.value);
                        handleData("price", e.target.value)
                        // }
                    }} />
                </div>
                <div className="_content-div">
                    {/* LEFT CONTENT /////////////////////////////////////////////////////////////// */}
                    <div className="_left-content">
                        <div className="_images-container">
                            <div className="_images-preview">
                                {miniImgArray.map((value, index) => {
                                    return <MiniImage key={index} index={index} url={value} />
                                })}
                                <MiniImage url={plusCube} />
                            </div>
                            <div className="_image-display">
                                <BigImage url={show} setImgIndex={setImgIndex} />
                            </div>
                        </div>
                        <h2 className="_subtitle" >Caracteristicas generales</h2>
                        <TextareaAutosize
                            minRows={5}
                            maxRows={50}
                            placeholder={"Escribe aqui..."}
                            className="_general-description"
                            onChange={(e) => {
                                handleData("generaldescription", e.target.value)
                            }}
                        />
                    </div>
                    {/* RIGHT CONTENT /////////////////////////////////////////////////////////////// */}
                    <aside className="_right-content"><>
                        {dataContainer.images[imgIndex] !== undefined ?
                            <>
                                <input type="text" placeholder="Nombre de la habitacion" className="_input-room-name" value={dataContainer.images[imgIndex].title} onChange={(e) => {
                                    let aux = { ...dataContainer }
                                    aux.images[imgIndex].title = e.target.value
                                    setDataContainer(aux)
                                }} />
                                <p className="_dtd" onClick={() => {
                                    console.log(dataContainer);
                                    console.log(imgIndex)
                                }} >Descripcion detallada</p>
                                <div className="_btns" >
                                    <button onClick={() => {
                                        dataContainer.images[imgIndex].detaildescription.push("")
                                        forceUpdate()
                                    }} >Añadir detalle</button>
                                    <button onClick={() => {
                                        dataContainer.images[imgIndex].detaildescription.pop()
                                        forceUpdate()
                                    }} >Eliminar detalle</button>
                                </div>
                                <div className="_dtd-container">
                                    {dataContainer.images[imgIndex].detaildescription.map((item, index) => {
                                        console.log("/////");
                                        console.log(item + " / " + index)
                                        console.log("/////");
                                        item = item
                                        return <InputDetail id={index} key={index} imgIndex={imgIndex} dataContainer={dataContainer} imgDtdArray={imgDtdArray} setImgDtdArray={setImgDtdArray} item={item} />
                                    })}
                                    {/* <p>{imgIndex + 1}</p>
                                            <p>{dataContainer.images.length}</p>
                                            <p>{dataContainer.images[imgIndex] !== undefined ? dataContainer.images[imgIndex].detailDescription.length : null}</p> */}
                                    <button onClick={deleteCurrentImage} className="_deleteImage-btn" >Eliminar imagen actual</button>
                                </div>
                            </>
                            : null}
                    </>
                    </aside>
                </div>
            </main>
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
    }, [dataContainer.images[imgIndex].detaildescription])

    return (
        <div className="_input-dtd" key={id} >
            <TextareaAutosize onChange={(e) => {
                dataContainer.images[imgIndex].detaildescription[id] = e.target.value
                imgDtdArray[id] = e.target.value
                setInput(e.target.value)
            }} name="input" id={id} minRows={1} maxRows={5} spellCheck={false} onClick={e => console.log(e.target)} value={input} />
        </div>
    )
}

export default ItemPageNew