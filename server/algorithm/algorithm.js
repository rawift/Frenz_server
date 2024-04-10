const cron = require('node-cron');
const Chat = require("../models/chatSchema")
const User = require("../models/userSchema")
const Message = require("../models/messageSchema");
const Num = require("../models/numSchema")
const maxRetries = 5;
let rotateBy = 3;

async function deleteAllMessages() {
    try {
      const result = await Message.deleteMany({});
      console.log('Deleted', result.deletedCount, 'Message');
      return true; // Deletion successful
    } catch (error) {
      console.error('Error deleting documents:', error);
      return false; // Deletion failed
    }
  }

  
async function deleteAllChats() {
    try {
      const result = await Chat.deleteMany({});
      console.log('Deleted', result.deletedCount, 'Chat');
      return true; // Deletion successful
    } catch (error) {
      console.error('Error deleting documents:', error);
      return false; // Deletion failed
    }
  }

  async function rotateArray(arr) {
  
    const n = arr.length;
    console.log(rotateBy)
    // Perform rotation using Array slicing and concatenation
    const rotatedArray = arr.slice(rotateBy % n).concat(arr.slice(0, rotateBy % n));
    rotateBy+=3
    return rotatedArray;
  }

  /*async function getNum(){
    try {
      const num = await Num.find()
      if(num.length==0){
        const newNum = new Num({num:3})
        const result = await newNum.save()
        rotateBy=result.num
      }else{
        rotateBy=num[0].num
        console.log("num",num[0]._id.toString(), num)
        const updateNum = await User.findByIdAndUpdate(num[0]._id.toString(),{num:num[0].num+3}, {
          new: true, // To return the updated document
        })
        console.log(updateNum)
      }  
      
    } catch (error) {
      console.log("rotating num relate")
    }
  }*/
  

// Function to be executed
exports.myTask = async () => {
  console.log('Task executed at');
  try {
    let success = false;
    let retries = 0;
  
    while (!success && retries < maxRetries) {
      success = await deleteAllMessages();
      if (!success) {
        console.log('Retrying...');
        retries++;
      }
    }
    success=false
    while (!success && retries < maxRetries) {
        success = await deleteAllChats();
        if (!success) {
          console.log('Retrying...');
          retries++;
        }
      }

    const male = await User.find({gender:"Male"})
    const female = await User.find({gender:"Female"})

   
  
 rotateArray(male)
.then(async data => {
  const rotatedArray = data
  
  let sfac=0, efac=3
  for(let i=0; i<female.length; i+=2){
      let j=sfac;
      while(j<efac && j<rotatedArray.length){
          const newChat = new Chat({
              members:[rotatedArray[j]._id.toString(), female[i]._id.toString()]
          })
      
          const result = await newChat.save()
          j++

      }
      j=sfac;
      if(i+1>=female.length) break
      while(j<efac && j<rotatedArray.length){
          const newChat = new Chat({
              members:[rotatedArray[j]._id.toString(), female[i+1]._id.toString()]
          })
      
          const result = await newChat.save()
          j++
      }
      sfac+=3
      efac+=3
  }

  console.log("successfully created by algorithm")
  const newNum = new Num({num:rotateBy})
  const result = await newNum.save()

 
})
.catch(error => {
  // Handle error here
  console.error(error);
});


} catch (error) {
  console.log(error)
}
};

// Schedule the task to run at 9 AM every day


// Keep the script running
setInterval(() => {
  console.log('Script is still running...',rotateBy);
}, 60000); // Print message every minute to keep the script alive
