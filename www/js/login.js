//登錄fb
function login(){
	var login_start = Date.now();//監控
	
	if (window.cordova.platformId == "browser") {
		//指定app ID 和 api版本
        facebookConnectPlugin.browserInit(873678602720187,"v2.4");
    }
	else if(!window.cordova){
		//指定app ID 和 api版本
        facebookConnectPlugin.browserInit(873678602720187,"v2.4");
	}
	//登錄時向使用者索取額外權限
    facebookConnectPlugin.login( ["email"], 
        function (response) { 
			//判斷登錄狀態
			if (response.status === 'connected') {
				//監控
				var login_end = Date.now();
				var login_total = login_end - login_start;
				array[0] = login_total/1000;
				
				//已登錄則呼叫判斷方法
				permit();
			} else if (response.status === 'not_authorized') {
				document.getElementById('status').innerHTML = 'Please log ' + 'into this app.';
			} else {
				document.getElementById('status').innerHTML = 'Please log ' + 'into Facebook.';
			} 
		});
}

//判斷是否為社團成員
function permit() {
	
	var api_start = Date.now();//監控
	
	//實作api,此時也可索取額外權限
	facebookConnectPlugin.api( "me/?fields=id,name", ["user_birthday"],
        function (response) { 
			//監控
			var api_end = Date.now();
			var api_total = api_end - api_start;
			array[1] = api_total/1000;
		
			var permit_start = Date.now();//監控
			
			//將得到的id傳到server比對
			$.post('http://163.15.192.212/ContactCI/Contact/permit',
			{
				id : response.id,
			},function( data ) {
				//比對後結果	
				if(data)
				{
					//監控
					var permit_end = Date.now();
					var permit_total = permit_end - permit_start;
					array[2] = permit_total/1000;
					
					//為成員，開啟查詢功能並顯示使用者名稱
					$("#login").hide();
					document.getElementById('user').innerHTML = '<h3>用戶名稱：'+response.name+'</h3>';
					update();
					$("#search").show();
				}
				else
				{
					//非成員不能使用查詢功能
					document.getElementById('status').innerHTML = '<h3>此帳號非系友社團成員，不能登入.</h3>';
				}
			}); 
		}); 
}

//成員登入後，送出Token更新系友資料
function update(){
	facebookConnectPlugin.getAccessToken( 
        function (response) { 
			$.post('http://163.15.192.212/ContactCI/Contact/update',
				{
					AccessToken : response
				},function( data ) {
					
			});
		});
}