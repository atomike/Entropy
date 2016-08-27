function celsiusToFarenheit(celsius){
	var farenheit =  celsius*9/5+32;
	return farenheit.toFixed(2);
}

var entropy = {};

entropy.app = {
	raspberrypi_ip: "192.168.0.142",
	
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
		
		entropy.app.getACStatus();
		setInterval(entropy.app.getACStatus, 1000);
    },
	
	toggleAC: function(){
		$("#home").toggleClass("off");
		
		if($("#home").hasClass("off"))
			{entropy.app.turnOFF();}
		else
			{entropy.app.turnON();}
	},
	
	turnONSuccess: function(){
		console.log("Successfully turned AC ON.");
		$("#home").removeClass("off");
		$("#toggle-ac span.state").text("TURN OFF");
	},
	
	turnOFFSuccess: function(){
		console.log("Successfully turned AC OFF.");
		$("#home").addClass("off");
		$("#toggle-ac span.state").text("TURN ON");
	},
	
	error: function(){
		console.error("An error occurred while contacting Raspberry Pi via ajax.");
		$("#toggle-ac span.state").text("Error");
	},
	
	turnON: function(){
		console.log("Turning AC ON...");
		$.ajax({
		  url: 'http://'+entropy.app.raspberrypi_ip+'/gpio.php',
		  data: {on:true},
		  success: entropy.app.turnONSuccess,
		  error: entropy.app.error
		});
	},
	
	turnOFF: function(){
		console.log("Turning AC OFF");
		$.ajax({
		  url: 'http://'+entropy.app.raspberrypi_ip+'/gpio.php',
		  data: {off:true},
		  success: entropy.app.turnOFFSuccess,
		  error: entropy.app.error
		});
	},
	
	getACStatus: function(){
		console.log("Getting AC Status");
		$.ajax({
		  dataType: 'json',
		  url: 'http://'+entropy.app.raspberrypi_ip+'/gpio.php',
		  data: {status:true},
		  success: entropy.app.updateStatus,
		  error: entropy.app.error
		});
	},
	
	updateStatus(status){
		console.log("Updating Status", status);
		
		if(status.power=="ON")
			{entropy.app.turnONSuccess();}
		else
			{entropy.app.turnOFFSuccess();}
		
		var next_target_temp_time = new Date("1/1/2020 "+status.next_target_temp_time).toLocaleTimeString('en-US');
		$("#target_temp").text(status.target_temp);
		$("#next_target_temp").text(status.next_target_temp);
		$("#next_target_temp_time").text(next_target_temp_time);
		
		entropy.app.updateSensorStatus(status.sensor);
	},
	
	updateSensorStatus(sensor){
		console.log("Updating Sensor Status", sensor);
		
		if(sensor==null)
			{return;}
		
		$("#current_temp").text(celsiusToFarenheit(sensor.Temp));
		$("#current_humidity").text(sensor.RH);
	}
	
};
