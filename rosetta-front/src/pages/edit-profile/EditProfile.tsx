import { ChangeEvent, useEffect, useState } from "react";
import { Button, Container, Image, Topbar } from "../../components";
import { Input } from "../../components/common/input/Input";
import Select from 'react-tailwindcss-select'
import HttpClient from "../../services/http/api";
import { useForm } from "react-hook-form";

import languages, { findLanguage } from '../../static/languages'
import abilities, { findAbility } from '../../static/tags';
import { Option } from "react-tailwindcss-select/dist/components/type";
import { UploadImageModal } from "../../components/modal/UploadImageModal";
import { AddProjectModal } from "../../components/modal/AddProjectModal";
import PortfolioItem from "../../components/common/portfolio-item/PortfolioItem";

type Label = {
    value: string;
    label: string;
}

type ProfileResponse = {
    id: string;
    internal_id: number;
    name: string;
    avatar: string;
    email: string;
    country: string;
    city: string;
    mini_bio: string;
    bio: string;
    portfolio: {
        url: string;
        title: string;
    }[];
    main_language: Label;
    languages: Label;
    abilities: Label;
    created_at: Date;
}

export default function EditProfile() {

    const { register, handleSubmit, reset } = useForm()
    const [ openUploadModal, setOpenUploadModal ] = useState(false)
    const [ openAddProjectModal, setOpenAddProjectModal ] = useState(false)
    const [ state, setState] = useState<ProfileResponse | null>(null);
    const [ mainLanguage, setMainLanguage ] = useState<Option | null>(null)
    const [ userLanguages, setUserLanguages ] = useState<Option[]>([])
    const [ userAbilities, setUserAbilities ] = useState<Option[]>([])

    const handleAddProject = (project) => {
        if(state){
            const projects = [...state.portfolio, project]
            const next = {
                ...state,
                portfolio: projects
            }
            setState(next)
        }
    }

    const handleChangePicture = (url) => {
        setState({
            ...state!,
            avatar: url
        })
    }

    useEffect(() => {
        async function fetchProfileInformations() {
            const response = await HttpClient.profile()
            const data = await response.json()

            console.log(data)

            setUserAbilities(data.abilities.map( ability => findAbility(ability)))
            setUserLanguages(data.languages.map( language => findLanguage(language)))
            setMainLanguage(findLanguage(data.main_language))

            setState(data)
        }

        fetchProfileInformations()
    }, [])

    useEffect( () => {
        reset(state!)
    }, [state])

    const log = async (data) => {
        const values = {
            ...data,
            main_language: mainLanguage?.value,
            languages: userLanguages.map(language => language.value),
            abilities: userAbilities.map( ability => ability.value)
        }

        const token = localStorage.getItem("token")

        const updated = await fetch("http://localhost:3000/api/user/update", {
            method: "PUT",
            body: JSON.stringify(values),
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        })

        const user = await updated.json()

        setState(user)
    }

    return (
        <Container>
            <Topbar />
            <Container className="max-w-7xl mx-auto pt-24">
                { openUploadModal && <UploadImageModal isOpen={openUploadModal} onSucess={handleChangePicture} setIsOpen={setOpenUploadModal} />}
                { openAddProjectModal && <AddProjectModal isOpen={openAddProjectModal} setIsOpen={setOpenAddProjectModal} onSucess={handleAddProject} /> }
                {state && (
                    <>
                        <form onSubmit={handleSubmit(log)}>
                        <Container className="flex mb-8">
                            <Container className="w-64 h-64 flex-shrink-0 mr-12">
                                <Image
                                    src={ state.avatar}
                                    alt={`Avatar de ${state.name}`}
                                    className="rounded-lg h-full w-full"
                                />
                                <Button type="button" fullWidth className="bg-primary-500 border-0" onClick={ () => setOpenUploadModal(true)}>Fazer Upload</Button> 
                            </Container>
                            <Container className="w-full grid grid-cols-2 gap-x-8 items-center">
                                <Container className="w-full">
                                    <h1 className="text-xl font-bold"> Informações Básicas</h1>
                                    <Input
                                        type="text"
                                        labelText="Seu nome"
                                        placeholder="digite seu nome..."
                                        {...register('name')}
                                        id="1"
                                    />
                                    <Input
                                        type="email"
                                        labelText="Seu email"
                                        placeholder="digite seu nome..."
                                        id="1"
                                        {...register('email')}
                                    />
                                </Container>
                                <Container>
                                    <h1 className="text-xl font-bold"> Informações Geograficas</h1>
                                    <Input
                                        type="text"
                                        labelText="Seu país"
                                        placeholder="digite seu pais..."
                                        value={state.country}
                                        id="1"
                                        {...register('country')}
                                    />
                                    <Input
                                        type="text"
                                        value={state.city}
                                        labelText="Seu estado"
                                        placeholder="digite seu estado..."
                                        id="1"
                                        {...register('city')}
                                    />
                                </Container>
                            </Container>
                        </Container>

                        <Container className="mt-10">
                            <h1 className="text-xl font-bold mb-2">Conte um pouco sobre você </h1>
                            <textarea
                                className="block w-1/2 h-80 pb-10 border-black resize-none"
                                {...register('bio')}
                            />
                        </Container>

                        <Container className="w-full grid grid-cols-2 gap-x-10 mt-10">
                            <Container>
                                <Container className="mb-4">
                                    <h1 className="text-xl font-bold mb-2">Escolha suas linguagens</h1>
                                    <p className="text-lg my-4">
                                        A língua base será levada em consideração na
                                        hora de procurar pedidos para você responder,
                                        normalmente é a sua língua materna
                                    </p>
                                    <Select
                                        options={languages}
                                        value={mainLanguage}
                                        onChange={ (value) => setMainLanguage(value as Option)}
                                    />
                                </Container>
                                <Container>
                                    <h1 className="text-xl font-bold mb-2">Escolha outras línguagens</h1>
                                    <p className="text-lg my-4">
                                        Adicione linguagens a quais tem proficiência e que deseja
                                        trabalhar realizando traduções
                                    </p>
                                    <Select
                                        options={languages}
                                        value={userLanguages}
                                        onChange={ (value) => setUserLanguages(value as Option[] )}
                                        isMultiple={true}
                                    />
                                </Container>
                            </Container>

                            <Container>
                                <h1 className="text-xl font-bold mb-2">Escolha suas habilidades</h1>
                                <p className="text-lg my-4">
                                    Escolha as formas com que deseja trabalhar de acordo com a proficiência
                                    com outras ferramentas
                                </p>
                                <Select
                                    options={abilities}
                                    value={userAbilities}
                                    onChange={(value) => setUserAbilities(value as Option[])}
                                    isMultiple={true}
                                />
                            </Container>
                        </Container>

                        <Container className="my-10">
                            <h1 className="text-lg font-bold">Portfólio</h1>
                            <Container className="flex">
                                {state?.portfolio?.map( portfolio => (
                                    <PortfolioItem name={portfolio.title} url={portfolio.url} />
                                ))}
                            </Container>
                            

                            <Button type="button" onClick={() => setOpenAddProjectModal(true)}> Adicionar Projeto</Button>
                        </Container>

                        <Button
                            onClick={ () => null}
                            type="submit"
                        >Atualizar Perfil</Button>
                    </form>
                    </>
                )}
            </Container>

        </Container>
    )
}