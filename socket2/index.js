const io = require('socket.io')(8080, {
    cors :{
        origin: "http://localhost:3000"
    }
})
// Define a Queue class
class Queue {
    constructor() {
        this.elements = []; // Initialize an empty array to store elements
    }

    // Method to add an element to the end of the queue
    enqueue(element) {
        this.elements.push(element);
    }

    // Method to remove and return the first element from the queue
    dequeue() {
        if (this.isEmpty()) {
            return "Queue is empty";
        }
        return this.elements.shift();
    }

    // Method to check if the queue is empty
    isEmpty() {
        return this.elements.length === 0;
    }

    // Method to get the size of the queue
    size() {
        return this.elements.length;
    }

    // Method to view the first element in the queue without removing it
    peek() {
        if (this.isEmpty()) {
            return "Queue is empty";
        }
        return this.elements[0];
    }

    // Method to clear the queue
    clear() {
        this.elements = [];
    }
    removeByFrom(fromValue) {
        this.elements = this.elements.filter(element => element.from !== fromValue);
    }


    // Method to print the queue
    print() {
        console.log(this.elements);
    }
}

const Mqueue = new Queue();
const Fqueue = new Queue();


function waitForQueues(callback) {
    if (!Fqueue.isEmpty() || !Mqueue.isEmpty()) {
        callback();
    } else {
        setTimeout(() => waitForQueues(callback), 1000); // Check every second for queues to be non-empty
    }
}

io.on("connection", (socket) => {

    socket.emit("me", socket.id)
    socket.on('disconnect', ()=>{
        console.log(socket.id)
        Mqueue.removeByFrom(socket.id)
        Fqueue.removeByFrom(socket.id)
        socket.broadcast.emit("callended")
    })
    socket.on("callUser", ({ signalData, from, userData}) =>  {
        if(userData.gender=='Male'){
            Mqueue.enqueue({from,userData,signalData})
        }else{
            Fqueue.enqueue({from,userData,signalData})
            console.log(Fqueue.peek().from)
        }
        

        waitForQueues(() => {
            // Emit callUser event if either queue is non-empt
            if (!Fqueue.isEmpty() && !Mqueue.isEmpty()) {
                console.log(Fqueue.peek().from,Mqueue.peek().from)
              io.to(Fqueue.peek().from).emit("callUser",{signalData:Mqueue.peek().signalData, from:Mqueue.peek().from, userData:Mqueue.peek().userData})
            }
        });

        
    })

    socket.on("answerCall", (data) => {
        Mqueue.dequeue()
        Fqueue.dequeue()
        io.to(data.to).emit("callAccepted", data)
    })

    socket.on("remove",(data)=>{
        console.log(data)
        if(data.gender=="Male"){
            Mqueue.removeByFrom(data.id)
        }else{
            console.log(Fqueue.peek().from)
            Fqueue.removeByFrom(data.id)
            console.log(Fqueue.peek().from)
        }
    })

})