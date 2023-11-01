export default class HttpClient {

    private static BASE_URI = 'http://localhost:3000/api'

    private static getBearerToken(){
        return localStorage.getItem("token")
    }

    public static async profile(){
        const token = this.getBearerToken()
        return await fetch(`${HttpClient.BASE_URI}/user/profile`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
    }

    public static async findUser(id?: string){
        if(id === undefined) return this.profile();

        const token = this.getBearerToken();
        const response = await fetch(`${HttpClient.BASE_URI}/user/${id}`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })

        return response
    }

    public static async createUser(user : object){
        const request = await fetch(`${HttpClient.BASE_URI}/users/create`, {
            body: JSON.stringify(user),
            headers: {
                "Content-Type": "application/json"
            }
        })

        return request;
    }

    public static async fetchOrder(id){
        const token = HttpClient.getBearerToken()
        const response = await fetch(`${HttpClient.BASE_URI}/orders/${id}`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
        
        return response
    }

    public static async fetchOrders(query = ""){
        const filters = query ? `?${query}` : ""
        const response = await fetch(`${HttpClient.BASE_URI}/orders${filters}`)
        
        return response
    }

    public static async createOrder(order : object | FormData ){
        const content = (order instanceof FormData)
            ? { body: order, headers: { "Content-Type": "multipart/form-data" }}
            : { body: JSON.stringify(order), headers: { "Content-Type": "application/json"}}

        const response = await fetch(`${HttpClient}/orders/create`, content)

        return response

    }

}