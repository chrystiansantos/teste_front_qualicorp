import axios from 'axios'


export const api = axios.create({
  baseURL: 'https://apisimulador.qualicorp.com.br/'
})