var array = new Array();

$("#check").click(function(){
	array[7] = Date.now();
	$.post('http://163.15.192.212/ContactCI/Contact/monitor',
		{
			monitor_data : array
		},function( data ) {
			alert(data);
		}); 	
});