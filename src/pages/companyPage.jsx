import "../styles/companyPage.css"
import { useContext, useEffect, useRef, useState } from "react"
import { useHistory, useParams } from "react-router"
import api from "../api/account"
import { UserContext } from "../api/userContext"
import { useHandleErr } from "../api/useHandleErr"
import Header from "../components/header"
import SliderColum from "../components/sliderColum"
import { linkClick, loadOut } from "../components/loadScreen"
import { Footer } from "../components/footer"



import img1 from "../images/profile-icon.jpg"
import Grp1 from "../images/Group 1.png"
import Grp2 from "../images/Group 2.png"
import Grp3 from "../images/Group 3.png"

const ItemDisplay = ({ item, posts, index, setPosts }) => {
    const { handleError } = useHandleErr()

    const { setFade, setLoad, setMsg } = useContext(UserContext)
    const history = useHistory()

    const click = () => {
        linkClick(setFade, setLoad, history, `/itemPage/${item.id}`)
    }

    const clickEdit = () => {
        // console.log(posts)
        linkClick(setFade, setLoad, history, `/itemCreate/${item.id}`)
        // history.replace(`itemCreate/${item.id}`)
        // history.go(0)
    }

    const clickDelete = async () => {
        setLoad(true)
        const res = await api.deleteItem(item)
        console.log(res)
        if (res.status === 200) {
            const aux = posts
            aux.splice(index, 1)
            setPosts([...aux])
            setMsg({
                text: "Se ha borrado correctamente la publicacion",
                color: "green"
            })
            loadOut(setFade, setLoad)

        } else {
            handleError(res)
        }



        // posts.splice(index,1)
    }

    return (
        <div className="_item-display" >
            <img className="_item-img" src={item.images[0].url} onClick={click} alt="" />
            <div className="_data">
                <div className="_title-price" onClick={click}>
                    <p className="_title"  >{item.title}</p>
                    <p className="_price">{item.price + "$"}</p>
                </div>
                <div className="_dtd">
                    <p>{item.generaldescription}</p>
                </div>
                <div className="_btns-ctn">
                    <button onClick={clickEdit} >Editar</button>
                    <button onClick={clickDelete} >Eliminar</button>
                </div>
            </div>
        </div>
    )
}


const CompanyPage = () => {

    const { handleError } = useHandleErr()
    const { id } = useParams()


    const [edit, setEdit] = useState(false)
    const { setFade, setLoad, user, setMsg } = useContext(UserContext)
    const history = useHistory()
    const [newItemType, setNewItemType] = useState(0)
    const [createItem, setCreateItem] = useState(false)
    const [data, setData] = useState({
        name: "",
        id: "",
        description: "",
        email: "",
        profilepic: "",
    })
    const [prevData, setPrevData] = useState({
        name: "",
        id: "",
        description: "",
        email: "",

    })
    const [posts, setPosts] = useState([""])

    useEffect(() => {
        (async () => {
            const res = await api.getUser(id)
            if (res.status === 200) {
                console.log(res)
                setPosts(res.data.posts)
                setData(res.data)
                setPrevData(res.data)
            } else {
                handleError(res)
            }
        })()
        // eslint-disable-next-line
    }, [])

    const handleEdit = (name, value) => setData({ ...data, [name]: value });

    const handleEditFetch = async () => {
        const res = await api.editData(data, user.type)
        if (res.status === 200) {
            setPrevData(data)
            setEdit(false)
            setMsg({
                text: "Datos actualizados corrrectamente",
                color: "green"
            })
        } else {
            handleError(res)
        }
    }

    const goCreateItem = () => {
        switch (newItemType) {
            case 1:
                linkClick(setFade, setLoad, history, "/itemCreate/new")
                break;
            case 2:
                linkClick(setFade, setLoad, history, "/itemPage2/new")
                break;
            case 3:
                linkClick(setFade, setLoad, history, "/itemPage3/new")
                break;
            default:
                break;
        }
    }
    const inputFile = useRef(null)
    const profileClick = () => {
        console.log(data)
        inputFile.current.click()
    }
    const inputFileChange = async (e) => {
        console.log("some?");
        let file = e.target.files[0];
        if (file) {
            const res = await api.updateProfilePic(file, data.id)
            if (res.status === 200) {
                setData({ ...data, profilepic: res.data.url })
                setMsg({
                    text: "Imagen de perfil actualizada corrrectamente",
                    color: "green"
                })
            }
        }
    }



    return (
        <div className="companyPage">
            {createItem ?
                <div className="blackScreen2">
                    <div className="_modal">
                        <h3>Seleccione un tipo de presentacion</h3>
                        <div className="_img-ctn">
                            <div className={newItemType === 1 ? "_selected" : null} onClick={() => { setNewItemType(1) }}  >
                                <img src={Grp1} alt="" />
                                <p>Tradicional</p>
                            </div>
                            <div className={newItemType === 2 ? "_selected" : null} onClick={() => { setNewItemType(2) }} >
                                <img src={Grp2} alt="" />
                                <p>Modo cine</p>
                            </div>
                            <div className={newItemType === 3 ? "_selected" : null} onClick={() => { setNewItemType(3) }} >
                                <img src={Grp3} alt="" />
                                <p>Ventanas Modale</p>
                            </div>
                        </div>
                        <div className="_btn-ctn">
                            <button className="_cancel" onClick={() => { setCreateItem(false) }} >Cancelar</button>
                            <button className="_accept" onClick={goCreateItem} >Aceptar</button>
                        </div>
                    </div>
                </div>
                : null}
            <Header />
            <main className="_general-container">
                <div className="_company-info-container">
                    <div className="_img-div">
                        <div className="_black-div" onClick={profileClick} >
                            {data.profilepic === "" ?
                                <img src={img1} alt="" className="_profile-picture"  />
                                : <img src={data.profilepic} alt="" className="_profile-picture" />}
                            {/* <img src={data.profilepic === "" ? img1 : data.profilepic} alt="" className="_profile-picture"  onClick={profileClick} /> */}
                            <input type='file' id='file' name="images" ref={inputFile} style={{ display: 'none' }} onChange={(e) => { inputFileChange(e) }} />
                        </div>
                    </div>
                    <div className="_info-div">
                        {!edit ? (
                            <>
                                <p className="_company-name" >{data.name}</p>
                                <p>{data.description}</p>
                                <p className="_company-email" >{data.email}</p>
                            </>
                        ) :
                            <>
                                <input className="_input-edit" placeholder="Nombre de usuario" type="text" onChange={(e) => { handleEdit("name", e.target.value) }} value={data.name} />
                                <textarea className="_input-edit" placeholder="Descripcion" type="text" onChange={(e) => { handleEdit("description", e.target.value) }} value={data.description} spellCheck={false} cols="30" rows="4" />
                                <input className="_input-edit" placeholder="Correo" type="text" onChange={(e) => { handleEdit("email", e.target.value) }} value={data.email} />
                            </>
                        }
                        {edit ? <p className="_edit" onClick={handleEditFetch} >&#9998; Realizar cambios</p>
                            : <p className="_edit" onClick={() => { setEdit(!edit) }} >&#9998; Editar datos</p>}
                        {!edit ? null : <p className="_edit-cancel" onClick={() => {
                            setData(prevData)
                            setEdit(!edit)
                        }} >&#10006; Cancelar</p>}
                    </div>
                </div>
                <div className="_content-container">
                    <div className="_left">
                        <div style={{ width: "100%", display: "flex" }} >
                            <h2 style={{ width: "50%", }} className="_subtitle" >Inmobiliarios en Venta</h2>
                            <div className="_btn-ctn" >
                                <button onClick={() => { setCreateItem(true) }}  >Anadir</button>
                            </div>
                        </div>
                        {posts[0] !== "" ?
                            posts.map((item, index) => {
                                return <ItemDisplay item={item} key={index} setPosts={setPosts} posts={posts} index={index} />
                            }) : null}
                    </div>
                    <div className="_right">
                        <h2 className="_subtitle"  >Otros</h2>
                        <SliderColum />
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}

export default CompanyPage