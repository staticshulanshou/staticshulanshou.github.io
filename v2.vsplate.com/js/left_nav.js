$(function () {

$.updateLeftNavStatus = function (obj, data) {
	status = data.status.toLowerCase();
	time_left = data.time_left;
	if(status == 'running' && time_left < 0){
		status = 'exited';
	}
	time_left = new Date(time_left * 1000).toISOString().substr(11, 8);
	label = '<span class="label label-default">unknow</span>';
	if(status == 'running'){
		
		label = '<span class="label label-success">'+time_left+'</span>';
	}else if(status == 'pending'){
		label = '<span class="label label-info">pending</span>';
	}else if(status == 'creating'){
		label = '<span class="label label-info">creating</span>';
	}else{
		label = '<span class="label label-default">'+status+'</span>';
	}
	if(obj){
		$(obj).children(".label").replaceWith(label);
	}else{
		console.log('unknow obj');
	}
}

var loadLeftNavLock = false;
$.loadLeftNavStatus = function () {
	if(pageActive != true){
		return;
	}
	//console.log(pageActive);
	if(loadLeftNavLock == true){
		return;
	}
	loadLeftNavLock = true;
	$("#projects-list ul li").each(function(){
		var uuid = $(this).attr('uuid');
		var obj = $(this);
		var proj_data = false;
		if(uuid){
			try{
				$.ajax({
					type:'POST',
					url: '/api.php?mod=project&action=status',
					timeout : 30000,
					dataType:'json',
					data:{
						"uuid": uuid,
						"token": $("#token").text()
					},
					success:function(data){
						if(!data || !data.hasOwnProperty('status') || !data.hasOwnProperty('msg')){
							console.log("Error: Empty response: "+uuid);
						}else if(data.status == 1){
							//console.log("Status "+uuid+": "+data.data.status);
							proj_data = data.data;
						}else{
							console.log("Error "+uuid+": "+data.msg);
						}
					},
					error:function(XMLHttpRequest, textStatus, errorThrown){
						console.log("Error "+uuid+":"+$.escapeHtml(XMLHttpRequest.status));
					},
					complete:function(XMLHttpRequest,status){
						loadLeftNavLock = false;
						if(status=='timeout'){
							console.log("Error "+uuid+": Operation Timeout");
						}
						if(proj_data){
							$.updateLeftNavStatus(obj, proj_data);
						}
					}
				});
			}catch(err){
				loadLeftNavLock = false;
				console.log(err);
			}
		}
	});
}
$.loadLeftNavStatus();
var i_loadLeftNavStatus = window.setInterval("$.loadLeftNavStatus()",30000);

$("#projects-list #projects-nav input[type='text']").live("change", function () {
	$("#projects-list ul li").removeClass('hidden');
	var key = $(this).val().trim().toLowerCase();
	if(!key || key == ''){
		return false;
	}
	$("#projects-list ul li").each(function(){
		var uuid = $(this).attr('uuid').toLowerCase();
		var name = $(this).children('.name').text().toLowerCase();
		var str = uuid+" "+name;
		if(str.indexOf(key) != -1){
			console.log("Found: "+str);
		}else{
			$(this).addClass("hidden");
		}
	});
});

});
