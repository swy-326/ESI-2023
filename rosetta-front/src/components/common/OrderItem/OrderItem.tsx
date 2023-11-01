import { Container } from "../container/Container"
import { Image } from "../image/Image";
import TagItem from "../tag/TagItem";

import { getTagValue } from '../../../static/tags'
import { getLanguageLabel } from '../../../static/languages'

type OrderItemProps = {
    title: string;
    username: string;
    image_url: string;
    tags: string[];
    languages: string[];
    main_language: string;
}

export default function OrderItem({
    image_url,
    main_language,
    title,
    languages,
    tags,
    username
}: OrderItemProps) {
    return (
        <Container className="bg-secondary-500 text-white shadow-md p-8 flex rounded-md">
            <Container className="w-32 h-32 mr-10">
                <a href="/">
                    <Image src={image_url} alt={`Avatar de ${name}`} className="rounded-full h-32 w-32 object-cover" />
                </a>
            </Container>
            <Container className="flex flex-col justify-evenly">
                <h3 className="text-xl font-bold"> {title} </h3>

                <Container className="flex gap-x-4">
                    <TagItem text={getLanguageLabel(main_language)!} color="bg-primary-500" style="font-bold" />
                    {tags.map( tag => (
                        <TagItem text={getTagValue(tag)!} color="bg-primary-500" style="font-bold" />
                    ))}
                    {languages.map( language => (
                        <TagItem text={getLanguageLabel(language)!} color="bg-primary-500" style="font-bold" />
                    ))}
                </Container>

            </Container>
        </Container>
    )
}