import Header from "../components/header"
// import profileIcon from "../../images/profile-icon.jpg"
import img1 from "../../images/profile-icon.jpg"
import "../../styles/companyPage.css"
import SliderColum from "../components/sliderColum"
import { UserContext } from "../../api/userContext"
import { useContext, useEffect, useState } from "react"
import api from "../../api/account"
import { useHandleErr } from "../../api/useHandleErr"

import { linkClick } from "../components/loadScreen"

import Grp1 from "../../images/Group 1.png"
import Grp2 from "../../images/Group 2.png"
import Grp3 from "../../images/Group 3.png"
import { useHistory, useParams } from "react-router"

const ItemDisplay = ({ item }) => {

    const { setFade, setLoad } = useContext(UserContext)
    const history = useHistory()

    const click = () => {
        linkClick(setFade, setLoad, history, `/itemPage/${item.id}`)
    }

    return (
        <div className="_item-display" onClick={click} >
            <img className="_item-img" src={item.images[0].url} alt="" />
            <div className="_data">
                <div className="_title-price">
                    <p className="_title">{item.title}</p>
                    <p className="_price">{item.price + "$"}</p>
                </div>
                <div className="_dtd">
                    <p>{item.generaldescription}</p>
                </div>
            </div>
        </div>
    )
}

// const ItemModal = () => {
//     return (
//         <div className="_itemModal">
//             <label htmlFor=""></label>
//             <input type="text" />
//             <label htmlFor=""></label>
//             <input type="text" />
//             <label htmlFor=""></label>
//             <input type="text" />
//             <label htmlFor=""></label>
//             <input type="text" />
//         </div>
//     )
// }



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
        posts: []
    })
    const [prevData, setPrevData] = useState({
        name: "",
        id: "",
        description: "",
        email: "",
        posts: []
    })
    const [array, setArray] = useState([])

    useEffect(() => {
        (async () => {
            const res = await api.getUser(id)
            if (res.status === 200) {
                setData(res.data)
                setPrevData(res.data)
            } else {
                handleError(res)
            }
        })()
    }, [])

    const arrayX = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]
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
                linkClick(setFade, setLoad, history, "/itemCreate")
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

    // const forceLoad=()=>{
    //     setData(data)
    //     setArray(array)
    //     console.log(data);
    //     console.log(array);
    //     array.map(()=>{
    //         console.log("wtf");
    //     })
    // }

    return (
        <div className="companyPage">
            {createItem ?
                <div className="blackScreen2">
                    <div className="_modal">
                        <h3>Seleccione un tipo de presentacion</h3>
                        <div className="_img-ctn">
                            <div className={newItemType === 1 ? "_selected" : null} onClick={() => { setNewItemType(1) }} >
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
                            <button style={{ backgroundColor: "#ca3f3f" }} onClick={() => { setCreateItem(false) }} >Cancelar</button>
                            <button style={{ backgroundColor: "#66bb70" }} onClick={goCreateItem} >Aceptar</button>
                        </div>
                    </div>
                </div>
                : null}
            <Header />
            <main className="_general-container">
                <div className="_company-info-container">
                    <div className="_img-div">
                        <img src={img1} alt="" className="_profile-picture" />
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
                                <button style={{ backgroundColor: "#7bd185", color: "#006d0d" }} onClick={() => { setCreateItem(true) }}  >Anadir</button>
                                <button style={{ backgroundColor: "#d17b7b", color: "#880000" }} >Eliminar</button>
                                <button style={{ backgroundColor: "#f9cf93", color: "#744300" }} >Editar</button>
                            </div>
                        </div>
                        {data.posts.map((item, index) => {
                            return <ItemDisplay item={item} key={index} />
                        })}
                    </div>
                    <div className="_right">
                        <h2 className="_subtitle" >Otros</h2>
                        <SliderColum />
                    </div>
                </div>
            </main>
        </div>
    )
}

export default CompanyPage