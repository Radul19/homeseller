import { useEffect, useState } from "react"
import api from "../api/account"
import "../styles/sliderBar.css"
import Card from "./card"

const SliderColum = () => {

    const [data, setData] = useState([""])
    useEffect(() => {
        (async()=>{
            const res = await api.getAll()
            let arr = []
            let i = 0
            if (res.status === 200) {
                for(i;i < 5;i++){
                    arr.push(res.data[i])
                }
                setData(arr)
            } else {

            }

        })()
        return () => {
            
        }
    }, [])

    return (
        <div className="sliderColum" >
            {data.map((item,index)=>{
                return <Card key={index} item={item} />
            })}
        </div>
    )
}





export default SliderColum