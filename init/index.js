const mongoose=require("mongoose");
const data=require("./data.js");
const Listing=require("../models/listing.js");


const Mongo_Url="mongodb://127.0.0.1:27017/wanderlust";
main()
.then(()=>{
    console.log("connected to Db");
})
.catch((err)=>{
console.log(err);
});
async function main(){
    await mongoose.connect(Mongo_Url);
};

const initDb=async()=>{
await Listing.deleteMany({});
console.log(data);
 const newData=data.map((obj)=>({
...obj,owner:"69e31533c3b2fa5226cb861f",
}));
await Listing.insertMany(newData);
console.log("Data was initialized");

};
console.log(data);
console.log("Type:", typeof data);
console.log("Is Array:", Array.isArray(data));
initDb();