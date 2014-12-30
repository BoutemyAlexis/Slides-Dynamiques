
// Script used for uploading some presentations towards the server
$(document).ready(function() {

   $("#submit").click( function() {
        var fileName = $("#addImage").val();
		if (window.opener && !window.opener.closed ) {		
			$("#submitForm").click();
			if (fileName.indexOf('\\') !== -1) {
				var tab = fileName.split('\\');
				fileName = tab[tab.length-1];
			}
			fileName="./images/temp/"+fileName;
			console.log(window.opener);
			window.opener.alert_image(fileName);
			window.opener.drawimage(fileName);

			$("#hiddenfile").innerHTML = '';
            self.close();			
		}
    });
});