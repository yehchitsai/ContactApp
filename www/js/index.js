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

//顯示查詢時的等候動畫
function showloader(){
	$.mobile.loading( 'show', {
		text: '讀取中',
		textVisible: true,
		theme: 'z',
		html: ""
	});
}

//隱藏等候動畫
function hideloader(){			
	$.mobile.loading('hide');
}

//app內容讀取完畢
$(document).ready(function(){
	//隱藏查詢、名單、詳細資料頁面
	$("#search").hide();
	$("#list").hide();
	$("#result").hide();
	
	//送出查詢要求
	$("#submit").click(function(){
		showloader();
		//顯示查詢條件與關鍵字
		$("#searchType").empty().append("搜尋條件："+$('#type').val());
		$("#searchKey").empty().append("關鍵字："+$('#key').val());
		//宣告變數儲存查詢條件與關鍵字
		var typeval = $('#type').val();
		var keyval = $('#key').val();
		//使用post傳送到server進行查詢
		$.post('http://163.15.192.212/ContactCI/Contact/namelist',
			{
				type : typeval,
				key : keyval
			},function( data ) {
				//用for讀取全部結果並加入清單內
				var listItems = "<li id='none' data-role='list-divider' >搜尋結果</li>";
				var list = JSON.parse(data);				
				for(var value in list){
					listItems += "<li><a href='#' id='"+list[value][0]+"'>"+list[value][1]+"</a></li>";
				}
				//將清單加到網頁中
				$("#nameList").html(listItems);
				$("#nameList").listview('refresh');
				//隱藏查詢頁面
				$("#search").hide();
				//顯示名單頁面
				$("#list").show();
				hideloader();	
		});
	});
	
	//送出顯示資料要求
	$("#nameList").click(function(event){
		//觸發事件的id不為none,則查詢資料
		if(event.target.id!='none'){
			showloader();
			//將觸發事件的id指定給變數stuid
			var stuid = event.target.id;
			//使用post傳送到server進行查詢
			$.post('http://163.15.192.212/ContactCI/Contact/detail',
			{
				stu_id : stuid
			},function( data ){	
				//將得到的結果制定給變數detail
				var detail = JSON.parse(data);
				//將系友的系上資料加到detailitem內
				var detailitem = "<h3>學號："+detail['studata'][0]+"</h3><h3>姓名："+detail['studata'][1]+"</h3><h3>電話："+detail['studata'][2]+"</h3>";
				//如果系友有至少一個email,則加依序加到detailitem內
				if(typeof detail['email'][0]!='undefined'){
					detailitem += "<div data-role='collapsible' data-collapsed='true'><h4>Email</h4>"
					for(var value in detail['email']){
						detailitem += "<h3><a href='mailto:"+detail['email'][value]+"'>"+detail['email'][value]+"</a></h3>"
					}
					detailitem += "</div>";
				}
				else{
					detailitem += "<h3 style='color:red'>用戶尚未有公開的Email</h3>"
				}
				//將系友的fb資料加到detailitem內
				detailitem += "<br><h1 style='color:blue'>facebook資訊</h1>";
				//如果系友有至少一個fb,則將資料依序加到detailitem內
				if(typeof detail['account'][0]['uid'][0]!='undefined'){
					//用for讀取fb基本資料
					for(var value in detail['account']){
						detailitem += "<img src="+detail['account'][value]['facebook'][1]+">";
						detailitem += "<h3>facebook名稱：<a href='http://www.facebook.com/"+detail['account'][value]['uid'][0]+"'>"+detail['account'][value]['facebook'][0]+"</a></h3>";
						detailitem += "<h3>家鄉："+detail['account'][value]['facebook'][3]+"</h3><h3>現居城市："+detail['account'][value]['facebook'][2]+"</h3>";
						
						//用for讀取工作經歷
						detailitem += "<div data-role='collapsible' data-collapsed='true'><h4>工作經歷</h4>";
						for(var value2 in detail['account'][value]['work']){
							detailitem += "<h3>公司："+detail['account'][value]['work'][value2][0]+"</h3>";
							detailitem += "<h3>職位："+detail['account'][value]['work'][value2][1]+"</h3>";
							detailitem += "<h3>開始時間："+detail['account'][value]['work'][value2][2]+"</h3>";
							detailitem += "<h3>結束時間："+detail['account'][value]['work'][value2][3]+"</h3>";
						}
						detailitem += "</div>";
						
						//用for讀取教育程度
						detailitem += "<div data-role='collapsible' data-collapsed='true'><h4>教育程度</h4>";
						for(var value3 in detail['account'][value]['education']){
							detailitem += "<h3>學位："+detail['account'][value]['education'][value3][0]+"</h3>";
							detailitem += "<h3>學校："+detail['account'][value]['education'][value3][1]+"</h3>";
							detailitem += "<h3>畢業年份："+detail['account'][value]['education'][value3][2]+"</h3>";
						}
						detailitem += "</div>";
					}
				}
				else{
					detailitem +="<h3 style='color:red'>尚未加入社團或未建立FACEBOOK資料</h3>"
				}
				
				$("#detail").html(detailitem).trigger( "create" );	
			
			});
			//隱藏名單頁面
			$("#list").hide();
			//顯示詳細資料頁面
			$("#result").show();
			hideloader();			
		}
	});
	
	//在名單頁面 返回 查詢頁面
	$("#list_search").click(function(){		
		$("#list").hide();
		$("#search").show();
	});
	
	//在詳細資料頁面 返回 名單頁面
	$("#result_list").click(function(){		
		$("#result").hide();
		$("#list").show();
	});
	
	//在詳細資料頁面 返回 查詢頁面
	$("#result_search").click(function(){		
		$("#result").hide();
		$("#search").show();
	});
});