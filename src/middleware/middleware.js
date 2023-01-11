require('dotenv').config()
const jwt = require('jsonwebtoken')
const { isValidObjectId } = require('mongoose')
const teacherModel = require('../models/teacherModel')

const authentication = async function(req,res,next){
    try{
        const token = req.headers["authorization"]
        if(!token)return res.status(400).send({status:false, message:"Bearer Token must be present in header"})
    
        let fetchToken = token.split(" ")[1]
    
        jwt.verify(fetchToken, process.env.SECRET_KEY, function(err, tokenVerify){
            if(err){
                return res.status(401).send({status:false, message:"unauthentication access, reason: token may be invalid or expired"})
            }else{
                req.tokenVerify = tokenVerify
                return next()
            }
        })
        
    }
    catch(err){
        return res.status(500).send({status:false, message:err.message})
    }
}

const authorization = async function(req,res,next){
    try{
        let userId = req.params.userId

        if(!(isValidObjectId(userId)))return res.status(404).send({status:false, msg:`Invalid mongodb Id- ${userId}`})
    
        const findTeacher = await teacherModel.findOne({_id:userId})
        if(!findTeacher)return res.status(404).send({status:false, msg:`teacher is not registered in DB i.e., ${userId} is not present in DB` })
    
        //authorization
        if(findTeacher._id != req.tokenVerify.userId)return res.status(403).send({status:false, mesage:"unauthorized access"})
    
        return next()
    }
    catch(err){
        return res.status(500).send({status:false, message:err.message})
    }
}

module.exports = {authentication,authorization}