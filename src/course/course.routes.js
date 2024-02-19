import express from 'express'
import { saveCourse } from '../course/course.controller.js'

const api = express.Router()

api.post('/saveCourse', saveCourse)

export default api