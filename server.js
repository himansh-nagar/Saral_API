const express = require("express");
const app = express();
const fs = require('fs');
const PORT = 8000;

app.use(express.json());
app.use(express.text());

const data = fs.readFileSync('availableCourses.json');
const jsonData =  JSON.parse(data);


//  Endpoints


// console.log(jsonData);

// Home Route
app.get("/",(req,res) =>{
    let courses_list = [];
    for(courses_dict of jsonData){
        
        courses_list.push({
            id:courses_dict.id,
            name: courses_dict.name,
            description:courses_dict.description
        })
    }
    res.json(courses_list);
})

//  courses route

app.get("/course/id=:id",(req,res)=>{
    const courseId = req.params.id;
    let courseList = []
    const courses_dict = jsonData[courseId-1]
        for (course of courses_dict.submission) {
         if (course.id == courseId){
             courseList.push({
                 id:course.id,
                 courseid:course.courseid,
                 name:course.name
             })
         } 
        }
    
    res.send(courseList)
} )

// for getting comments by id and courseId

app.get("/course/id=:id/courseId=:courseId/comments",(req,res)=>{
    const Id = req.params.id;
    const courseId = req.params.courseId;
    const courses_dict = jsonData[Id-1];
    const courseSubmissionList = courses_dict.submission[courseId-1].usersummision
    res.send(courseSubmissionList);
} )

// for adding new course

app.post("/addCourse",(req,res)=>{
    let name = req.body.name;
    let description = req.body.description;
    let submission = req.body.submission;
    const data = {
        id:jsonData.length+1,
        name,
        description,
        submission
    }
    jsonData.push(data)
    res.send(data)
} )

//  for adding new submission in particular course

app.post("/course/id=:id/Submission",(req,res)=>{
    const submissionDict = jsonData[req.params.id-1].submission ;
   const id = req.params.id;
    const courseId = jsonData[req.params.id-1].submission.length+1;
    const name = req.body.name;
    const description = req.body.description;
    const usersummision = req.body.usersummision;
    const data = {
        id,
        courseId,
        name,
        description,
        usersummision
    }
    let submission = jsonData[req.params.id-1].submission
    submission.push(data)
    res.send(submission)

} )


//  Post request for addind usersubmissions
app.post("/course/id=:id/courseId=:courseId/usersummision",(req,res)=>{
    const submissionDict = jsonData[req.params.id-1].submission ;
   const id = req.params.id;
    const courseId = req.params.courseId;
    const username = req.body.username;
    const usersubmissions = req.body.usersubmissions;
    let usersubmissionsList = []
    let usersummision = jsonData[req.params.id-1].submission[courseId-1].usersummision
    // console.log(usersummision);
    // res.send(usersummision)
    let userPresent = false;
    for (userDict of usersummision) {
        if (userDict.username == req.body.username){
            userDict.usersubmissions.push(req.body.usersubmissions)
            userPresent=true
            console.log(userDict);
            res.send("User already exits soo, it's updated")
        }
    }
    if(!userPresent){
        usersubmissionsList.push(usersubmissions)
        const data ={
            id,
            courseId,
            username,
            usersubmissionsList
        }
        usersummision.push(data)
        console.log(data);
        res.send(data)
    }

} )




app.listen(PORT,()=>{
    console.log(`you server is running at ${PORT}`);
})
