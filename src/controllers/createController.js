const studentModel = require('../models/studentModel')

const createRecord = async function(req,res){
    try{
        /*--------------------------Receiving Data from request---------------------------*/
        const data = req.body 
        const rollNo = data.rollNo
        const studentName = data.name
        
        /*--------------------------checking request body is empty or not-----------------------*/
        if(Object.keys(data).length==0)return res.status(400).send({status:false, msg:"request body is empty"})
        
        /*--------------------------checking mandatory field present or not-----------------------*/
        if(!rollNo)return res.status(400).send({status:false, msg:"rollNo is required"})
        if(!studentName)return res.status(400).send({status:false, msg:"student name is required"})
        // console.log(data.subject.name)
        // console.log(data.subject.marks)
        if(!data.subject)return res.status(400).send({status:false, msg:"subject field is required"})
        if(!data.subject.name)return res.status(400).send({status:false, msg:"subject name is required"})
        if(data.subject.marks ==undefined || data.subject.marks<0)return res.status(400).send({status:false, msg:"subject marks is required"})
        
        
        const subjectName = data.subject.name
        const subjectMarks = data.subject.marks

        /*--------------------------checking student already present in DB or not-----------------------*/
        let findStudent = await studentModel.findOne({rollNo:rollNo, name:studentName})
    
        if(findStudent){
            /*------------------------checking subject already present in DB or not---------------------*/
            let subjectExists = await studentModel.findOne({rollNo:rollNo,subject:{$elemMatch:{name:subjectName}}})
            if(!subjectExists){
                /*------------------------pushing if subject is not present in DB---------------------*/
                let updateRecord = await studentModel.findOneAndUpdate(
                    {rollNo:rollNo},
                    {$push:{subject:{name:data.subject.name, marks:data.subject.marks}}},
                    {new:true}
                )
                return res.status(200).send({status:true, data:updateRecord})
            }else{
                /*------------------------updating if subject is present in DB---------------------*/
                let updateRecord = await studentModel.findOneAndUpdate(
                    {rollNo:rollNo,"subject.name":subjectName},
                    {$inc:{"subject.$.marks":subjectMarks}},
                    {new:true}
                    )
                return res.status(200).send({status:true, data:updateRecord})
            }
        }

        /*------------------------checking for duplicate rollNo---------------------*/
        let duplicateRollNo = await studentModel.findOne({rollNo:rollNo})
        if(duplicateRollNo)return res.status(400).send({status:false, msg:`${rollNo} rollNo is already exists`})

        /*------------------------creating a new student data---------------------*/
        const createData = await studentModel.create(data)

        return res.status(201).send({status:true, data:createData})
    }
    catch(err){
        return res.status(500).send({status:false, msg:err.message})
    }
}

const getByFilter = async function(req,res){
    try{

        const {name, subject} = req.query
        
        if(name && subject){
            let findData = await studentModel.find({name:name, subject:{$elemMatch:{name:subject}}})
            return res.status(200).send({status:true, data:findData}) 
        }
    
        if(subject){
            let findData = await studentModel.find({subject:{$elemMatch:{name:subject}}})
            return res.status(200).send({status:true, data:findData})    
        }
    
        let filterObj = {
            // isDeleted  : false
        }

        if(name){
            filterObj.name = name
        }

        const getList =  await studentModel.find(filterObj)

        return res.status(200).send({status:true, data:getList})
    }
    catch(err){
        return res.status(500).send({status:false, msg:err.message})
    }
}

const updateRecord = async function(req,res){
    try{

        let {name, subject, subjectMarks, rollNo} = req.body

        if(!rollNo)return res.status(400).send({status:false, msg:"rollNo is required to update data"})

        if(subject && name){
            if(!subjectMarks)return res.status(400).send({status:false, msg:"please provide subject marks to update"})
            let updateData = await studentModel.findOneAndUpdate(
                {rollNo:rollNo, "subject.name":subject},
                {$set:{"subject.$.marks":subjectMarks, name:name}},
                {new:true}
                )
            return res.status(200).send({status:true, data:updateData}) 
        }

        if(subject){
            if(!subjectMarks)return res.status(400).send({status:false, msg:"please provide subject marks to update"})
            let updateData = await studentModel.findOneAndUpdate(
                {rollNo:rollNo, "subject.name":subject},
                {"subject.$.marks":subjectMarks},
                {new:true}
                )
            return res.status(200).send({status:true, data:updateData}) 
        }
        
        if(name){
            let updateData = await studentModel.findOneAndUpdate(
                {rollNo:rollNo},
                {name:name},
                {new:true}
            )
            return res.status(200).send({status:true, data:updateData}) 
        }
    }
    catch(err){
        return res.status(500).send({status:false, msg:err.message})
    }
}

const flagDelete = async function(req,res){
    try{
        let {rollNo} = req.body

        let findRecord = await studentModel.findOne({rollNo:rollNo})
        if(!findRecord)return res.status(404).send({status:false, msg:`No record exists for ${rollNo} rollNo`})

        if(findRecord.isDeleted==true)return res.status(404).send({status:false, msg:`record is already deleted for ${rollNo} rollNo`})

        await studentModel.findOneAndUpdate({rollNo:rollNo},{isDeleted:true})
        return res.status(200).send({status:true, msg:"Deleted successfully"})
    }
    catch(err){
        return res.status(500).send({status:false, msg:err.message})
    }
}

module.exports = {createRecord, getByFilter, flagDelete, updateRecord}