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

    /// El id extraido del url para buscar los datos de la publicacion
    const { id } = useParams()
    /// Extrer los datos del UserContext , "user" : para saber que usuario esta loggeado y si es el dueño del post o una compaía
    /// y setMsg para los errores
    const { user, setMsg } = useContext(UserContext)
    /// Hook para los errores
    const { handleError } = useHandleErr()

    ////COMPONENTES INTERNOS ////////////////////////////////////////////////////////////////////////////////////////////////
    //////  MINI IMAGE ////////////////////////////////////////////////////////
    /// Estas son las mini imagenes que ves en la parte izquierda de la pantalla
    const MiniImage = ({ url, index }) => {
        /// Al hacer click, setShow te mostrara la imagen clickeada en el contenedor grande
        /// y seleccionará su index para poder buscar entre el array de los datos y mostrar sus caracteristicas detalladas
        /// dataContainer.images[imgIndex].detaildescription
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
        /// Estado para manejar el input en caso de haber
        const [input, setInput] = useState("")
        /// Estado para guardar quien esta escribiendo o escribió el comentario
        const [username, setUsername] = useState("")

        /// Cuando cargues el comentario haz una peticion buscando al usuario por ID
        /// y guarda sus datos 
        useEffect(() => {
            (async () => {
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
        }, [])

        /// Funcion para responder a un comentario
        const replyClick = async () => {

            /// Copiamos el contenido de los comentarios en un array nuevo
            const commentData = [...dataContainer.comments]
            /* Los comentarios estan presentados en orden inverso, mas nuevos arriba y mas viejos abajo
             Por ende, los index estan invertidos, pero para eso se usa lo siguiente
             [la cantidad de comentarios que hay] - [1] - [el index de el comentario]
             esto nos dara la posicion original de el comentario y podremos modificarlo y añadirle la respuesta
            */
            const position = dataContainer.comments.length - 1 - index

            /// Al array que copiamos, le añadimos el valor de el input y la fecha/hora actual
            commentData[position].reply = input
            commentData[position].reply_date = Date.now()
            /// Hacemos una peticion para enviar los datos y si todo sale bien, añadimos el contenedor de comentario que 
            /// copiamos en el estado de ¨dataContainer¨, una vez que el comentario tiene respuesta, no se puede responder mas
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
            {/* Presenta el nombre de usuario y el texto de el comentario */}
                <div className="comment-display" >
                    <p className="_date" >{username}</p>
                    <p className="_comment">{item.text}</p>
                </div>
                {/* Si el comentario no tiene respuesta, verifica si el dueño de la publicacion
                es el mismo usuario que esta logeado actualmente */}
                {item.reply === "" ?
                    ///////////// Verificacion del dueño de la publicacion y usuario logeado
                    /// Si el usuario logeado es el mismo que el dueño, entonces puede responder los comentarios
                    dataContainer.owner === user.id ?
                        <div className="_reply-textarea-ctn">
                            <button onClick={replyClick} >Enviar</button>
                            {/* Componente Textarea pero con tamaño que se ajusta automaticamente */}
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
                    ///////////// En caso de existir una respuesta, presentala
                    : <div className="reply-display" >
                        <p className="_date" >{`${item.reply_date}`}</p>
                        <p className="_comment">{item.reply}</p>
                    </div>}
            </>
        )
    }

    /// Estado para la informacion general de la publicacion
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
    /// Estado para el index de la imagen que se esta mostrando y 
    /// asi buscar y presentar la descripcion detallada de la imagen
    /// dataContainer.images[imgIndex].detaildescription
    const [imgIndex, setImgIndex] = useState(0)
    /// Estado para el index de la imagen que se esta mostrando en el contenedor grande
    const [show, setShow] = useState(dataContainer.images[imgIndex].url)

    /// Si es un usuario normal, puede comentar la publicacion
    const [commentInput, setCommentInput] = useState("")

    
    // Una vez cargado el componente, busca los datos de la publicacion por el id de la url
    useEffect(() => {
        (async () => {
            const res = await api.getItem(id)
            /// Si se consiguieron los datos, almacenalos en sus respectivos estados
            if (res.status === 200) {
                setDataContainer(res.data)
                /// Y presenta la primera imagen en el contenedor grande
                setShow(res.data.images[0].url)
                console.log(res);
            } else {
                handleError(res)
            }
        })()
        return () =>{
            // Cada vez que la pagina se renderice, aplica un +1 a las vistas
            api.plusView(id)
        }
        // eslint-disable-next-line
    }, [])

    /// Funcion para enviar un comentario
    const sendComment = async (comment) => {
        /// Copia el contenido de los comentarios actuales en una nueva variable pero añadele uno nuevo con los datos de:
        /// el comentario, la fecha y el id de quien lo escribió, dejando vacia la respuesta y la fecha de respuesta
        const commentData = [...dataContainer.comments, {
            text: comment,
            date: Date.now(),
            user_id: user.id,
            reply: "",
            reply_date: "",
        }]
        /// Envia la peticion al servidor con el contenido completo de los comentarios y la ID de la publicacion
        /// de esta forma busca la publicacion por ID y le actualiza los comentarios
        const res = await api.sendComment(commentData, id)

        if (res.status === 200) {
            setMsg({
                text: "Comentario publicado satisfactoriamente",
                color: "green"
            })
            /// Si todo salio bien, añade el nuevo comentario al estado para que se actualice
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
                    <h1 >{dataContainer.title + "  " + dataContainer.price + "$"}</h1>
                </div>
                <div className="_content-div">
                    {/* LEFT CONTENT /////////////////////////////////////////////////////////////// */}
                    <div className="_left-content">
                        <div className="_images-container">
                            <div className="_images-preview">
                                {/* Recorre todas las imagenes y devuelve el componente MiniImage */}
                                {dataContainer.images.map((value, index) => {
                                    return <MiniImage key={index} index={index} url={value.url} />
                                })}
                            </div>
                            <div className="_image-display">
                                {/* Imagen grande */}
                                <img src={show} alt="" className="big-image" />
                            </div>
                        </div>
                        <h2 className="_subtitle" >Caracteristicas generales</h2>
                        <p className="_general-description" >{dataContainer.generaldescription}</p>
                        <h2 className="_subtitle" id="title-comment" >Comentarios</h2>
                        <div className="_comment-container">
                            {/* Condicional para verificar que hay un usuario logeado y no un invitado */}
                            {user.id !== "" ?
                                /// Condicional para saber si el usuario logeado es el dueño de la publicacion
                                user.id === dataContainer.owner ? null :
                                /// Si el usuario logeado no es el dueño, muestra un TextareaAutosize para escribir un comentario
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
                            {/* Cometarios 
                            Presenta los comentarios pero en orden inverso, y asi apareceran los mas nuevos de primero
                            */}
                            {dataContainer.comments.slice(0).reverse().map((item, index) => {
                                /// en ¨owner¨ esta la condicional:  Si el usuario logeado es el dueño = True, caso contrario False
                                /// y asi podemos saber si habilitamos la respuesta del comentario o no
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
                            /// Si no hay descripcion detallada en la imagen, ocultamos el titulo de "Descripcion Detallada"
                            dataContainer.images[imgIndex].detaildescription.length > 0 ? null : { display: "none" }
                        } >Descripcion detallada</p>
                        <div className="_dtd-container">
                            {/* Muestra todas las descripciones detalladas que tiene la imagen, y si no hay simplemente no muestra nada */}
                            {dataContainer.images[imgIndex].detaildescription.map((item, index) => {
                                return <p key={index} >{item}</p>
                            })}
                        </div>

                        <h2 className="_pay-title" >Metodos de pago</h2>
                        <img src={pay} alt="" className="_pay-img" />
                        <button className="_btn" >Comprar</button>
                        <h2 className="_pay-title" >Busquedas Similares</h2>
                        {/* Columna lateral de publicaciones */}
                        <SliderColum />
                    </aside>
                </div>
            </main>
            <Footer/>
        </div>
    )
}


export default ItemPage