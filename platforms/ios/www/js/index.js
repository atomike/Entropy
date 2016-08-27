var entropy = {};

entropy.app = {
	
    initialize: function() {
		document.addEventListener('deviceready', this.onDeviceReady, false);
    },

    onDeviceReady: function() {
		console.log("Device Ready");
		FastClick.attach(document.body);
		
		StatusBar.overlaysWebView(false);
		StatusBar.styleBlackOpaque();
		StatusBar.backgroundColorByName("black");
		
		$("#toggle-ac").on('tap', entropy.app.toggleAC);
    },
	
	toggleAC: function(){
		$("#home").toggleClass("off");
		
		if($("#home").hasClass("off"))
			{entropy.app.turnOFF();}
		else
			{entropy.app.turnON();}
	},
	
	turnONSuccess: function(){
		$("#home").removeClass("off");
		$("#toggle-ac span.state").text("TURN OFF");
	},
	
	turnONSuccess: function(){
		$("#home").addClass("off");
		$("#toggle-ac span.state").text("TURN ON");
	},
	
	turnON: function(){
		$.ajax({
		  dataType: "json",
		  url: 'http://192.168.0.181/gpio.php',
		  data: {on:true},
		  success: entropy.app.turnONSuccess
		});
	},
	
	turnOFF: function(){
		$.ajax({
		  dataType: "json",
		  url: 'http://192.168.0.181/gpio.php',
		  data: {off:true},
		  success: entropy.app.turnOFFSuccess
		});
	}

};
