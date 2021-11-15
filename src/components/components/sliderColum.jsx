import { useEffect, useState } from "react"
import { useContext } from "react/cjs/react.development"
import { getAll } from "../../api/account"
import { UserContext } from "../../api/userContext"
import "../../styles/sliderBar.css"
import Card from "./card"

const SliderColum = () => {

    const [data, setData] = useState([""])

    const {setMsg} = useContext(UserContext)

    useEffect(() => {
        (async()=>{
            const res = await getAll()
            let arr = []
            let i = 0
            
            // for(i;i < 5;i++){
            //     arr.push(res.data.items[i])
            // }

            if (res.status === 200) {
                for(i;i < 5;i++){
                    arr.push(res.data.items[i])
                }
                setData(arr)
            } else {
                console.log(res.result);
                setMsg({
                    text: "No se ha podido realizar la busqueda",
                    color: "red"
                })
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