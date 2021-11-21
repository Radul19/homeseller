import "../styles/itemPage.css";
import { useContext, useEffect, useRef, useState } from "react";
import { useHistory, useParams } from "react-router";
import api from "../api/account";
import { UserContext } from "../api/userContext";
import { useHandleErr } from '../api/useHandleErr'

import { loadOut } from "../components/loadScreen";
import { Footer } from "../components/footer";
import Header from "../components/header"
import TextareaAutosize from "react-textarea-autosize";
import plusCube from "../images/PlusCube.png"


//////  ITEM PAGE New ////////////////////////////////////////////////////////
const ItemPageNew = () => {

    const { handleError } = useHandleErr()

    const { id } = useParams()

    ////Componente interno ////////////////////////////////////////////////////////////////////////////////////////////////
    //////   MINI IMAGE ////////////////////////////////////////////////////////
    /// Recibe como parametros la url de la imagen que se cargará y su propio index
    const MiniImage = ({ url, index }) => {
        /// UseRef para el input file y poder añadir una imagen nueva
        const inputFile = useRef(null)

        ///Funcion al hacer click en la imagen
        const click = async () => {
            /* Hay dos casos, si el url de la imagen es "plusCube", significa que es la imagen con signo de "+"
            usada con el proposito de, al darle click, añadir una nueva imagen
            En caso contrario es una imagen normal:
            seleccionamos su index en setImgIndex y setShow para mostrarla en el contenedor grande
            Esto puede ser muy confuso asi que si tienes dudas me avisas
            */
            if (url !== plusCube) {
                setShow(url)
                setImgIndex(index)

            /// Si se dio click a la imagen con signo de "+", simula un click en el inputFile
            } else {
                inputFile.current.click();
            }
        }

        /// Una vez que se seleccione la nueva imagen, inputFile ejecutara su funcion "OnChange" y alli podemos
        /// manejar la nueva imagen
        const inputFileChange = (e) => {

            /// Verificamos que la imagen se haya seleccionado y no cancelado
            if (e.target.files[0]) {

                /// Guarda los datos de el archivo en una variable
                let file = e.target.files[0];

                /// FileReader() nos permite leer la imagen que seleccionamos, porque originalmente, no nos da la url exacta
                let reader = new FileReader();

                /// Creamos una funcion que se ejecutara cuando leamos un archivo con "reader" ( FileReader() )
                reader.onload = (event) => {
                    /// event.target.result me dara la url de la imagen, y eso es lo que estabamos buscando
                    /// al contenedor de los datos le insertamos un nuevo elemento en las imagenes, con url, sin titulo ni descripciones detalladas
                    dataContainer.images.push({
                        url: event.target.result,
                        title: "",
                        detaildescription: [],
                    })

                    /// Le añadimos los datos de la imagen al estado Files, para poder enviar todas las imagenes al servidor y subirlas a cloudinary
                    setFiles([...files], file)
                    /// Ajustamos el index de la imagen para asi mostrar la nueva que se esta creando
                    setImgIndex(imgIndex + 1)
                    /// Estado de las ¨Mini Imagenes¨ le añadimos la url de la imagen que seleccionamos y asi poder mostrarla
                    setMiniImgArray([...miniImgArray, event.target.result])
                    /// Presentamos la nueva imagen en el contenedor grande
                    setShow(event.target.result)
                };

                /// Leemos el archivo que se selecciono con reader, pero la funcion es
                // "Read as data url", y asi leemos la ruta original de el archivo y obtenemos su ubicacion en "event.target.result"
                reader.readAsDataURL(file);
            }
        }

        return (
            <>
                <img src={url} alt="" className="mini-image" onClick={click} />
                {/* Si la imagen es el signo de "+" , habilita el inputFile, en caso contrario devuelve un valor nulo */}
                {url === plusCube ?
                    <input type='file' id='file' name="images" ref={inputFile} style={{ display: 'none' }} onChange={(e) => { inputFileChange(e) }} /> : null}
            </>
        )
    }


    /// Extraemos el contenido 
    const { user, setLoad, setFade, setMsg } = useContext(UserContext)
    const history = useHistory()

    useEffect(() => {
        (async () => {
            console.log(dataContainer)
            // console.log(user);
            if (!user.type && user.type !== "") {
                // console.log(user.type !== "");
                if (id !== "new") {
                    const res = await api.getItem(id)
                    console.log(res)
                    if (res.status === 200) {
                        const aux = []
                        await res.data.images.map((item, index) => {
                            console.log(item)
                            aux.push(item.url)
                            return 0
                        })
                        setMiniImgArray(aux)
                        setShow(res.data.images[0].url)
                        setImgIndex(0)
                        setDataContainer(res.data)
                        console.log(miniImgArray)
                    } else {
                        handleError(res)
                    }
                }
            } else {
                setLoad(true)
                setMsg({
                    text: "Ha intentado ingresar a una pagina a la cual no tiene acceso",
                    color: "red"
                })
                loadOut(setFade, setLoad, history, "/search")
            }

        })()
        // eslint-disable-next-line
    }, [])

    //                                                                         
    //                                                                        
    ////STATES                                                           
    const [files, setFiles] = useState([])
    // eslint-disable-next-line
    const [imgDtdArray, setImgDtdArray] = useState([])
    const [miniImgArray, setMiniImgArray] = useState([])
    const [show, setShow] = useState(``)
    const [dataContainer, setDataContainer] = useState({
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

    const createClick = async () => {
        setLoad(true)
        const res = await api.createItem(dataContainer, files)
        console.log(res);
        if (res.status === 200) {
            loadOut(setFade, setLoad, history, `/itemPage/${res.data.id}`)
        } else {
            handleError(res)
        }
    }


    return (
        <>
            <div className="itemPage">
                <Header />
                <section className="_choice-ctn">
                    <button onClick={() => {
                        console.log(miniImgArray)
                    }} >Cancelar</button>
                    <button onClick={createClick} >Finalizar</button>
                </section>
                <main className="_general-div">
                    <div className="_title-div">
                        <input className="_title-input" type="text" placeholder="Titulo" maxLength={60} spellCheck={false} value={dataContainer.title} onChange={(e) => {
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
                                    <img src={show} alt="" className="big-image" />
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
                                value={dataContainer.generaldescription}
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
                                        {dataContainer.images[imgIndex] !== undefined ?
                                            dataContainer.images[imgIndex].detaildescription.map((item, index) => {
                                                return <InputDetail id={index} key={index} imgIndex={imgIndex} dataContainer={dataContainer} imgDtdArray={imgDtdArray} item={item} />
                                            }) : null}
                                        <button onClick={deleteCurrentImage} className="_deleteImage-btn" >Eliminar imagen actual</button>
                                    </div>
                                </>
                                : null}
                        </>
                        </aside>
                    </div>
                </main>
            </div>
            <Footer />
        </>
    )
}

const InputDetail = ({ imgDtdArray, dataContainer, id, imgIndex, item }) => {

    const [input, setInput] = useState("")
    useEffect(() => {
        if (item !== undefined) {
            setInput(item)
        }
        // eslint-disable-next-line
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