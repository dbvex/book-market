import axios from 'axios'

export const http = axios.create({
  baseURL: 'https://www.googleapis.com/books/v1/',
  headers: {
    'Content-type': 'application/json'
  },
  params: {
    key: import.meta.env.VITE_GOOGLE_BOOKS_API_KEY
  }
})
