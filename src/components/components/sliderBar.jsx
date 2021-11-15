import { useState } from "react"
import "../../styles/sliderBar.css"
import Card from "./card"

const SliderBar = (props) => {

    const [margin, setMargin] = useState("0%")

    const styles = {
        cards: {
            marginLeft: margin,
        },
    }

    const arrayX = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]

    const findAnswer = () => {
        const aux = arrayX.length % 4
        // console.log(aux);
        for (let i = 0; i < aux; i++) {
            arrayX.pop()
        }
    }
    findAnswer()

    const testClick1 = () => {
        setMargin("0%")
    }
    const testClick2 = () => {
        setMargin("-100%")
    }

    return (
        <div className={props.small ?
            "small-sliderBar" : "sliderBar"
        } >
            <h2 className="_title" >{props.title}</h2>
            <div className="_container" >
                <p onClick={testClick1} className="_arrowLeft" >&#10094;</p>
                <div className="_slide" >
                    <div style={styles.cards} className="_cards">
                        {arrayX.map((value, index) => {
                            return <Card key={index} />
                        })}
                    </div>
                </div>
                <p onClick={testClick2} className="_arrowRight" >&#10095;</p>
            </div>
        </div>
    )
}





export default SliderBar