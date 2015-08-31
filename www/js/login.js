function login(){
	if (window.cordova.platformId == "browser") {
        facebookConnectPlugin.browserInit(873678602720187,"v2.4");
    }
    facebookConnectPlugin.login( ["email"], 
        function (response) { 
			if (response.status === 'connected') {
				permit();
			} else if (response.status === 'not_authorized') {
				document.getElementById('status').innerHTML = 'Please log ' + 'into this app.';
			} else {
				document.getElementById('status').innerHTML = 'Please log ' + 'into Facebook.';
			} 
		});
}

function permit() {
	facebookConnectPlugin.api( "me/?fields=id,name,email", ["user_birthday"],
        function (response) { 
			$.post('http://163.15.192.212/ContactCI/Contact/permit',
			{
				id : response.id,
			},function( data ) {				
				if(data)
				{
					$("#login").hide();
					document.getElementById('user').innerHTML = '<h3>用戶名稱：'+response.name+'</h3>';
					$("#search").show();
				}
				else
				{
					console.log(data);
					document.getElementById('status').innerHTML = '<h3>此帳號非系友社團成員，不能登入.</h3>';
				}
			}); 
		}); 
}