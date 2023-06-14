const { readAndAppend } = require("../../../services/file/fileService");
const { saveALog } = require("./logs.use.cases");
const LogsModelRepository = require("./model/logs.model.repository");
const Queue = require("bull");
const queue = new Queue('file-writing-queue');

exports.saveALogHandler = async (req, res) => {
    try{
        const body = req?.body

        queue.add({test:"passed", type:"normal"},{ removeOnComplete: true, removeOnFail: true });

        //const writeToAFile = await readAndAppend({data:{test:"passed"}})
        if(true){
            res.status(200).json( {status : true});
        }
        else{
            res.status(500).json( {status : false});
        }
        
    }
    catch(err){
      console.log(err)
    }
}