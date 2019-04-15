var socket = io();
socket.emit('new user');

var movement = {
    xPoints: [],
    yPoints: [],
    dragging: [],
    paint: false
}
function draw() {
    $("#canvas").mousedown((e) => {
        console.log(e);
        movement.xPoints.push(e.clientX);
        movement.yPoints.push(e.clientY);
        movement.paint = true;
        movement.dragging.push(false);
        
    });

    $("#canvas").mouseup((e) => {
        movement.paint = false;
        
    })

    $("#canvas").mousemove((e) => {
        if (movement.paint) {
            movement.xPoints.push(e.clientX);
            movement.yPoints.push(e.clientY);
            movement.dragging.push(true);
            
        }
    })

       $("#canvas").mouseleave((e)=>{
           movement.paint = false ;
           
       })

       socket.on('data',(users)=>{
        var canvas = document.getElementById('canvas');
        context = canvas.getContext("2d");
        context.clearRect(0, 0, 500, 500);
        context.strokeStyle = "blue";
            context.lineJoin = "round";
            context.lineWidth = 5;
        for(var person in users){
            var user = users[person] ;
            for (var i = 0; i < user.xPoints.length; i++) {
                context.beginPath();
                if (user.dragging[i] && i) {
                    context.moveTo(user.xPoints[i - 1], user.yPoints[i - 1]);
                } else {
                    context.moveTo(user.xPoints[i] - 1, user.yPoints[i]);
                }
                context.lineTo(user.xPoints[i], user.yPoints[i]);
                context.closePath();
                context.stroke();
            }
        }

       })



}
setInterval(function(){socket.emit('movement',movement)},1000/60);