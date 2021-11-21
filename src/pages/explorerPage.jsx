import "../styles/explorePage.css"
import "../styles/sliderBar.css"
import { useContext, useEffect, useState } from "react"
import { useParams } from "react-router"
import api from "../api/account"
import { UserContext } from "../api/userContext"
import Header from "../components/header"
import Card from "../components/card"
import { Footer } from "../components/footer"

const Filter = ({ name, data, setSort, sort, setCopy }) => {
    const toggle = async () => {
        const arr = [...data]
        if (name === sort) {
            setSort("")
        } else {
            if (name === "Precio") price(arr)
            if (name === "Recientes") title(arr)
            if (name === "Mas visitados") views(arr)
            setSort(name)
        }
        // console.log(arr)
        setCopy(arr)
    }

    const price = (arr) => {
        arr.sort((a, b) => (a.price < b.price) ? 1 : -1)
    }
    const title = (arr) => {
        arr.sort((a, b) => (a.title > b.title) ? 1 : -1)
    }
    const views = (arr) => {
        arr.sort((a, b) => (a.views > b.views) ? 1 : -1)
    }
    const style = { text: { color: "#191919" } }

    return (
        <div className="filter" onClick={toggle}  >
            <div className="_circle" >
                {sort === name ? <div className="_dot" ></div> : null}
            </div>
            <p className="name" style={sort === name ? style.text : null} >{name}</p>
        </div>
    )
}

const ExplorerPage = () => {
    const { text } = useParams()
    const { setMsg } = useContext(UserContext)
    const [sort, setSort] = useState("")
    const [copyData, setCopyData] = useState([])
    const [cardData, setCardData] = useState([])

    // let cardData = []


    useEffect(() => {

        (async () => {
            let res
            if (text === " ") {
                res = await api.getAll()
                console.log(res)
            } else {
                res = await api.search(text)
                console.log(res)
            }
            if (res.status === 200) {
                console.log(res)
                setSort("")
                setCardData(res.data)
                setCopyData(res.data)
            } else {
                console.log(res.result);
                setMsg({
                    text: "No se ha podido realizar la busqueda",
                    color: "red"
                })
            }
        })()
        // eslint-disable-next-line
    }, [text])
    return (
        <>
            <div className="explorePage" >
                <Header />
                <div className="_contentContainer">
                    <aside className="_filter">
                        <h2 onClick={() => {
                            console.log(cardData)
                            console.log("///")
                            console.log(sort)
                            console.log("///")
                            console.log(copyData)
                        }} >Filtros</h2>
                        {/* <Filter name="Valoracion" data={cardData} setSort={setSort} sort={sort} setData={setCardData} /> */}
                        {/* <Filter name="Tamaño" data={cardData} setSort={setSort} sort={sort} setData={setCardData} /> */}
                        <Filter name="Recientes" data={cardData} setSort={setSort} sort={sort} setCopy={setCopyData} />
                        <Filter name="Precio" data={cardData} setSort={setSort} sort={sort} setCopy={setCopyData} />
                        <Filter name="Mas visitados" data={cardData} setSort={setSort} sort={sort} setCopy={setCopyData} />
                    </aside>
                    <div className="_result">
                        {copyData.map((value, index) => {
                            return <Card key={index} item={value} />
                        })}
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}

export default ExplorerPage