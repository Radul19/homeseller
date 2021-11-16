import { useHistory } from "react-router"
import { useContext } from "react/cjs/react.development"
import { UserContext } from "../../api/userContext"
import image1 from "../../images/example1.png"
import stars from "../../images/Stars.png"
import { linkClick } from "./loadScreen"

const Card = ({item}) => {

    const {setFade,setLoad} = useContext(UserContext)
    const history = useHistory()

    const sendToItem =()=>{
        linkClick(setFade,setLoad,history,`/itemPage/${item.id}`)
    }

    return (
        <div className="card" onClick={sendToItem}  >
            <img className="_picture" src={item ? item.images[0].url : null} alt="" />
            <div className="_content">
                <div className="_details">
                    <p className="_price" >{item ? item.price +"$" : "0$"}</p>
                    <img className="_stars" src={stars} alt="" />
                </div>
                <p className="_description" >{item ? item.title : null}</p>
            </div>
        </div>
    )
}

export default Card