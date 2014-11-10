var messageHandler;

if (typeof jQuery === 'undefined') jQuery = {};

// detect HTML5 slideshow type, set message handler
if      (typeof jQuery.deck !== 'undefined')        messageHandler = updateDeckJS;
else if (typeof Reveal !== 'undefined')             messageHandler = updateReveal;
else if (typeof impress !== 'undefined')            messageHandler = updateImpress;
else if (typeof jQuery.jmpress !== 'undefined')     messageHandler = updateJmpress;
else if (typeof jQuery.scrolldeck !== 'undefined')  messageHandler = updateScrollDeck;
else if (typeof Flowtime !== 'undefined')  			messageHandler = updateFlowtime;
else    messageHandler = updateGeneric;

// separated in case we want to differentiate in the future
function updateDeckJS(message) {
    console.log('updateDeckJS '+message);
    var e = jQuery.Event('keydown');
    e.which = parseInt(message,10);
    $(document).trigger(e);
}
function updateReveal(message) {
    console.log('updateReveal '+message);
    if      (message === '37')      Reveal.navigateLeft();
    else if (message === '38')      Reveal.navigateUp();
    else if (message === '39')      Reveal.navigateRight();
    else if (message === '40')      Reveal.navigateDown();
    else if (message === '27')      Reveal.toggleOverview();
    else if (message === 'goto:0')  Reveal.slide(0,0);
}
function updateImpress(message) {
    console.log('updateImpress '+message);
    if      (message === '37')   impress().prev();
    else if (message === '39')   impress().next();
    else if (message.indexOf('goto') !== -1) {
        if      (message === 'goto:0') impress().goto(0);
        else    impress().goto(message.replace('goto:',''));
    }
}
function updateJmpress(message) {
    console.log('updateJmpress '+message);
    var e = jQuery.Event('keydown');
    e.which = e.keyCode = parseInt(message,10);
    $(document).trigger(e);
}
function updateScrollDeck(message) {
    console.log('updateScrollDeck '+message);
    var e = jQuery.Event('keydown');
    e.which = e.keyCode = parseInt(message,10);
    $(document).trigger(e);
}
function updateGeneric(message) {
    /*console.log('updateGeneric '+message);
    var e = jQuery.Event('keydown');
    e.which = e.keyCode = parseInt(message,10);
    $(document).trigger(e);*/
} 

//Library for the swipe
var monSwiper = $("#swiper");
var hammertime = new Hammer(monSwiper.get(0));

var iosocket = io.connect();
var hasClick = false;

iosocket.on('connect', function () {
    console.log('connected');
});

iosocket.on('message', function(message) {
    messageHandler(message);
});

iosocket.on('key down', function(data) {
    messageHandler("" +data.keyCode, data.shiftKey, data.altKey, data.ctrlKey, data.metaKey);
});

iosocket.on('key up', function(data) {
    messageHandler("" + data.keyCode, data.shiftKey, data.altKey, data.ctrlKey, data.metaKey);
});

iosocket.on('disconnect', function() {
    console.log('disconnected');
});

//Set the bool to toggle click button
iosocket.on('setClick', function (data) {
    hasClick = data;
    toggleClick();
});


$(document).ready(function () {

    //  Going to the next slide
    $("#next1").click(function () {
        iosocket.emit('next');
        console.log("hasClick : " + hasClick)
        //iosocket.emit('hasClick');
    });

    hammertime.on('swiperight', function(ev) {
        iosocket.emit('next');
        console.log("hasClick : " + hasClick)
    });
    
    //  Going on the previous slide
    $("#prev1").click(function () {
        iosocket.emit('prev');
        console.log("hasClick : " + hasClick)
    });

    hammertime.on('swipeleft', function(ev) {
        iosocket.emit('prev');
        console.log("hasClick : " + hasClick)
    });

    //  Going at the beginning of this presentation
    $("#first1").click(function () {
        iosocket.emit('first');
        console.log("hasClick : " + hasClick)
    });

    //  Going at the end of this presentation
    $("#last1").click(function () {
        iosocket.emit('last');
        console.log("hasClick : " + hasClick)
    });

    //TODO
    $("#click").click(function() {

    });

    toggleClick();

});

function toggleClick(){
    if(hasClick){
        $("#click").show();
    } else {
        $("#click").hide();
    }
}