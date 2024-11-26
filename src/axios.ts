import axios from "axios";

export const backendUrl = axios.create({
    baseURL: "https://trello.vimlc.uz/"
})