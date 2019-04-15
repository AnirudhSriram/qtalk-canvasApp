var socket = io();
socket.emit('new user');

var movement = {
    xPoints: [],
    yPoints: [],
    dragging: [],
    paint: false,
    mode: 1
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
        if (movement.mode === 2) {
            movement.xPoints = [];
            movement.yPoints = [];
        }

    })

    $("#canvas").mousemove((e) => {
        if (movement.paint) {
            movement.xPoints.push(e.clientX);
            movement.yPoints.push(e.clientY);
            movement.dragging.push(true);

        }
    })

    $("#canvas").mouseleave((e) => {
        movement.paint = false;

    })

    socket.on('data', (users) => {
        var canvas = document.getElementById('canvas');
        context = canvas.getContext("2d");
        context.clearRect(0, 0, 500, 500);
        context.strokeStyle = "blue";
        context.lineJoin = "round";
        context.lineWidth = 5;

        for (var person in users) {
            var user = users[person];
            if (user.mode === 1) {
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
            } else {
                context.clearRect(0,0,500,500);
                context.rect(user.xPoints[0], user.yPoints[0], user.xPoints[user.xPoints.length - 1], user.yPoints[user.yPoints.length - 1]);
                context.stroke();
            }

        }

    })

    $("#rectangle").click((e) => {
        movement.mode = 2;
        movement.xPoints = [];
        movement.yPoints = [];
        movement.dragging = [];
        movement.paint = false;
    });

    $("#line").click((e) => {
        movement.mode = 1;
        movement.xPoints = [];
        movement.yPoints = [];
        movement.dragging = [];
        movement.paint = false;
    });

}
setInterval(function () { socket.emit('movement', movement) }, 1000 / 60);