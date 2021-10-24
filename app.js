$(()=>{
    const socket = io();
    const responsesContainer = $('#responses');

    function addMessage (resp) {
        responsesContainer.append(`<h3>${resp.name}</h3><p>${resp.message}</p>`)
    }

    function getMessages () {
        $.get('http://localhost:3000/messages', (responses)=>{
            responses.forEach(response=>addMessage(response))
        })
    }

    function sendMessage (message) {
        $.post('http://localhost:3000/messages', message)
    }

    $('#send').click(()=>{
        sendMessage({'name': $('#name').val(), 'message': $('#message').val()});
    })

    getMessages()

    socket.on('messageFromServer', addMessage)
    
})