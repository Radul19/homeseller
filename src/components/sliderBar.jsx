import { useRef } from "react/cjs/react.development"
import "../styles/sliderBar.css"
import Card from "./card"
import left from "../images/left.png"
import right from "../images/right.png"

import { Swiper, SwiperSlide } from "swiper/react";
import 'swiper/swiper-bundle.min.css'
import 'swiper/swiper.min.css'

const SliderBar = ({data,SPV,width="100%"}) => {

    const navigationPrevRef =useRef(null)
    const navigationNextRef =useRef(null)

    return (
        <div className="swiper-container" style={{width}} >
            <div className="swiper-button-prev-unique" onClick={() => { navigationPrevRef.current.click() }} >
                <img src={left} alt="" className="swiper-btn swiper-left" />
            </div>
            <Swiper
                navigation={{
                    prevEl: '.prev',
                    nextEl: '.next',
                }} slidesPerView={SPV} spaceBetween={50} slidesPerGroup={SPV} loop={true} loopFillGroupWithBlank={true} className="mySwiper">
                {data.map((item, index) => {
                    return (
                        <SwiperSlide key={index}>
                            <Card key={index} item={item} />
                        </SwiperSlide>
                    )
                })}
                <div className="prev" ref={navigationPrevRef} ></div>
                <div className="next" ref={navigationNextRef} ></div>
            </Swiper>
            <div className="swiper-button-prev-unique" onClick={() => { navigationNextRef.current.click() }} >
                <img src={right} alt="" className="swiper-btn swiper-right" />
            </div>
        </div>
    )
}





export default SliderBar