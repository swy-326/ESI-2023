import { Container } from "../container/Container";


type TagProps = {
    color?: string;
    text: string;
    className?: string;
    style?: string;
}

export default function TagItem({
    className =  "",
    style = "",
    color = "bg-primary-500",
    text 
}: TagProps){
    const css = "p-1 font-bold text-white rounded text-center max-w-[300px]"
    return (
        <Container className={ className || `${color} ${css} ${style}`}>
            { text } 
        </Container>
    )
}