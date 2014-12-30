var socket = io.connect();
var doc = $(document),
		win = $(window),
		canvas = $('#paper'),
		ctx = canvas[0].getContext('2d'),
		instructions = $('#instructions');
$(function(){
	var isMaster = sessionStorage.getItem('isMaster');
	
	$("#choicePicture").hide();


	if(isMaster == "false"){
		$("#admin").hide();
	}
	
	// This demo depends on the canvas element
	if(!('getContext' in document.createElement('canvas'))){
		alert('Sorry, it looks like your browser does not support canvas!');
		return false;
	}
	
		
	// Generate an unique ID
	var id = Math.round($.now()*Math.random());
	
	// A flag for drawing activity
	var drawing = false;

	var clients = {};
	var cursors = {};
	
	
	//if this master
	if(isMaster== "true"){

		$(window).on("unload", function(event) {
			socket.emit('exit');
		});
		

		$("#icon-refresh").click(function(){
			if(confirm("confirmer ?")){
				socket.emit('clear-canvas');
				window.location.reload();

			}
		});
		
		$("#icon-picture").click(function(){
			var w_add = window.open('add_image.html', 'add', 'height=200, width=400, left=10, top=10, resizable=no, scrollbars=no, toolbar=no, menubar=no, location=null, directories=no, status=yes');
			w_white.focus();
		});
		
	}
	 
	
	socket.on("image_canvas",function(file_path){
		drawimage(file_path)
	});
	socket.on('clear-canvas',function(){
		window.location.reload();

	});
	socket.on("demande_canvas",function(){
		socket.emit("canvas_master",{
		width : canvas[0].width,
		height : canvas[0].height,
		source : canvas[0].toDataURL()
		});
	});
	if(isMaster== "false"){
		socket.on("exit",function(){
			$("<h1 id='deco'>Déconnexion de l'animateur</h1>").insertBefore("canvas");

		});
		$(window).on("load",function(event){
			socket.emit("demande_canvas");
		});
		socket.on("canvas_master",function(data){
			//creation balise img OK
			var img=document.createElement("img");
			img.width=data.width;
			img.height=data.height;
			img.src=data.source;
			 img.onload = function(){
				ctx.drawImage(img,0,0);			
			}
			
		})
	}
	
	socket.on('moving', function (data) {
		
		if(! (data.id in clients)){
			// a new user has come online. create a cursor for them
			cursors[data.id] = $('<div class="cursor">').appendTo('#cursors');
		}
		
		// Move the mouse pointer
		cursors[data.id].css({
			'left' : data.x,
			'top' : data.y
		});
		
		// Is the user drawing?
		if(data.drawing && clients[data.id]){
			
			// Draw a line on the canvas. clients[data.id] holds
			// the previous position of this user's mouse pointer	
			drawLine(clients[data.id].x, clients[data.id].y, data.x, data.y);
		}
		
		// Saving the current client state
		clients[data.id] = data;
		clients[data.id].updated = $.now();	
	});

	var prev = {};
	canvas.on('mousedown',function(e){
	if(isMaster ==  'true'){
		e.preventDefault();
		drawing = true;
		prev.x = e.pageX;
		prev.y = e.pageY;
		
		// Hide the instructions
		instructions.fadeOut();
	}
	});
	
	doc.bind('mouseup mouseleave',function(){
		drawing = false;
	});

	var lastEmit = $.now();

	doc.on('mousemove',function(e){
	if(isMaster ==  'true'){
		if($.now() - lastEmit > 30){
			socket.emit('mousemove',{
				'x': e.pageX,
				'y': e.pageY,
				'drawing': drawing,
				'id': id
			});
			lastEmit = $.now();
		}
		
		// Draw a line for the current user's movement, as it is
		// not received in the socket.on('moving') event above
		
		if(drawing){
			drawLine(prev.x, prev.y, e.pageX, e.pageY);
			prev.x = e.pageX;
			prev.y = e.pageY;
		}
	}
	});

	// Remove inactive clients after 10 seconds of inactivity
	setInterval(function(){
		
		for(ident in clients){
			if($.now() - clients[ident].updated > 10000){
				
				// Last update was more than 10 seconds ago. 
				// This user has probably closed the page
				
				cursors[ident].remove();
				delete clients[ident];
				delete cursors[ident];
			}
		}
		
	},10000);

	function drawLine(fromx, fromy, tox, toy){
		ctx.moveTo(fromx, fromy);
		ctx.lineTo(tox, toy);
		ctx.stroke();
	}
	
	$("#icon-help ").click(function(){
		$("#instructions").show()
	});
	
	
	function alertClients(filePath, activeSlideIndex) {
		socket.broadcast.emit('updateSlide', filePath, activeSlideIndex);
	}
	

});
function alert_image(fileName){
			socket.emit("image_canvas",fileName);
}
	
function drawimage(fileName){
		ctx.clearRect(0, 0, canvas.width, canvas.height);	
		var img=document.createElement("img");
		img.src=fileName;

		img.onload = function(){
			ctx.drawImage(img,0,0,img.width,img.height,0,52,window.innerWidth,window.innerHeight);
		}
}