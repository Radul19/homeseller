import "../../styles/explorePage.css"
import Header from "../components/header"
import Card from "../components/card"
import "../../styles/sliderBar.css"
import { useContext, useEffect, useState } from "react"
import { useParams } from "react-router"
import getAll from "../../api/account"
import { UserContext } from "../../api/userContext"

const Filter = (props) => {

    const [click, setClick] = useState(false)




    const toggle = () => {
        setClick(!click)
    }

    const style = {
        text: {
            color: "#191919"
        }
    }

    return (
        <div className="filter" onClick={toggle}  >
            <div className="_circle" >
                {click ? <div className="_dot" ></div> : null}
            </div>
            <p className="name" style={click ? style.text : null} >{props.name}</p>
        </div>
    )
}

const ExplorerPage = () => {
    const { text } = useParams()

    const { setMsg } = useContext(UserContext)

    useEffect(() => {

        (async () => {
            const res = await getAll()
            if (res.status == 200) {
                setCardData(res.data.items)
            } else {
                console.log(res.result);
                setMsg({
                    text: "No se ha podido realizar la busqueda",
                    color: "red"
                })
            }
        })()

        return () => {
            console.log("a");
        }
    }, [])

    // const filterArray = [1, 2, 3, 4, 5, 6,]
    const cardArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]

    const [cardData, setCardData] = useState([])

    return (
        <div className="explorePage" >
            <Header />
            <div className="_contentContainer">
                <aside className="_filter">
                    <h2>Filtros</h2>
                    <Filter name="Valoracion" />
                    <Filter name="Precio" />
                    <Filter name="Tamaño" />
                    <Filter name="Recientes" />
                    <Filter name="Mas visitados" />
                </aside>
                <div className="_result">
                    {cardData.map((value, index) => {
                        return <Card key={index} item={value} />
                    })}
                </div>
            </div>
        </div>
    )
}

export default ExplorerPage