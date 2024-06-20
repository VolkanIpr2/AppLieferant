import { Carousel } from "react-bootstrap"
import Image from "next/image"

export default function Slider() {
    return (
        <div>
            <Carousel controls={false} fade={true}>
                <Carousel.Item>
                    <Image className="d-block w-100 rounded-3" src='/bilder/essen/burger.jpg' alt="burger" width={2000} height={500} />
                </Carousel.Item>
                <Carousel.Item>
                    <Image className="d-block w-100 rounded-3" src='/bilder/essen/pizza.jpg' alt="pizza" width={2000} height={500} />
                </Carousel.Item>
                <Carousel.Item>
                    <Image className="d-block w-100 rounded-3" src='/bilder/essen/burrito.jpg' alt="burrito" width={2000} height={500} />
                </Carousel.Item>
            </Carousel>
        </div>
    )
}
