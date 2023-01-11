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

module.exports = {createRecord}