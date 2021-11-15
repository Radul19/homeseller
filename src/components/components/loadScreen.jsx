import { useContext } from "react"
import { UserContext } from "../../api/userContext"
import gif from "../../images/load.gif"
const LoadScreen = () => {

    const { fade } = useContext(UserContext)


    // const [loadText, setLoadText] = useState("Loading...")
    // // const [fade, setFade] = useState(null)
    // let aux = 0
    // const changeLoad = () => {
    //     switch (aux) {
    //         case 0:
    //             setLoadText("Cargando")
    //             break;
    //         case 1:
    //             setLoadText("Loading.")
    //             break;
    //         case 2:

    //             setLoadText("Loading..")
    //             break;
    //         case 3:

    //             setLoadText("Loading...")
    //             break;
    //         default:
    //             break;
    //     }
    //     if (aux < 3) {
    //         // console.log(aux);
    //         aux++
    //     } else if (aux === 3) {
    //         aux = 0
    //     }
    // }

    // useEffect(() => {
    //     let intervalId = setInterval(changeLoad, 1000)
    //     return (() => {
    //         clearInterval(intervalId)
    //     })
    // }, [])

    return (
        <div className={`load-screen ${fade}`}>
            {/* <p onClick={() => {
                setFade("out")
                setTimeout(() => {
                    setLoad(false)
                }, 500);
            }}>{loadText}</p> */}
            <img src={gif} className="load-gif" alt="" />
        </div>
    )
}

export const loadOut = (setFade, setLoad, history, direction) => {
    setTimeout(() => {
        history.push(direction)
        setFade("out")
    }, 200);
    setTimeout(() => {
        setLoad(false)
        setFade("in")
    }, 700);
}

export const linkClick = (setFade, setLoad, history, direction) => {
    if (history !== undefined && direction !== undefined) {
        setLoad(true)
        setTimeout(() => {
            history.push(direction)
            setFade("out")
        }, 500);
        setTimeout(() => {
            setLoad(false)
            setFade("in")
        }, 1000);
    } else {
        setLoad(true)
        setTimeout(() => {
            setFade("out")
        }, 500);
        setTimeout(() => {
            setLoad(false)
            setFade("in")
        }, 1000);
    }
}

export default LoadScreen