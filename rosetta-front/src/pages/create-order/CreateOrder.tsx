import { Button, Container, Topbar } from "../../components";
import { Input } from "../../components/common/input/Input";

import Select from 'react-tailwindcss-select'
import { useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import languages from '../../static/languages'
import tags from '../../static/tags'

type SelectOption = {
    value: string;
    label: string;
    disabled?: boolean;
}

export default function CreateOrder() {
    const navigator = useNavigate()
    const [selectedTags, setSelectedTags] = useState<SelectOption[]>([])
    const [selectedLanguages, setSelectedLanguages] = useState<SelectOption[]>([])
    const [selectedMainLanguage, setSelectedMainLanguage] = useState<SelectOption | null >(null)

    const { register, handleSubmit, watch } = useForm()

    const handleCreateOrder = async (data: FieldValues) => {
        const form = Object
            .entries(data)
            .reduce( (formData, [key, value]) => {
                if( key === "files" ){
                    for( const file of value) {
                        formData.append(key, file)
                    }
                }
                else {
                    formData.append(key, value)
                }
                return formData
        }, new FormData())


        form.append("main_language", selectedMainLanguage!.value)
        form.append("tags", selectedTags.map( tag => tag.value).join(","))
        form.append("languages", selectedLanguages.map( language => language.value).join(","))

        const token = localStorage.getItem("token")
        await fetch("http://localhost:3000/api/orders/create", {
            body: form,
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })

        navigator("/pedidos")
    }

    return (
        <Container>
            <Topbar />

            <Container className="max-w-7xl mx-auto py-10">
                <Container className="mb-10">
                    <h1 className="text-3xl mb-8 uppercase font-bold">Criar Pedido</h1>
                    <p className="text-lg max-w-2xl">
                        Descreva cuidadosamente o seu pedido, todas as caracterísitcas que julga necessário
                        para que os tradutores consigam realizar da maneira mais eficiente possível.
                    </p>
                </Container>

                <Container className="bg-secondary-500 py-10 px-6 rounded-xl flex flex-col gap-y-6">

                    <form onSubmit={handleSubmit(handleCreateOrder)}>
                        <Container>
                            <Input
                                id="name"
                                type="text"
                                labelText="Titulo do Pedido"
                                placeholder="qual seu pedido?"
                                containerClassName="w-1/2 mb-4"
                                labelClassName="text-white font-bold text-xl"
                                {...register('title')}
                            />
                        </Container>

                        <Container className="w-1/2 mb-4">
                            <h1 className="text-white font-bold text-xl">Tags</h1>
                            <Select
                                isMultiple={true}
                                value={selectedTags}
                                options={tags}
                                onChange={ (tags) => setSelectedTags(tags as SelectOption[]) }
                            />
                        </Container>

                        <Container className="w-full grid grid-cols-2 gap-x-6 mb-4">
                            <Container>
                                <h1 className="text-white font-bold text-xl">Língua Original</h1>
                                <Select
                                    isMultiple={false}
                                    value={selectedMainLanguage}
                                    options={languages}
                                    onChange={(language) => setSelectedMainLanguage(language as SelectOption)}
                                />
                            </Container>

                            <Container>
                                <h1 className="text-white font-bold text-xl">Língua a Traduzir</h1>
                                <Select
                                    isMultiple={true}
                                    value={selectedLanguages}
                                    options={languages}
                                    onChange={(languages) => setSelectedLanguages(languages as SelectOption[])}
                                />
                            </Container>

                        </Container>

                        <Container>
                            <h1 className="text-white font-bold text-xl">Descrição</h1>
                            <textarea
                                className="text-white first-letter:block w-1/2 h-80 pb-10 border-2 rounded border-white focus:border-white resize-none bg-transparent mb-8"
                                {...register('description')}
                            />
                        </Container>


                        <Container>
                            <h1 className="text-white font-bold text-xl">Arquivo</h1>
                            <input
                                className={`
                                    block w-full mb-8 text-sm text-white
                                    file:mr-4 file:py-2 file:px-4
                                    file:rounded-full file:border-0
                                    file:text-sm file:font-semibold
                                    file:bg-primary-500 file:text-white
                                    hover:file:bg-primary-700
                                `}
                                type="file"
                                multiple={true}
                                {...register('files')}
                            />
                        </Container>

                        <Container>
                            <h1 className="text-white font-bold text-xl">Preço</h1>
                            <input
                                className="w-64  h-2 bg-primary-500 rounded-lg appearance-none cursor-pointer"
                                type="range"
                                min={0}
                                max={100}
                                {...register('price')}
                            />
                            <p className="text-white font-lg">R$ {watch('price')}</p>
                        </Container>
                        <Button
                            type="submit"
                            onClick={() => null}
                            className="mt-10 ml-auto bg-accent-800"
                        >
                            Submter
                        </Button>
                    </form>

                </Container>


            </Container>

        </Container>
    )
}