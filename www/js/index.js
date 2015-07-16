/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};

//app.initialize();

function showloader(){
	$.mobile.loading( 'show', {
		text: '讀取中',
		textVisible: true,
		theme: 'z',
		html: ""
	});
}
function hideloader(){			
	$.mobile.loading('hide');
}

$(document).ready(function(){	
	//$(this).ajaxStart(showloader()).ajaxStop(hideloader());	
	$("#page2").hide();
	$("#page3").hide();
	$("#submit").click(function(){
		showloader();	
		$("#p2l1").empty().append("搜尋條件："+$('#type').val());
		$("#p2l2").empty().append("關鍵字："+$('#key').val());
		var typeval = $('#type').val();
		var keyval = $('#key').val();
		//console.log(keyval);
		$.post('http://localhost/ContactCI/Contact/test',
			{
				key : keyval,
				type : typeval
			},function( data ) {				
				var listItems = "<li id='title' data-role='list-divider' >搜尋結果</li>";
				console.log(data);
				var list = JSON.parse(data);				
				for(var value in list){
					//console.log(value + list[value][0]);
					listItems += "<li><a href='#' id='"+list[value][1]+"'>"+list[value][0]+"</a></li>";
				}
				$("#p2l3").html(listItems);
				$("#p2l3").listview('refresh');
				$("#page1").hide();
				$("#page2").show();
				hideloader();	
		});
		//return false;
	});
	$("#p2l3").click(function(event){
		if(event.target.id!='title'){
			showloader();
			var stuid = event.target.id;
			$.post('http://localhost/ContactCI/Contact/test2',
			{
				stu : stuid
			},function( data ){				
				var detail = JSON.parse(data);
				console.log(detail);
				var detailitem = "<img src="+detail['url']+"><h3>學號："+detail['student'][0]+"</h3><h3>姓名："+detail['student'][1]+"</h3><h3>Email：<a href='mailto:"+detail['student'][3]+
					"'>"+detail['student'][4]+"</a></h3><h3>專題老師："+detail['student'][2]+"</h3><h3>專題題目："+detail['student'][3]+"</h3><h3 style='color:blue'>facebook</h3>";					
				if(typeof detail['facebook'][0]['uid'][0]!='undefined'){				
					var fbdetail = detail['facebook'];				
					for(var value in fbdetail){
						
						detailitem += "<h3>facebook名稱：<a href='http://www.facebook.com/"+fbdetail[value]['uid'][0]+"'>"+fbdetail[value]['uid'][1]+
							"</a><h3><h3>家鄉："+fbdetail[value]['location'][1]+"</h3><h3>現居城市："+fbdetail[value]['location'][0]+
							"</h3><h3>傳送訊息：<a href='mailto:"+fbdetail[value]['uid'][0]+
							"@facebook.com'>點此以Email傳送</a></h3><div data-role='collapsible' data-collapsed='true'><h4>工作經歷</h4>";
						
						for(var value2 in fbdetail[value]['work']){
							detailitem += "<h3>公司："+fbdetail[value]['work'][value2][1]+"</h3><h3>職位："+fbdetail[value]['work'][value2][2]+
							"</h3><h3>開始時間："+fbdetail[value]['work'][value2][3]+"</h3><h3>結束時間："+fbdetail[value]['work'][value2][4]+"</h3>"
						}
						detailitem += "</div>"
					}
				}else{
					detailitem +="<h3>尚未加入社團或未建立FACEBOOK資料</h3>"
				}		
				$("#detail").html(detailitem).trigger( "create" );				
			});
			$("#page2").hide();
			$("#page3").show();
			hideloader();			
		}
	});
	$("#back").click(function(){		
		$("#page2").hide();
		$("#page1").show();
	});
	$("#back2").click(function(){		
		$("#page2").show();
		$("#page3").hide();
	});
	$("#home").click(function(){		
		$("#page3").hide();
		$("#page1").show();
	});
});