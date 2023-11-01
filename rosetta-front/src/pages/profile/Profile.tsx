import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Image, Topbar } from "../../components";
import PortfolioItem from "../../components/common/portfolio-item/PortfolioItem";
import TagItem from "../../components/common/tag/TagItem";
import Testimony from "../../components/common/testimony/Testimony";
import HttpClient from "../../services/http/api";

import { getLanguageLabel } from '../../static/languages'
import { getTagValue } from '../../static/tags'

function RatingItem({
    value = 0,
    count = 0,
    total = 1
}){
    const width = (count / total) * 100
    
    const style = {
        width
    }

    return (
        <Container className="flex">
            <p className="mr-8 text-lg w-64"> {value} estrelas ({count} avaliações) </p>
            <Container className="h-4 w-[100px] bg-[#C0ADAD] rounded relative">
                <span className="block h-4 rounded bg-yellow-400 absolute inset-0" style={style}/>
            </Container>
        </Container>
        
    )
}

type Testimonials = {
    name: string;
    avatar: string;
    stars: number;
    description: string;
}

type Raiting = {
    count: number;
    stars: [{
        stars: number;
        total: number;
    }],
    testimonials: Testimonials[]
}

type Portfolio = {
    title: string;
    url: string;
}

type ProfileResponse = {
    id: string;
    internal_id: number;
    name: string;
    email: string;
    country: string;
    avatar: string;
    city: string;
    mini_bio: string;
    bio: string;
    main_language: string;
    languages: string[];
    abilities: string[];
    created_at: Date;
    raitings: Raiting;
    portfolio: Portfolio[];

}


export default function Profile(){
    const [ user, setUser ] = useState<ProfileResponse>();
    const { id } = useParams();

    useEffect( () => {
        async function fetchUserInformation(){
            const data = await HttpClient.findUser(id)
            const user = await data.json();

            setUser(user)
        }

        fetchUserInformation()
    }, [] )

    const state = {
        name: "José Alberto",
        profile_picture: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
        email: "jose@email.com",
        country: "Brazil",
        city: "São Paulo",
        mini_bio: "Professor de Inglês com 10 anos de profissão", 
        biography: `
            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum
            has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley 
            of type and scrambled it to make a type specimen book. It has survived not only five centuries, 
            but also the leap into electronic typesetting, remaining essentially unchanged. 
            It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, 
            and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
        `,
        main_language: {
            value: "PORTUGUESE",
            label: "Português"
        },
        languages: [
            "Inglês",
            "Espanhol"
        ],
        abilities: [
            "Edição de Vídeo",
            "Ediçaõ de Imagens"
        ],
        projects: [
            { name: "Projeto 1", url: "" },
            { name: "Projeto 1", url: "" },
            { name: "Projeto 1", url: "" }
        ],
        raiting: {
            count: 50,
            stars: [
                { value: 5, count: 30 },
                { value: 4, count: 10 },
                { value: 3, count: 5 },
                { value: 2, count: 2 },
                { value: 1, count: 1 },
            ],
            testimonials: [{
                name: 'João Gomes',
                image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
                description: 'muito rápida e tradução muito boa, me ajudou muito'
            },{
                name: 'João Gomes',
                image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
                description: 'muito rápida e tradução muito boa, me ajudou muito'
            },{
                name: 'João Gomes',
                image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
                description: 'muito rápida e tradução muito boa, me ajudou muito'
            }]
        }
    }

    const numberOfRaiting = user?.raitings.count

    const totalStars = user
                ?.raitings
                .stars
                .reduce( (accumulator, { stars, total }) => accumulator + (stars * total), 0 ) || 0 

    const mean = numberOfRaiting 
            ? (totalStars / numberOfRaiting)
            : 0

    const stars = Array(Math.floor(mean)).fill("⭐").join("")

    return (
        <Container>
            <Topbar />
            { user &&
            <>
            <Container className="max-w-7xl mx-auto">
                <Container className="grid grid-cols-[256px,1fr,300px] py-10">
                    <Container className="w-64 h-64 flex-shrink-0 mr-12">
                        <Image
                            src={user.avatar}
                            alt={`Avatar de ${state.name}`}
                            className="rounded-lg w-full h-full object-cover"
                        />
                    </Container>
                    <Container className="max-w-sm">
                        <h1 className="font-xl pl-8 max-w-3xl font-bold"> {user.name}</h1> 
                        <p> {user.mini_bio} </p>
                    </Container>
                    <Container className="w-full flex gap-9">
                        <Container className="flex flex-col gap-y-4">
                            {user.languages.map( language => (
                                <TagItem text={getLanguageLabel(language)!}/>
                            ))}
                        </Container>
                        <Container className="flex flex-col gap-y-4">
                            {user.abilities.map( ability => (
                                <TagItem text={getTagValue(ability)!} style="mb-1" />
                            ))}
                        </Container>
                    </Container>
                </Container>
            </Container>
            
            <Container className="bg-secondary-500">
                <Container className="max-w-7xl mx-auto py-10 text-white">
                    <h1 className="text-3xl font-bold uppercase mb-8"> Biografia </h1>
                    <p className="text-xl font-light max-w-5xl">
                        {user?.bio}
                    </p>
                </Container>
            </Container>
            
            <Container className="max-w-7xl mx-auto py-6">
                <h2 className="text-3xl font-bold uppercase mb-8"> Portfolio </h2>
                <Container className="flex gap-4">
                    { user.portfolio.map( project => (
                        <PortfolioItem name={project.title} url={project.url} /> 
                    ))}
                </Container>
            </Container>

            <Container className="max-w-7xl mx-auto py-6">
                <h2 className="text-3xl font-bold uppercase mb-8"> Avaliações </h2>
                
                <Container className="w-full flex gap-8">
                    
                    <Container className="flex flex-col items-center justify-evenly pr-8 border-r border-r-black">
                        <span className="font-bold text-4xl"> {mean.toFixed(2)} </span>
                        <span className="text-xl"> {stars} </span>
                        <p className="text-xl whitespace-nowrap"> {`(${numberOfRaiting}) avaliações` } </p>
                    </Container>
                    
                    <Container>
                        {user.raitings.stars.map( raiting => (
                            <RatingItem value={raiting.stars} count={raiting.total} total={user.raitings.count} />
                        ))}
                    </Container>

                </Container>

                <Container className="flex flex-col gap-y-8 mt-16">
                        {user.raitings.testimonials.map( testimony => (
                            <Testimony name={testimony.name} description={testimony.description} url={testimony.avatar} numberOfStars={5} />
                        ))}
                </Container>
            </Container>
            </>
            }
        </Container>
    )
}