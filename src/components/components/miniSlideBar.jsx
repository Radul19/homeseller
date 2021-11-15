import { useState } from "react"
import "../../styles/sliderBar.css"
import Card from "./card"

const MiniSlideBar = (props) => {

    const [margin, setMargin] = useState("0%")

    const styles={
        cards:{
            marginLeft: margin,
        },
    }

    const arrayX =[1,2,3,4,5,6,7,8,9,10]

    const testClick1 =() =>{
        console.log("a");
        setMargin("0%")
        console.log(margin);
    }
    const testClick2 =() =>{
        console.log("b");
        setMargin("-100%")
        console.log(margin);
    }

    return (
        <div className="mini-slideBar" >
            <h2 className="_title-sm" >{props.title}</h2>
            <div className="_container-sm" >
                <p onClick={testClick1} className="_arrowLeft-sm" >&#10094;</p>
                <div className="_slide-sm" >
                    <div style={styles.cards} className="_cards-sm">
                        {arrayX.map((value,index)=>{
                            return <Card key={index}/>
                        })}
                    </div>
                </div>
                <p onClick={testClick2} className="_arrowRight-sm" >&#10095;</p>
            </div>
        </div>
    )
}

export default MiniSlideBar