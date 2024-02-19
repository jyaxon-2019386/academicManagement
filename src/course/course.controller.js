'use strict'  

import Course from '../course/course.model.js'
import { encrypt, checkPassword, checkUpdate} from '../utils/validator.js' 
import { generateJwt } from '../utils/jwt.js'

export const saveCourse = async(req, res)=>{
    try{
        let data = req.body
        // data.role = 'TEACHER_ROLE'
        let course = new Course(data)
        await course.save()
        return res.send({message: `Registered successfully, can be logged with ${course.name}`})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error registering course!', err: err})
    }
}

export const managementCourse = async(req, res) => {
    try{
        
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error', err: err})
    }
}

