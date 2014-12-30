
// Script used for uploading some presentations towards the server
$(document).ready(function() {
	if(document.location.href.indexOf("?") > -1){
		if (window.opener && !window.opener.closed ) {	
			var tab = document.location.href.split('?');
			var fileName = tab[tab.length-1];
			fileName="./images/temp/"+fileName;
			console.log(window.opener);
			window.opener.alert_image(fileName);
			window.opener.drawimage(fileName);
			$("#hiddenfile").innerHTML = '';
            self.close();			
		}
	}
   $("#submit").click( function() {
        var fileName = $("#addImage").val();	
		if(fileName != ""){
			$("#submitForm").click();
		}else{
			alert('choix de l\'image vide');
		}
    });
	
});