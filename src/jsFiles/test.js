// this class  for testing will be removed later
const fetch = require("node-fetch");
const fetchUsers = async () => {

 let response = await fetch("http://localhost:3004/users/1")
 let data = await response.json()
 //console.log("data",data)

 return data;
  
};


console.log(Promise.resolve(fetchUsers()) )