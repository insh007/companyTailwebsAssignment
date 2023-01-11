const express = require('express')
const router = express.Router()
const {createRecord} = require('../controllers/createController')
const {createTeacher, loginTeacher} = require('../controllers/teacherController')

// router.get('/test-me', function(req,res){
//     return res.status(200).send("test is completed")
// })

router.post('/create', createRecord)




router.post("/createTeacherData", createTeacher)
router.get("/login", loginTeacher)

module.exports = router