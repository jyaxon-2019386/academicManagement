import mongoose from "mongoose"

const teacherSchema = mongoose.Schema({
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
        unique: true,
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
        enum: ['TEACHER_ROLE', 'STUDENT_ROLE'],
        required: true
    }
}, {
    versionKey: false 
}
)


export default mongoose.model('teacher', teacherSchema)