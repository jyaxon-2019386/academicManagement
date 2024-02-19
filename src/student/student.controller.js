'use strict'

import Student from './student.model.js'
import Course from '../course/course.model.js'
import { jwtDecode } from 'jwt-decode'
import { encrypt, checkPassword, checkUpdate} from '../utils/validator.js' 
import { generateJwt } from '../utils/jwt.js'

export const test = (req, res) => {
    console.log('test is running')
    return res.send({message: 'Test is running'})
}

export const register = async(req, res)=>{
    try{
        let data = req.body
        data.password = await encrypt(data.password)
        data.courses = []; // Inicializar courses como un arreglo vacío
        data.role = 'STUDENT_ROLE'
        let student = new Student(data)
        await student.save()
        return res.send({message: `Registered successfully, can be logged with ${student.username}`})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error registering student!', err: err})
    }
}

export const login = async(req, res) =>{
    try{
        let { username, password } = req.body
        let student = await Student.findOne({username}) 
        if(student && checkPassword(password, student.password)){
            let loggedStudent = {
                uid: student._id,
                username: student.username,
                name: student.name,
                role: student.role
            }
            // Generar el token
            let token = await generateJwt(loggedStudent)
            // Respode el usuario 
            return res.send({
                message: `Welcome, ${loggedStudent.name}`, 
                token,
                loggedStudent
            })   
        }
        return res.status(404).send({message: 'Invalid credentials'})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error to login'})
    }
}

// Get courses for student
export const get = async (req, res) => {
    try {
        let course = await Course.find()
        return res.send({ course })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error getting courses' })
    }
}

export const assignCourse = async (req, res) => {
    try {
        // Extraer el token? del estudiante y del curso del cuerpo de la solicitud
        let {data, courseId } = req.body;
        let idStudent = jwtDecode(req.headers.authorization)
        data = idStudent.uid        
        // Verificar si el estudiante existe
        let student = await Student.find(data);
        console.log(student)
        if (!student) {
            return res.status(404).json({ message: 'Estudiante no encontrado' });
        }
        if (!student.courses || student.courses.length >= 3) {
            return res.status(400).send({ message: 'El estudiante ya está asignado al máximo de cursos permitidos' });
        }

        // Verificar si el estudiante ya está asignado a este curso
        if (student.courses.some(course => course.equals(courseId))) {
            return res.status(400).send({ message: 'El estudiante ya está asignado a este curso' });
        }

        // Asignar curso al estudiante
        student.courses.push(courseId);
        await student.save();
        
        return res.send({ message: 'Curso asignado correctamente' });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: 'Error interno del servidor' });
    }
};

 
// Update a profile
export const update = async (req, res) => {
    try {
        //Capturar la data
        let data = req.body
        let { id } = req.params
        //Validar que vengan datos
        let update = checkUpdate(data, false)
        if (!update) return res.status(400).send({ message: 'Have submitted some data that cannot be updated or missing data' })
        //Actualizar
    let updatedProfile = await Student.findOneAndUpdate(
        {_id: id},
        data,
        {new: true}
        )
        //Validar la actualización
        if(!updatedProfile) return res.status(404).send({message: 'Course not found and not updated'})
        //Responder si todo sale bien
        return res.send({message: 'Profile updated successfully!', updatedProfile})
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error updating profile!' })
    } 
}

//Delete profile
export const deleteP = async(req, res)=>{
    try{
        let { id } = req.params
        //Eliminar
        let deletedProfile = await Student.deleteOne({_id: id})
        //Validar que se eliminó
        if(deletedProfile.deletedCount === 0) return res.status(404).send({message: 'profile not found and not deleted'})
        //Responder
        return res.send({message: 'Deleted profile successfully'})
    }catch(err){
        console.error(err)
        return res.status(404).send({message: 'Error deleting profile'})
    }
}


