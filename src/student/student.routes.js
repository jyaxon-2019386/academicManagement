import express from 'express'
import { validateJwt, isAdmin}  from '../middlewares/validate-jwt.js';
import { login, register, test, assignCourse, get, update, deleteP} from './student.controller.js'

const api = express.Router()

api.get('/test', test)
api.post('/register', register)
api.post('/login', login)
api.post('/assignCourse/:id', [validateJwt], [isAdmin], assignCourse)
api.get('/get', get)
api.put('/update/:id', update)
api.delete('/delete/:id', deleteP)

export default api