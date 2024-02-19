'use strict'

import jwt from 'jsonwebtoken'
import Student from '../student/student.model.js'
import Teacher from '../teacher/teacher.model.js'

export const validateJwt = async(req, res, next)=>{
    try{
        //Obtener la llave de acceso al token
        let secretKey = process.env.SECRET_KEY
        //obtener el token de los headers
        let { token } = req.headers
        //Verificar si viene el token
        if(!token) return res.status(401).send({message: 'Unauthorized'})
        //Obtener el uid del usuario que envió el token
        let { uid } = jwt.verify(token, secretKey)
        //Validar si aún existe en la BD
        let student = await Student.findOne({_id: uid})
        if(!student) return res.status(404).send({message: 'student not found - Unauthorized'})
        req.student = student
        next()
    }catch(err){
        console.error(err)
        return res.status(401).send({message: 'Invalid token'})
    }
}

export const isAdmin = async(req, res, next)=>{
    try{
        let { student } = req
        if(!student || student.role !== 'STUDENT_ROLE') return res.status(403).send({message: `You dont have access | username: ${student.username}`})
        next()
    }catch(err){
        console.error(err)
        return res.status(403).send({message: 'Unauthorized role'})
    }
}

export const validateJwtTeacher = async(req, res, next)=>{
    try{
        let secretKey = process.env.SECRET_KEY
        let { token } = req.headers
        if(!token) return res.status(401).send({message: 'Unauthorized'})
        let { uid } = jwt.verify(token, secretKey)
        let teacher = await Teacher.findOne({_id: uid})
        if(!teacher) return res.status(404).send({message: 'teacher not found - Unauthorized'})
        req.teacher = teacher
        next()
    }catch(err){
        console.error(err)
        return res.status(401).send({message: 'Invalid token'})
    }
}

export const isAdminTeacher = async(req, res, next)=>{
    try{
        let { teacher } = req
        if(!teacher || teacher.role !== 'TEACHER_ROLE') return res.status(403).send({message: `You dont have access | username: ${teacher.username}`})
        next()
    }catch(err){
        console.error(err)
        return res.status(403).send({message: 'Unauthorized role'})
    }
}