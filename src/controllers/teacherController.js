require('dotenv').config()
const teacherModel = require('../models/teacherModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {isValidEmail, isValidPassword} = require('../validation/validation')

const createTeacher = async function(req,res){
    try{
        const {email,password} = req.body
    
        /*--------------------------checking mandatory field present or not-----------------------*/
        if(!email)return res.status(400).send({status:false, msg:"email is required"})
        if(!password)return res.status(400).send({status:false, msg:"password is required"})

        /*--------------------------performing regex validation-----------------------*/
        if(!(isValidEmail(email)))return res.status(400).send({ status: "false", message: "email format is invalid" });
        if(!(isValidPassword(password)))return res.status(400).send({ status: "false", message: "password must be 8 to 15 characters in length with atleast one special character,Number and Alphabate" });
          
        let hashPassword = await bcrypt.hash(password,10)
        req.body.password = hashPassword
    
        const createData = await teacherModel.create(req.body)
        return res.status(201).send({status:true, data:createData})
    }
    catch(err){
        return res.status(500).send({status:false, msg:err.message})
    }
}

const loginTeacher = async function(req,res){
    const {email,password} = req.body

    /*--------------------------checking mandatory field present or not-----------------------*/
    if(!email)return res.status(400).send({status:false, msg:"email is required"})
    if(!password)return res.status(400).send({status:false, msg:"password is required"})

    /*--------------------------performing regex validation-----------------------*/
    if(!(isValidEmail(email)))return res.status(400).send({ status: "false", message: "email format is invalid" });
    if(!(isValidPassword(password)))return res.status(400).send({ status: "false", message: "password must be 8 to 15 characters in length with atleast one special character,Number and Alphabate" });

    let findTeacher = await teacherModel.findOne({email:email})
    if(!findTeacher)return res.status(404).send({status:false, msg:"email is not exists in DB means you are not registerd"})

    let hashPassword = findTeacher.password
    bcrypt.compare(password, hashPassword, function(err, result){
        if(result){
            let token = jwt.sign({userId:findTeacher._id}, process.env.SECRET_KEY, {expiresIn:'24hr'})
            res.setHeader('x-api-token', token)
            return res.status(200).send({ status: true, message: "Login Successfull", data: token })
        } else {
            return res.status(400).send({ status: true, message: "Invalid Password" })
    
        }
    })
}

module.exports = {createTeacher, loginTeacher}