import express from 'express'
import { login, register, test, get, saveCourse, update, deleteC } from './teacher.controller.js'

const api = express.Router()

api.get('/test', test)
api.post('/register', register)
api.post('/saveCourse', saveCourse)
api.post('/login', login)
api.get('/get', get)
api.put('/update/:id', update)
api.delete('/delete/:id', deleteC)

export default api