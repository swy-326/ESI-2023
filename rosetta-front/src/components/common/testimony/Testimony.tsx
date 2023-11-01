import { Container } from "../container/Container";
import { Image } from "../image/Image";

type TestimonyProps = {
    name: string;
    url: string;
    description: string;
    numberOfStars: number;
}

export default function Testimony({
    name,
    url,
    description,
    numberOfStars 
}: TestimonyProps){

    const stars = Array(Math.floor(numberOfStars)).fill("⭐").join("")

    return (
        <Container className="flex gap-8">
            <Container className="w-32 h-32">
                <Image src={url} alt={`Avatar de ${name}`} className="rounded-full w-full h-full object-cover" />
            </Container>
            <Container>
                <Container className="flex gap-x-8">
                    <h4 className="font-bold text-xl">{name}</h4>
                    <span className="text-lg">{stars}</span>
                </Container>
                <p className="text-lg mb-4 font-light"> {description} </p>
            </Container>
        </Container>
    )
}