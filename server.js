const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const http = require('http').Server(app)
const io = require('socket.io')(http)
const mongoose = require('mongoose')

app.use(express.static(__dirname))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

const dbUrl = 'mongodb+srv://user01:user@cluster0.uu68g.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
const Message = mongoose.model('Message', {name: String, message: String})

let messages = []

try {
    mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true }, ()=>{
        console.log('mongo db connected')
    })
}
catch(e) {
    console.log('could not connect to mongodb')
}

app.get('/messages', (req, res)=>{
    res.send(messages)

    // Message.find({}, (err, messages)=>{
    //     res.send(messages)
    // })
})

app.post('/messages', (req, res)=>{
    const message = new Message(req.body)
    message.save().then((result)=>{
        messages.push(req.body)
        io.emit('messageFromServer', req.body)
        res.sendStatus(200)
    }).catch((err)=>{
        res.sendStatus(500)
        console.log('my error ', err)
    })
})

io.on('connection', (socket)=>{
    console.log('a user connected');
})




const server = http.listen(3000, ()=>{
    console.log('server is listening on port ', server.address().port)
})