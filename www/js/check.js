$("#check").click(function(){
	checkloader();
	var timer = setInterval(function () {
		hideloader();
		alert("檢測資訊已送出!");
		clearInterval(timer);
	}, 3000);
});