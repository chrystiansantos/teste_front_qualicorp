import axios from 'axios'

export const apiStateCity = axios.create({
  baseURL: 'https://countriesnow.space/api/v0.1/'
})