import express from "express"

const app = express()
const port = 3000
app.use("/",(req,res)=>{
  res.json({message:"Server is Running "});
});
app.listen(3000,()=>{
  console.log(`server running on http://localhost:${port}`)
})