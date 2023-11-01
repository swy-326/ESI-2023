import { Dialog } from "@headlessui/react";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../context/UserContext";
import { Button } from "../../common/button/Button";
import { Container } from "../../common/container/Container";

export function UploadImageModal({
  isOpen, setIsOpen, onSucess
}) {

  const token = localStorage.getItem("token")
  const { avatar, setAvatar } = useContext(UserContext)
  const [preview, setPreview] = useState("")
  const [file, setFile] = useState<File | null>(null)

  useEffect(() => {
    if (!file) return;
    const image = URL.createObjectURL(file)
    setPreview(image)
  }, [file])

  const handleUpload = async () => {
    const form = new FormData()
    form.append("avatar", file!)
    
    const response = await fetch("http://localhost:3000/api/user/bla", {
      method: "POST",
      body: form,
      headers: {
        "Authorization": `Bearer ${token}`
      }
    })
    const { avatar } = await response.json()

    setAvatar(avatar)
    onSucess(avatar)
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
            <Dialog.Title className="text-3xl font-bold text-center uppercase mb-8">Fazer Upload</Dialog.Title>
            <Dialog.Description className="flex flex-col items-center gap-4">
              Faça upload da sua foto de perfil
            </Dialog.Description>

            {preview && <img src={preview} className="w-32 h-32 rounded-full object-cover mx-auto mt-4 " />}
            {!preview && <div className="w-32 h-32 rounded-full mx-auto mt-4 bg-white border border-black" />}

            <input
              className={`
                    mt-8 block w-full mb-8 text-sm text-white
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-primary-500 file:text-white
                    hover:file:bg-primary-700
                `}
              type="file"
              multiple={false}
              onChange={(event) => setFile(event?.target?.files[0])}
            />
            <Button fullWidth onClick={handleUpload} className="bg-primary-500 hover:bg-primary-800 focus:border-white font-bold text-xl"> Enviar</Button>
          </Dialog.Panel>
        </div>
      </Dialog>
    </Container>)
}
