const { readAndAppend } = require("../../../services/file/fileService");
const { saveALog } = require("./logs.use.cases");
const LogsModelRepository = require("./model/logs.model.repository");

exports.saveALogHandler = async (req, res) => {
    try{
        const body = req.body
        const logsRepositoryStorage = new LogsModelRepository();
        const addedToQueue = await readAndAppend({data:req.body})
        console.log(addedToQueue,"dd")
        const savedALog = await saveALog(logsRepositoryStorage, body)
        if(savedALog){
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