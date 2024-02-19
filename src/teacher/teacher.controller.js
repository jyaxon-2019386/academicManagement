'use strict'

import Teacher from './teacher.model.js'
import Course from '../course/course.model.js'
import Student from '../student/student.model.js'
import { encrypt, checkPassword, checkUpdate} from '../utils/validator.js' 
import { generateJwt } from '../utils/jwt.js'
import { jwtDecode } from 'jwt-decode'

export const test = (req, res) => {
    console.log('test is running')
    return res.send({message: 'Test is running'})
}

export const register = async(req, res)=>{
    try{
        let data = req.body
        data.password = await encrypt(data.password)
        data.role = 'TEACHER_ROLE'
        let teacher = new Teacher(data)
        await teacher.save()
        return res.send({message: `Registered successfully, can be logged with ${teacher.username}`})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error registering teacher!', err: err})
    }
}

export const login = async(req, res) =>{
    try{
        let { username, password } = req.body
        let teacher = await Teacher.findOne({username}) 
        if(teacher && checkPassword(password, teacher.password)){
            let loggedTeacher = {
                uid: teacher._id,
                username: teacher.username,
                name: teacher.name,
                role: teacher.role
            }
            // Generar el token
            let token = await generateJwt(loggedTeacher)
            // Respode el usuario 
            return res.send({
                message: `Welcome, ${loggedTeacher.name}`, 
                token,
                loggedTeacher
            })   
        }
        return res.status(404).send({message: 'Invalid credentials'})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error to login'})
    }
}

// Save a course
export const saveCourse = async(req, res)=>{
    try{
        let data = req.body
        let token = jwtDecode(req.headers.authorization)
        data.idTeacher = token.uid
        let course = new Course(data)
        await course.save()
        return res.send({message: `Registered successfully ${course.name}!`})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error registering course!', err: err})
    }
}

// Get courses for teacher
export const get = async (req, res) => {
    try {
        let course = await Course.find()
        return res.send({ course })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error getting courses' })
    }
}

// Update a course
export const update = async (req, res) => {
    try {
        //Capturar la data
        let data = req.body
        let token = jwtDecode(req.headers.authorization)
        let { id } = req.params
        //Validar que vengan datos
        let update = checkUpdate(data, false)
        if (!update) return res.status(400).send({ message: 'Have submitted some data that cannot be updated or missing data' })
        //Actualizar
    let updatedCourse = await Course.findOneAndUpdate(
        {_id: id},
        data,
        {new: true}
        )
        //Validar la actualización
        if(!updatedCourse) return res.status(404).send({message: 'Course not found and not updated'})
        //Responder si todo sale bien
        return res.send({message: 'Course updated successfully!', updatedCourse})
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error updating course!' })
    }
}

// Delete a course
export const deleteC = async(req, res)=>{
    try{
        let { id } = req.params
        //Eliminar
        let deletedCourse = await Course.deleteOne({_id: id})
        //Validar que se eliminó
        if(deletedCourse.deletedCount === 0) return res.status(404).send({message: 'Course not found and not deleted'})
        //Responder
        return res.send({message: 'Deleted course successfully'})
    }catch(err){
        console.error(err)
        return res.status(404).send({message: 'Error deleting course!'})
    }
}
