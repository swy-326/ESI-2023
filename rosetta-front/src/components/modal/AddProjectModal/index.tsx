import { Dialog } from "@headlessui/react";
import { useForm } from "react-hook-form";
import { Button } from "../../common/button/Button";
import { Container } from "../../common/container/Container";
import { Input } from "../../common/input/Input";

export function AddProjectModal({ isOpen, setIsOpen, onSucess }){
    const { handleSubmit, register } = useForm();
    
    const addProject = async (data) => {

        console.log(data)
        const token = localStorage.getItem("token")
        
        const response = await fetch("http://localhost:3000/api/user/project/create", {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-type": "application/json"
            }
        })

        const created = await response.json()
        onSucess(created)
        setIsOpen(false)
    }

    return (
    <Container className="max-w-7xl mx-auto">
        <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="mx-auto max-w-sm rounded bg-secondary-500 p-8 text-white">
            <Dialog.Title className="text-3xl font-bold text-center uppercase mb-8">Adicionar Projeto</Dialog.Title>
            <Dialog.Description className="flex flex-col text-center items-center gap-4">
                Adicione links para o seu Portfolio
            </Dialog.Description>

            <Container>
                <form onSubmit={handleSubmit(addProject)}>
                    <Input
                        containerClassName="mt-4"
                        labelClassName="text-white font-bold"
                        labelText="Nome do Projeto"
                        id="title"
                        type="text"
                        {...register('title')}
                    />
                    <Input
                        containerClassName="mt-4"
                        labelText="URL do Projeto"
                        labelClassName="text-white font-bold"
                        id="title"
                        type="text"
                        {...register('url')}
                    />

                    <Button
                        fullWidth
                        className="mt-6 bg-primary-500 hover:bg-primary-800"
                        type="submit"
                        onClick={() => null}
                    > Adicionar</Button>
                </form>
                
            </Container>
          </Dialog.Panel>
        </div>
      </Dialog>
    </Container>
    )
}
