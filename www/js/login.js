(function(d, s, id){
	var js, fjs = d.getElementsByTagName(s)[0];
	if (d.getElementById(id)) {return;}
	js = d.createElement(s); js.id = id;
	js.src = "//connect.facebook.net/zh_TW/sdk.js";
	fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

function login() {
	FB.login(function(response) {
		FB.getLoginStatus(function(response) {
			statusChangeCallback(response);
		});
	}, {scope: 'public_profile,email,user_likes',auth_type: 'rerequest'});
}
			
// This is called with the results from from FB.getLoginStatus().
function statusChangeCallback(response) {
	console.log('statusChangeCallback');
	console.log(response);
	// The response object is returned with a status field that lets the
	// app know the current login status of the person.
	// Full docs on the response object can be found in the documentation
	// for FB.getLoginStatus().
	if (response.status === 'connected') {
		// Logged into your app and Facebook.
		permit();
	} else if (response.status === 'not_authorized') {
		// The person is logged into Facebook, but not your app.
		document.getElementById('status').innerHTML = 'Please log ' + 'into this app.';
	} else {
		// The person is not logged into Facebook, so we're not sure if
		// they are logged into this app or not.
		document.getElementById('status').innerHTML = 'Please log ' + 'into Facebook.';
	}
}
			
function permit() {
	console.log('Welcome!  Fetching your information.... ');
	FB.api('/me?fields=id,name', function(response) {
		console.log('Successful login for: ' + response.name);
		console.log('Successful login for: ' + response.id);
		$.post('http://localhost/ContactCI/Contact/permit',
			{
				id : response.id,
			},function( data ) {				
				if(data)
				{
					$("#login").hide();
					$("#search").show();
				}
				else
				{
					document.getElementById('status').innerHTML = 'You are not the group member.';
				}
		});
	});
}