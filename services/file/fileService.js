var fs = require('fs').promises;

exports.readAndAppend = async ({data:oldData}) => {
   const data = await fs.readFile('queue/queue.json', 'utf8');

 console.log(data)
   let obj = JSON.parse(data); //now it an object
    obj.table.push(oldData); //add some data
   let json = JSON.stringify(obj); //convert it back to json
   const dataWritten = await fs.writeFile('queue/queue.json', json, 'utf8');
   return true
}