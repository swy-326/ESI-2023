import { Button, Container, Topbar } from "../../components";
import Select from 'react-tailwindcss-select'
import OrderItem from "../../components/common/OrderItem/OrderItem";
import { useEffect, useState } from "react";
import HttpClient from "../../services/http/api";
import { Option } from "react-tailwindcss-select/dist/components/type";
import { Link } from "react-router-dom";

import Loader from 'react-spinners/ClipLoader'


type OrderResponse = {
    id: string;
    internal_id: number,
    title: string;
    price: number;
    description: string;
    main_language: string;
    tags: string[],
    languages: string[];
    files: string[];
    created_at: Date;
    user: {
        avatar: string;
    }
}

export default function Orders({}){
    const [ isLoading, setIsLoading ] = useState(false)
    const [ orders, setOrders ] = useState<OrderResponse[]>([])
    const [ selectedTags, setSelectedTags ] = useState<Option[] | null >(null)
    const [ selectedLanguages, setSelectedLanguages ] = useState<Option[] | null >(null)
    const [ selectedPrice, setSelectedPrice ] = useState<number > (0)

    useEffect( () => {
        const fetchOrders = async () => {
            const raw = await HttpClient.fetchOrders()
            const orders = await raw.json()
            setOrders(orders)
        }

        fetchOrders()
    }, [])

    const wait = (value) => {
        return new Promise( (resolve) => setTimeout(resolve, value))
    }

    const fetchFilter = async () => {
        setIsLoading(true)
        const qTags = selectedTags?.map( tag => `tags=${tag.value}` ) ?? ""
        const qLanguages = selectedLanguages?.map( languages => `languages=${languages.value}`) ?? ""
        const qPrice = `price=${selectedPrice}`

        const queryFields = [...qTags, ...qLanguages].join("&")

        console.log({
            qTags,
            qPrice,
            qLanguages
        })
        const query = queryFields ? `${queryFields}&${qPrice}` : qPrice;

        const response = await HttpClient.fetchOrders(query)
        const orders = await response.json()
        await wait(1000)
        console.log("Aqui")
        setIsLoading(false)

        setOrders(orders)
    }

    const state = {
        selectedTags: [],
        selectedLanguage: [],
        selectedPrice: 0
    }

    const tags = [
        { value: "WORK_PROJECT", label: "Trabalho"},
        { value: "VIDEO", label: "Video"},
        { value: "BOOK", label: "Livro"},
        { value: "WORK_PROJECT", label: "Trabalho"},
    ]

    const languages = [
        { value: "ENGLISH", label: "Inglẽs"},
        { value: "SPAIN", label: "Espanhol"},
        { value: "PORTUGUESE", label: "Português"},
        { value: "GERMAN", label: "Alemão"},
        { value: "CHINESE", label: "Chinẽs"},
        { value: "KOREAN", label: "Coreano"},
    ]

    return (
        <Container>
            <Topbar />

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

            <Container className="bg-secondary-500 text-white mt-10 py-8">
                <Container className="max-w-7xl mx-auto"> 
                    <h1 className="max-w-xl font-bold uppercase text-4xl mb-8"> Filtrar <br/> Pedidos </h1>
                
                    <Container className="flex gap-8">

                        <Container>
                            <h2 className="font-bold text-white">Tema</h2>
                            <Select
                                onChange={ (tags) => setSelectedTags(tags as Option[])}
                                options={tags}
                                value={selectedTags}
                                isMultiple={true}
                            />
                        </Container>


                        <Container>
                            <h2 className="font-bold text-white">Linguagens</h2>
                            <Select
                                onChange={ (languages) => setSelectedLanguages(languages as Option[])}
                                options={languages}
                                value={selectedLanguages}
                                isMultiple={true}
                            />
                        </Container>

                        <Container>
                            <h2 className="font-bold text-white">Preço</h2>
                            <input
                                value={selectedPrice}
                                min={0}
                                type="range"
                                className="w-64  h-2 bg-primary-500 rounded-lg appearance-none cursor-pointer"
                                onChange={ (event) => setSelectedPrice(event.target.valueAsNumber)}
                            />
                            <p> R$: {selectedPrice}</p>
                        </Container>


                    </Container>
                    <Button onClick={fetchFilter} className="bg-primary-500 mt-8 w-[300px]"> Filtrar </Button> 
                </Container>
            </Container>


            <Container className="max-w-7xl mx-auto mt-10 flex flex-col gap-8">
                {orders.map( (order, index) => (
                    <Link to={`/pedidos/${order.id}`} key={index}>
                        <OrderItem
                        key={index}
                        image_url={order.user.avatar}
                        main_language={order.main_language}
                        languages={order.languages}
                        tags={order.tags}
                        title={order.title}
                        username="user"
                    />
                    </Link>
                    
                ))}
            </Container>

        </Container>
    )
}