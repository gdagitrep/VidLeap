  var leapy=new Leap.Controller({enableGestures: true, downtime: 1000});
  var x;
  var vTolerance=80;
var div = document.createElement("div");
div.style.position ="fixed";
div.style.float = "right";
div.style.right="0px";
div.style.bottom="30px";
div.style.background = "rgba(0,0,0,0.8)";
div.style.color = "white";
div.style.display = "none";
div.style.zIndex="2";
div.style.textAlign="center";
div.style.lineHeight = "40px";
div.style.fontSize = "28px";
div.style.padding = "20px";
div.innerHTML="";


document.body.appendChild(div);
  leapy.on('connect',function(){
    console.log('leapmotion connected!');
  });
  leapy.on('deviceConnected', function() {
    console.log("deviceConnected");
});

leapy.on('deviceDisconnected', function() {
    console.log("deviceDisconnected");
});
  leapy.connect();
  function clicked(text){
    div.innerHTML= text;
    div.style.display="block";
    setTimeout(function() {div.style.display="none";}, 2000);
  }
  leapy.on('frame', function(frame){
    for( var i =  0; i < frame.gestures.length; i++){
        var gesture  = frame.gestures[0];
        var type = gesture.type;
        console.log(type);
        switch( type ){
            case "screenTap":
                if ( gesture.state == "stop"){
                    if(x=== undefined)
                        x=document.getElementsByTagName("video")[0];
                  if(x.paused){
                        x.play();clicked("Playing");
                  }
                    else{
                        x.pause();clicked("Paused");
                    }
                    break;
                }
            case "circle":
                if(x=== undefined)
                    x=document.getElementsByTagName("video")[0];
                if(gesture.state == "stop"){
                    var clockwise = false;
                    var pointableID = gesture.pointableIds[0];
                    var direction = frame.pointable(pointableID).direction;
                    if(direction !== undefined){
                        var dotProduct = Leap.vec3.dot(direction, gesture.normal);
                        if (dotProduct  >  0) {
                            clockwise = true;
                            x.currentTime+=10;
                        
                        }
                        else{
                            x.currentTime-=10;
                        
                        }
                        clicked(Math.round(x.currentTime/60.1)+":"+Math.round(x.currentTime%60)+"/"+Math.round(x.duration/60.1)+":"+Math.round(x.duration%60));
                    }
                }
                break;
            case  "swipe":
                if(x=== undefined)
                    x=document.getElementsByTagName("video")[0];
                //if(gesture.state == "start")

                if(gesture.state == "stop"){
                    var tt=gesture.position[1]- gesture.startPosition[1];
                    console.log(tt);

                    if(Math.abs(tt)> 40){
                        if(gesture.direction[1]>0){
                            if(x.volume<0.9)
                             x.volume+=0.1;
                            else
                                x.volume=1;}
                        else{
                            if(x.volume>0.1)
                                x.volume-=0.1;
                            else
                                x.volume=0;
                        }
                        clicked("Volume\n"+Math.round(100*x.volume)+"/100");
                    }
                }
                    break;
            default:
                //console.log('something else');
                //console.log(gesture.direction)
                break;
            }
        }
        //if(frame.hands.length >= 1 &&Math.abs(frame.translation(start_frame)[1]) > vTolerance && start_flag === 1){
});
