const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const db =  require("./db");
const api =  require("./api");
const PORT = process.env.PORT || 3500;

app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const appInit = status => {
  console.log(status)

  if(status){
      app.listen(PORT, () => {
          console.log(`Server running at http://localhost:${PORT}`);
        });
  
      app.use('/api',api)
      app.get('/test',(req,res)=>{
          res.send("Test")
      })
  }
}

db.init(appInit);
  
process.on('uncaughtException', function(err) {
  console.log(" UNCAUGHT EXCEPTION ");
  console.log(err.message);
});
