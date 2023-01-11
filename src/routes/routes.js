const express = require('express')
const router = express.Router()
const {createRecord, getByFilter, flagDelete, updateRecord} = require('../controllers/createController')
const {createTeacher, loginTeacher} = require('../controllers/teacherController')
const {authentication, authorization} = require('../middleware/middleware')

// router.get('/test-me', function(req,res){
//     return res.status(200).send("test is completed")
// })

/*------------------------student routes-----------------------*/
router.post('/create/:teacherId', authentication, authorization ,createRecord)
router.get('/getList',authentication ,getByFilter)
router.put('/updateRecord/:teacherId', authentication, authorization , updateRecord)
router.delete('/flagDelete/:teacherId', authentication, authorization ,  flagDelete)

/*------------------------teacher routes-----------------------*/
router.post("/createTeacherData", createTeacher)
router.get("/login", loginTeacher)

module.exports = router