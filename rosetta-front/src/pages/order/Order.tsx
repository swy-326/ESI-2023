import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button, Container, Image, Topbar } from "../../components";
import TagItem from "../../components/common/tag/TagItem";
import HttpClient from "../../services/http/api";
import MDEditor from '@uiw/react-md-editor';
import ReactMarkdown from 'react-markdown'
import { Field, SubmitHandler, useForm } from "react-hook-form";
import { RateProjectModal } from "../../components/modal/RateProjectModal";
import Loader from 'react-spinners/ClipLoader'
import gfm from 'remark-gfm'

import { getTagValue } from '../../static/tags'
import { getLanguageLabel } from "../../static/languages";

type OrderResponse = {
    "id": string;
    "internal_id": number,
    "user_id": number,
    "translator_id": number,
    "title": string,
    "price": string,
    "description": string,
    "main_language": string,
    "tags": string[],
    "languages": string[],
    "files": string[],
    "completed": boolean,
    "expire_at": Date,
    "created_at": Date,
    "answer": string;
    "answers": OrderResponse[],
    "canAnswerOrder": boolean,
    "canRateOrder": boolean,
    "user": {
        "name": string;
        "avatar": string;
    }
}

export default function Order() {
    const { id } = useParams()
    const { register, handleSubmit } = useForm()
    const [ isLoading, setIsLoading ] = useState(false)
    const [order, setOrder] = useState<OrderResponse | null>(null)
    const [value, setValue] = useState("**Digite sua resposta...**");
    const [open, setOpen] = useState(false)


    const wait = async (time) => new Promise( resolve => setTimeout(resolve, time))

    useEffect(() => {
        async function fetchOrder() {
            const response = await HttpClient.fetchOrder(id)
            const data = await response.json()
            console.log(data)
            setOrder(data)
        }

        fetchOrder()
    }, [])

    const handleSubmitAnswer = async ({ files } : any ) => {
        const form = new FormData()

        for(const file of files){
            form.append("files", file)
        }

        form.append("answer", value)

        setIsLoading(true)
        const token = localStorage.getItem("token")

        const response = await fetch(`http://localhost:3000/api/orders/${id}/answer`, {
            body: form,
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
        await wait(1000)

        const data = await response.json()

        setIsLoading(false)
        setOrder(data)
    }

    const hasAnswer = order?.answers?.length ?? 0
    const notAccepted = (order?.translator_id === null ) && !hasAnswer && parseInt(order?.price) !== 0

    const handleAccept = async () => {
        setIsLoading(true)
        const token = localStorage.getItem("token")
        const data = await fetch(`http://localhost:3000/api/orders/${id}/accept`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
        await wait(500)
        const { translator_id } = await data.json()
        setIsLoading(false)
        setOrder({
            ...order!,
            translator_id,
            canAnswerOrder: true
        })
    }

    const handleSubmitRating = async (rate) => {
        const token = localStorage.getItem("token")
        await fetch(`http://localhost:3000/api/orders/${id}/rate`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(rate)
        })

        setOpen(false)
        setOrder({
            ...order!,
            completed: true,
            canRateOrder: false
        })
    }

    return (
        <Container>
            <Topbar />
            {order && (
                <>
                     {isLoading && (
                        <Container className="max-w-7xl mx-auto flex items-center justify-center">
                            <div className="fixed inset-0 bg-black/70 flex items-center justify-center" aria-hidden="true">
                                <Loader
                                    size={150}
                                    color="#fff"
                                />
                            </div>
                        </Container>
                    )}
                    {open && <RateProjectModal isOpen={open} setIsOpen={setOpen} onSucess={handleSubmitRating} />}
                    <Container className="max-w-7xl mx-auto mt-10 rounded-md shadow-lg">
                        <Container className="bg-secondary-500 text-white p-8 rounded border border-secondary-300">
                            <Container className="w-full flex justify-end">
                                {order?.completed && (
                                    <span className="bg-green-500 text-white font-bold p-2 w-auto rounded">
                                        Pedido Finalizado
                                    </span>
                                )}

                                {notAccepted &&
                                    <Button
                                        className="bg-yellow-500 text-black font-bold"
                                        type="button"
                                        onClick={handleAccept}
                                    >
                                        Atender Pedido
                                    </Button>
                                }
                            </Container>

                            <Container className="mt-4 flex items-center">
                                <Container className="m-4">
                                    <Image
                                        src={order.user.avatar}
                                        alt={`Avatar de ${order.user.name}`}
                                        className="rounded-full h-32 w-32 object-cover"
                                    />
                                </Container>
                                <span className="font-bold text-lg"> {order.user.name} </span>
                            </Container>

                            <h1 className="mt-4 text-2xl font-bold"> {order.title} </h1>

                            <Container className="mt-4 flex gap-x-4">
                                <TagItem text={getLanguageLabel(order.main_language)!} color="bg-primary-500" />
                                {order.tags.map(tag => (
                                    <TagItem text={getTagValue(tag)!} color="bg-primary-500" />
                                ))}
                                {order.languages.map(tag => (
                                    <TagItem text={getLanguageLabel(tag)!} color="bg-primary-500" />
                                ))}
                            </Container>

                            <p className="mt-8 text-lg max-w-4xl">
                                <ReactMarkdown children={order.description} skipHtml={false} remarkPlugins={[gfm]}/>
                            </p>

                            <Container className="my-8">
                                {order.files.length > 0 &&
                                    <>
                                    <h4 className="text-white font-bold uppercase">Arquivos</h4>
                                    <Container className="flex flex-wrap gap-4 pt-4">
                                        {order.files.map(file => (
                                            <a href={`http://localhost:3000/archives/${file}`} download={true} target="_blank" className="p-4 bg-purple-900 shadow-lg text-white font-bold overflow-hidden text-ellipsis rounded shadow-lg hover:text-black">
                                                {file}
                                            </a>
                                        ))}
                                    </Container>
                                    </>
                                }
                                
                            </Container>

                            
                        </Container>

                        <Container className="flex flex-col mt-10 gap-y-8">
                            {order.answers.map(answer => (
                                <Container className="bg-secondary-500 text-white p-8 rounded border border-secondary-300">
                                    <Container className="w-full flex justify-end">
                                            { order.canRateOrder &&
                                                <button
                                                    className="p-4 bg-primary-500 text-white font-bold overflow-hidden text-ellipsis rounded shadow-lg hover:text-black hover:border-primary-300"
                                                    onClick={ () => setOpen(true)}
                                                >Avaliar Projeto</button>
                                            }           
                                        </Container>
                                    <Container className="mt-4 flex items-center">
                                        <Container className="w-32 h-32 m-4">
                                            <Image
                                                src={answer.user.avatar}
                                                alt={`Avatar de ${answer.user.name}`}
                                                className="rounded-full h-full w-full object-cover"
                                            />
                                        </Container>
                                        <span className="font-bold text-lg"> {answer.user.name} </span>
                                    </Container>

                                    <p className="mt-8 text-lg max-.user.w-4xl">
                                        <ReactMarkdown children={answer.answer} remarkPlugins={[gfm]} />
                                    </p>

                                    <Container className="my-8">
                                        { answer.files.length > 0 &&(
                                            <>
                                            <h4 className="text-white font-bold uppercase">Arquivos</h4>
                                            <Container className="flex">
                                                {answer.files.map(file => (
                                                   <a href={`http://localhost:3000/archives/${file}`} download={true} target="_blank" className="p-4 bg-purple-900 shadow-lg text-white font-bold overflow-hidden text-ellipsis rounded shadow-lg hover:text-black">
                                                   {file}
                                                    </a>
                                                ))}
                                            </Container>
                                            </>
                                        )}
                                    </Container>
                                </Container>
                            ))}
                        </Container>

                    </Container>
                    { order && order.canAnswerOrder &&
                        <Container className="max-w-7xl mx-auto my-8">
                            <form onSubmit={handleSubmit(handleSubmitAnswer)}>
                                <MDEditor
                                    value={value}
                                    onChange={(value) => setValue(value as string)}
                                />

                                <input
                                    type="file"
                                    multiple={true}
                                    {...register('files')}
                                />
                                <Button
                                    type="submit"
                                    onClick={() => null}
                                >
                                    Enviar Resposta
                                </Button>
                            </form>
                        </Container>
                    }
                </>
            )}

        </Container>
    )
}