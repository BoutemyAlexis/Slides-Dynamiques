/* Globals variables 
 * Each user uses https for all communication with the server, and vice-versa
 * Therefore, we have authentication, confidentiality and integrity on all messages
*/
var master = false,
    identifiant,
    password,
    socket = io.connect(),//(getURLConnectionForHTTPS(), { secure: true }),
    slideControlContainer,
    containers,
    currentSlide = 0,
    videos,
    token,
    tab_windows_opened = [],    // This tab contains all pseudos of all opened windows
    messages_history = [],      // This tab contains history of all opened windows
    presentationsList = [];     // This tab contains all presentation already upload on the server

$(document).ready(function () {
    "use strict";
    setMaster(sessionStorage.getItem('isMaster'));
    identifiant = sessionStorage.getItem('identifiant');
    $("#menu-pseudo").append(identifiant + "  <span style=\"color:#787777;\" class=\"caret\"></span>");

    /**
     * Open the socket with the token built by login process
     */
    token = sessionStorage.getItem('token');
    socket.emit('ouvertureSession', JSON.stringify({
        token: token,
        identifiant: identifiant
    }));
    
    /**
     * This event allow users (master or salves) to properly disconnect from the server.
     * After that, the user is redirected on log in page.
     */
    $("#deconnexion").click(function() {
        socket.disconnect();
        sessionStorage.setItem('token', '');
        document.location.href = "/login.html";
    });
        
	// Event that check if we are really loading an html presentation
    $("#img-select").click(function () {
        $("#hiddenfile").click();
        $("#hiddenfile").change(function () {
            if ($("#hiddenfile").val().split('.').reverse()[0] === "html") {
                $("#selected-Slide").val($("#hiddenfile").val());
            }
        });
    });

    $("#become-animator").click(function() {
        socket.emit('new_message_PersonalChat', JSON.stringify({
          emetteur: identifiant,
          destinataire: 'root',
          contenu: '/msg would like animator'
        }));
    });
	
		 
    /**
     * This event allows animator to run another presentation as he wants
     * A button on the top left-hand corner has been specially placed. 
     */
    $("#bouton-selectPPT").click(function () {
        setPresentationsList();
        var w = window.open('upload.html', 'popUpWindow', 'height=200, width=400, left=10, top=10, resizable=no, scrollbars=yes, toolbar=no, menubar=no, location=no, directories=no, status=yes');
        w.focus();
    });

    /**
     * 
     *
     */
    $("#remote-control").click(function () {
        //var w = window.open('control.html', 'popUpWindow', 'height=325, width=325, left=10, top=10, resizable=no, scrollbars=no, toolbar=no, menubar=no, location=no, directories=no, status=yes');
        var w_remote = window.open('qrcodeWindow.html', 'remote', 'height=230, width=230, left=10, top=10, resizable=no, scrollbars=no, toolbar=no, menubar=no, location=null, directories=no, status=yes');
        w_remote.focus();
    });
	
	 /**
     * This event allows animator to run white screen
     * A button on the top left-hand corner has been specially placed. 
     */
	$("#white-screen").click(function () {
		var isMaster = sessionStorage.getItem('isMaster');
		
			var w_white = window.open('canvas.html', 'white', 'height=500, width=500, left=10, top=10, resizable=no, scrollbars=no, toolbar=no, menubar=no, location=null, directories=no, status=yes');
			w_white.focus();
		if(isMaster == "true"){
         socket.emit('activeWhiteScreen');
		}
        
    });
	socket.on('activeWhiteScreen',function(){
		var isMaster = sessionStorage.getItem('isMaster');
		if(isMaster != "true"){
			var w_white = window.open('canvas.html', 'white', 'height=500, width=500, left=10, top=10, resizable=no, scrollbars=no, toolbar=no, menubar=no, location=null, directories=no, status=yes');
			w_white.focus();
		}
	});
	//recup du socket
	socket.on('active-link',function(href){
		var w = window.open(href,"lien");
	});
    /**
     * Management of received messages and DOM insertion, modification, deletion
     *    --> if '.client' parameter : client's number and connected pannel users
     *    --> if '.newMessage' parameter : retrieve some messages from broadcast discussion
     *    --> if '.videoState' parameter : video management in order to adjust videos (move forward, move back, pause, play)
     *    --> if '.messageContent' parameter : messages retrieve from broadcast (we have both sender and content liked to it)
     *    --> if '.connexion' : warns all users (master and slaves) that a new slave has come around
     *    --> if '.dexonnexion' : warns all users (master and slaves) that one slave left
     */
    socket.on('message', function (message) {
        var newMessage = jQuery.parseJSON(message);
       
        if (newMessage.clients) {
            document.getElementById("cadre-menu-droite").innerHTML = "<h2>Utilisateurs :</h2>";
            for (var i=0; i < newMessage.users.length; i++) {
                if(newMessage.users[i] != identifiant) {    
                    document.getElementById("cadre-menu-droite").innerHTML += "<p class='users col-md-12' onclick='lancerChat(this);'>" + newMessage.users[i] + "</p>";
                }
            } 
        }

        if (newMessage.messageContent) {
          $("#message ul").append("<li style='font-weight:bold;'>" + newMessage.messageSender + " : " + newMessage.messageContent + "</li>");
          $("#message").scrollTop(100000);

            // Panel notification (blinking red)
            if ($("#cadre-menu").css("margin-Left") === "0px") {
                var nbNewMessage;
                if ($('#bouton-menu').html()) {
                    nbNewMessage = parseInt($('#bouton-menu b').html()) + 1;
                } else {
                    nbNewMessage = 1;
                }
                $('#bouton-menu').html("(<b>" + nbNewMessage + "</b>)");
            }

        } else {
            var ma_liste = "";
            var i;

            for (i = 0; i < newMessage.users.length; i += 1) {
                ma_liste += "<li>" + newMessage.users[i] + "</li>";
            }
            
            $('#cadre-user ul').html(ma_liste);         // Update pseudos list
            $('#clients').text(newMessage.clients-1);   // Display the number of other connected users

            if (newMessage.connexion) {
                $("#message ul").append("<li><font color='green'>(" + newMessage.connexion + ") s'est connect&#233;</font> </li>");
                var timeLoad = 200;

                setTimeout(function() {
                    $("#div_connection").hide();
                    $("#overlay").hide();
                }, timeLoad);
            }
            
            if (newMessage.messageSender) {
                $("#message ul").append("<li><font color='green'>(" + newMessage.messageSender + ") s'est connect&#233;</font> </li>");
            }
            
            if (newMessage.deconnexion) {
                $("#message ul").append("<li><font color='red'>(" + newMessage.deconnexion + ") s'est d&#233connect&#233;</font> </li>");
            }
        }
    });

   /**
    * Slaves receive current slide 'id' from master's computer.
    * Then we simulate 'click' event on slaves computers.
    */
    socket.on('click', function (eltId) {
        $($('#notre_frame').contents()).find(eltId)[0].click();
    });
     
    socket.on('activeSlide', function(activeSlideId) {
        if (activeSlideId !== null) {
            if (typeof slideControlContainer === 'undefined') {
                containers = $($('#notre_frame').contents())[0].getTimeContainersByTagName("*");
                slideControlContainer =  containers[containers.length-1];
            }
            slideControlContainer.selectIndex(activeSlideId);
        }
    });

    socket.on('activeSlide_request', function() {
        if (typeof slideControlContainer !== 'undefined') {
            socket.emit('activeSlide', slideControlContainer.currentIndex);
        }
    });

    socket.on('videoStates', function(data) {
        videos = JSON.parse(data).videosStates;
        videosStates(videos);
    });

    // Functions that are presents below allow to retrieve events on master computer and then sends informations to slaves computer.
    socket.on('updateSlide', function(filePath, activeSlideIndex) {
        updateSlide(filePath, activeSlideIndex);
    });
    
    /**
     * Test if the personal chat window liked to the recipient receive message is open or not.
     * If not, we underline the name on the connected user panel in order to warn it that one user want to contact him/her
     */ 
    socket.on('test_presence', function(infos) {
        var obj = JSON.parse(infos);
         
        messages_history[obj.emetteur] = "<p class='msg-bubble destinataire'>" + obj.contenu + "</p>";
        
        if(document.getElementById('cadre-menu-droite').style.display == 'none' || 
           document.getElementById('cadre-menu-droite').style.display == ''
           ) {
            
            document.getElementById('notification_personalChat').innerHTML = 'Nouveau message';
        }
        
        for (var i=0; i <tab_windows_opened.length; i++) {
            if (tab_windows_opened[i] === obj.emetteur) {
                return;
            }
        }
        
        // The pseudo window is closed client side, we underline it with orange colour.
        var tab_p = document.getElementsByClassName('users');
        for (var i=0; i < tab_p.length; i++) {
            if (tab_p[i].innerHTML === obj.emetteur) {
                tab_p[i].classList.remove("no-new-message");
                tab_p[i].classList.add("new-message");
            }
        }
    });
    
    // Update the table that contains all opened windows in order to both - notify client and - keep the table updated
    socket.on('MAJ_tab_windows_opened', function(infos) {
        var obj = JSON.parse(infos);
        
        for (var i in tab_windows_opened) {
            if (tab_windows_opened[i] === obj.destinataire) {
                delete tab_windows_opened[i];
            }
        }
    });

    socket.on('allPresentationsList_response', function (data) {
        var files = jQuery.parseJSON(data).files;
        presentationsList = [];
        for (var i = 0; i < files.length; i++) {
            presentationsList.push(files[i]);
        }
    });
    
    socket.on('setMaster', function(isMaster) {
        setMaster(isMaster);
    });
    
    /**
     * Functions that are presents below allow to retrieve events on master computer and then sends informations to slaves
     * computer.
     */

	
	 
    //  Going to the next slide
    $("#next1").click(function () {
        if (typeof slideControlContainer === 'undefined') {
            containers = $($('#notre_frame').contents())[0].getTimeContainersByTagName("*");
            slideControlContainer =  containers[containers.length-1];
        }
        if (master == 'true') {
            pauseAllVideos(); //Pause playing videos when changing slide
            $($('#notre_frame').contents()).find("#next").click();
            socket.emit('SlideChanged', slideControlContainer.currentIndex);           
        }
    });
    
	//  Going on the previous slide
    $("#prev1").click(function () {
        if (typeof slideControlContainer === 'undefined') {
            containers = $($('#notre_frame').contents())[0].getTimeContainersByTagName("*");
            slideControlContainer =  containers[containers.length-1];
        }
        if (master == 'true') {
            pauseAllVideos();
            $($('#notre_frame').contents()).find("#prev").click();
            socket.emit('SlideChanged', slideControlContainer.currentIndex);
        }
    });

	//  Going at the beginning of this presentation
    $("#first1").click(function () {
        if (typeof slideControlContainer === 'undefined') {
            containers = $($('#notre_frame').contents())[0].getTimeContainersByTagName("*");
            slideControlContainer =  containers[containers.length-1];
        }
        if (master == 'true') {
            pauseAllVideos();
            $($('#notre_frame').contents()).find("#first").click();
            socket.emit('SlideChanged', slideControlContainer.currentIndex);
        }
    });

	//  Going at the end of this presentation
    $("#last1").click(function () {
        if (typeof slideControlContainer === 'undefined') {
            containers = $($('#notre_frame').contents())[0].getTimeContainersByTagName("*");
            slideControlContainer =  containers[containers.length-1];
        }
        if (master == 'true') {
            pauseAllVideos();
            $($('#notre_frame').contents()).find("#last").click();
            socket.emit('SlideChanged', slideControlContainer.currentIndex);
        }
    });

    // import session 
    $("#import_session").click(function () {
        $($('#notre_frame').contents()).find("#session_import").click();
        $('#session_status').text('Loaded');
    });

    // play session
    $("#play_session").click(function () {
        window["notre_frame"].playSession();
        $('#session_status').text('Playing');
    });

    // pause session
    $("#pause_session").click(function () {
        window["notre_frame"].pauseSession();
        $('#session_status').text('Paused');
    });

    // stop session
    $("#stop_session").click(function () {
        window["notre_frame"].stopSession();
        $('#session_status').text('Stopped');
    });

    // record session
    $("#record_session").click(function () {
        $($('#notre_frame').contents()).find("#session_rec").click();
        $('#session_status').text('Recording');
    });

    // export session
    $("#export_session").click(function () {
        $($('#notre_frame').contents()).find("#session_export").click();
    });

    $("#panelUsers").click(function(){
        
        affichePanelUsers();
        var nbDestinatairesOrange = 0;
        var tab_p = document.getElementsByClassName('users');
        
        for (var i=0; i < tab_p.length; i++) {      
                if(tab_p[i].classList.contains("new-message")) {
                    nbDestinatairesOrange++;
                }
        }
        
        if(nbDestinatairesOrange == 0) {
            document.getElementById('notification_personalChat').innerHTML = '';
        }
        
    });
    
    iFrameLoaded("notre_frame",'');
});

// Load a new presentation selected by the animator
function updateSlide(filePath, activeSlideIndex) { 
    iFrameLoaded("notre_frame", filePath);
    console.log('loading ' + filePath);
    currentSlide = activeSlideIndex;
}

/**
 * Function that create a new frame to begin communication
 *   -> Create a new frame names PersonalChat.html
 *   -> Set it many attributes (identifier, recipient, socket, last message history)
 *   -> Check if the frame is opened after notification (then pseudo color is orange) or not and then do some actions to update
 */
function lancerChat(pseudo) {
    var myWindow = window.open("PersonalChat.html", pseudo.innerHTML, "width=430, height=400");
    myWindow.identifiant = identifiant;
    myWindow.destinataire = pseudo.innerHTML;
    myWindow.socket = socket;
    myWindow.historique = '';
    
    tab_windows_opened.push(myWindow.destinataire);  

    var tab_p = document.getElementsByClassName('users');
    for (var i=0; i < tab_p.length; i++) {
        if (tab_p[i].innerHTML == myWindow.destinataire && tab_p[i].classList.contains("new-message")) {
            tab_p[i].classList.remove("new-message");
            tab_p[i].classList.add("no-new-message");
            myWindow.historique = messages_history[myWindow.destinataire];
        }
    }
}


function getCurrentSlideId() {
    return $($('#notre_frame').contents()).find('#slideshow [smil=active]').attr("id");
}

var getSelector = function (elt) {
    if (elt.attr('id')) {
        return '#' + elt.attr('id');
    }
    
    var selector = elt.parents()
                    .map(function() { return this.tagName; })
                    .get().reverse().join(" ");

    if (selector) { 
      selector += " " + elt[0].nodeName;
    }

    var id = elt.attr("id");
    if (id) {
      selector += "#" + id;
    }

    var classNames = elt.attr("class");
    if (classNames) {
      selector += "." + $.trim(classNames).replace(/\s/gi, ".");
    }

    return selector;
}

function pauseAllVideos() {
    var videos = $($('#notre_frame').contents()).find('#' + getCurrentSlideId() + ' video');
    videos.each(function() {
        $(this)[0].pause();
    });
}

function setPresentationsList() {
    socket.emit('allPresentationsList_request');
}

function getPresentationsList() {
    return presentationsList;
}

function alert_server(filePath, activeSlideIndex) {
    socket.emit('updateSlide', filePath, activeSlideIndex);
}

//returns the active slide
function activeSlide () {
    return $($('#notre_frame').contents()).find('#slideshow [smil=active]').attr("id");
}

// Allow to set a new master if he's not and the contrary delete master privilege if he's not.
function setMaster(isMaster) {
    "use strict";
    if (isMaster == 'true') {
        $("#become-animator").hide();
        $("#menu-control").show();
        $("#bouton-selectPPT").show();
        $("#remote-control").show();
		$("#white-screen").show();
    } else {
        $("#become-animator").show();
        $("#menu-control").hide();
        $("#bouton-selectPPT").hide();
        $("#remote-control").hide();
		$("#white-screen").show();
    }
    master = isMaster;
    sessionStorage.setItem('isMaster', master);
    initVideo();
}

// Use to choose a new presentation
function getPresentationsList() {
    return presentationsList;
}


function iFrameLoaded(id, src) {
    var deferred = $.Deferred(),
    iframe = $("#"+id);
    iframe.load(deferred.resolve);
    iframe = iframe.attr("src", src);
    deferred.done(function() {
        setIFrameEvents();
    });

    return deferred.promise();
}

function setIFrameEvents() {
    $($('#notre_frame').contents()).find('#navigation_par').hide();
		
	/*ouverture d'un lien*/
	 iframe = $($("#notre_frame").contents());
	 iframe.find("a").each(function(a){
		
		$(this).click(function(event){
			var w = window.open(this.href,"lien");
			socket.emit('active-link',this.href);
		});
	 });
    if ($.isFunction($($('#notre_frame').contents())[0].getTimeContainersByTagName)) {
        containers = $($('#notre_frame').contents())[0].getTimeContainersByTagName("*");
        slideControlContainer =  containers[containers.length-1];
        if (typeof slideControlContainer !== 'undefined') {
            slideControlContainer.selectIndex(currentSlide);
        }
    }
    if (master == 'true') {
        $($('#notre_frame').contents()).find('#slideshow div, a.linkitem, li.elsommaire, li.elsommaire2, span.spanli, #liste_sections').click( function(event) {
        event.stopPropagation();
            if (event.target.nodeName !== "VIDEO") {
                console.log("click on: " + getSelector($(this)));
                socket.emit('click', getSelector($(this)));
            }
        });
		
		$($('#notre_frame').contents()).on('keydown', function (e){
		if (master == 'true') {
			// right arrow
			if(e.keyCode == 39) {
				pauseAllVideos(); //Pause playing videos when changing slide
				if(typeof slideControlContainer !== 'undefined'){
					socket.emit('SlideChanged', slideControlContainer.currentIndex);
				}else{
					socket.emit('next');
				}
			}
			// left arrow
			if(e.keyCode == 37){
				pauseAllVideos();
				if(typeof slideControlContainer !== 'undefined'){
					socket.emit('SlideChanged', slideControlContainer.currentIndex);
				}else{
					socket.emit('prev');
				}
			}
		}
	});
	
    }
    if ($($('#notre_frame').contents()).find('video').length > 0) {
        initVideo();
        if (master == 'false') {
            socket.emit('videoStates_request');
            socket.emit('activeSlide_request');
        }
    }
}


// This function is used to slide up and slide down connected users for personal chat
function affichePanelUsers() {
    $('#cadre-menu-droite').slideToggle("slow");       
}

// This function is used to retrieve url information in order to connect with a remote server using https
function getURLConnectionForHTTPS() {
    var url = '' + window.location;
    var ipAddress = url.split('/l');
    var nouvelleURL = ipAddress[0];
    
    return nouvelleURL;
}