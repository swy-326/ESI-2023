import { createContext, useEffect, useState } from "react";
import HttpClient from "../services/http/api";

type UserContext = {
    avatar: string;
    setAvatar: any;
}

export const UserContext = createContext({} as UserContext)

const UserContextProvider = (props) => {
    
    const [ avatar, setAvatar ] = useState("")

    useEffect( () => {
        async function fetchProfile(){
            const response = await HttpClient.profile();
            const { avatar } = await response.json()

            setAvatar(avatar)
        }

        fetchProfile()
    })

    return (
        <UserContext.Provider value={ { avatar, setAvatar } }>
            {props.children}
        </UserContext.Provider>
    )

}

export default UserContextProvider