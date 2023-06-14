const express = require("express");
const app = express();
const cors = require("cors");
const morgan = require("morgan")

const Queue = require("bull");
const queue = new Queue('logs-queue');

require("dotenv").config();

app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));
app.use(cors());
app.use(morgan(':status :method :url :response-time :req[body]'))

const logsRoutes  = require('./user/logs/logs.route');
const { connectToDatabase } = require("../services/database/database.connection");
const { readAndGetArray, readAndAppend } = require("../services/file/fileService");
const LogsModelRepository = require("./user/logs/model/logs.model.repository");
const { saveALog } = require("./user/logs/logs.use.cases");

connectToDatabase();

app.use('/api', logsRoutes);

app.listen(process.env.PORT, () =>
    console.log(`Server started on ${process.env.PORT}`)
  );

  setInterval(async () => {
    const queuedJobs = await queue.getJobs(["waiting", "delayed"]);
    console.log(queuedJobs.length,"que length")
    let newJobs = await readAndGetArray();
    console.log(newJobs.length,"current array")
    newJobs.map(async (data)=>{
      await queue.add(data,{ removeOnComplete: true, removeOnFail: true },);
    })
  }, 10000);

  queue.process(async (job, done) => {
    try{
      console.log(job.data);
      const logsRepositoryStorage = new LogsModelRepository();
      const savedALog = await saveALog(logsRepositoryStorage, job.data)
      done();
    }
    catch(err){
      console.log(err,"error")
    }
  });

  const fileQueue = new Queue('file-writing-queue');
  fileQueue.process(async (job, done) => {
    try{
      console.log(job.data);
      if(job.data.type == "normal"){
        const writeToAFile = await readAndAppend({data:job.data})
      }
      done();
    }
    catch(err){
      console.log(err,"error")
    }
  });