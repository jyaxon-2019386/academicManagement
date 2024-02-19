import { Schema, model } from 'mongoose';

const studentSchema = Schema({
    name: {
        type: String,
        required: true
    },
    surname: {
        type: String,
        required: true
    },
    username: {
        type: String,
        unique: false, // Quitamos la restricción de unicidad en el campo username
        lowercase: true,
        required: true
    },
    password: {
        type: String,
        minLength: [8, 'Password must be 8 characters'],
        required: true
    },
    email: {
        type: String,
        required: true
    }, 
    role: {
        type: String,
        uppercase: true,
        required: true,
        enum: ['TEACHER_ROLE', 'STUDENT_ROLE'],
    },
},{
    versionKey: false 
}

)

export default model('Student', studentSchema);
