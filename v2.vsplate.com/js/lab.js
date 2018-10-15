$(function () {

//edit project title
$("#project-body .body-info h3 button").live("click", function () {
	var title = $(".body-info h3 span").text();
	$(".edit-project-title .project-title").val(title);
	
	$(".body-info h3").addClass("hidden");
	$(".edit-project-title").removeClass("hidden");
});

//save project title
$("#project-body .edit-project-title button.btn-save").live("click", function () {
	var title = $(".edit-project-title .project-title").val();
	if(title == ''){
		return false;
	}
	$(".body-info h3 span").text(title);
	
	$(".body-info h3").removeClass("hidden");
	$(".edit-project-title").addClass("hidden");
	
	$.ajax({
		type:'POST',
		url: '/api.php?mod=project&action=saveTitle',
		timeout : 6000,
		dataType:'json',
		cache: false,
		data:{
			"title": title,
			"uuid": uuid,
			"token": $("#token").text()
		},
		complete:function(XMLHttpRequest,status){
			window.location.reload();
		}
	});
	
	return false;
});

//cancel edit project title
$("#project-body .edit-project-title button.btn-cancel").live("click", function () {
	$(".body-info h3").removeClass("hidden");
	$(".edit-project-title").addClass("hidden");
	return false;
});

//load project status
var loadProjectLock = false;
$.loadProjectStatus = function () {
	if(pageActive != true){
		return;
	}
	var proj_status_data =false;
	if(loadProjectLock == true){
		return false;
	}
	loadProjectLock = true;
	try{
		$.ajax({
			type:'POST',
			url: '/api.php?mod=project&action=status',
			timeout : 5000,
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
					proj_status_data = data.data;
				}else{
					console.log("Error "+uuid+": "+data.msg);
				}
			},
			error:function(XMLHttpRequest, textStatus, errorThrown){
				console.log("Error "+uuid+":"+$.escapeHtml(XMLHttpRequest.status));
			},
			complete:function(XMLHttpRequest,status){
				loadProjectLock = false;
				if(status=='timeout'){
					console.log("Error "+uuid+": Operation Timeout");
				}
				if(proj_status_data){
					proj_status = proj_status_data.status.toLowerCase();
					project_status = proj_status;
					//console.log("Project "+uuid+" status: "+proj_status);
					if(proj_status == 'running'){
						$("#project_stop_btn").removeAttr("disabled");
						$("#project_restart_btn").removeAttr("disabled");
						$("#project_start_btn").attr("disabled", "disabled");
						$("#project_delete_btn").attr("disabled", "disabled");
					}else if(proj_status == 'exited' || proj_status == 'error'){
						$("#project_stop_btn").attr("disabled", "disabled");
						$("#project_restart_btn").attr("disabled", "disabled");
						$("#project_start_btn").removeAttr("disabled");
						$("#project_delete_btn").removeAttr("disabled");
					}else if(proj_status == 'timeout'){
						$("#project_stop_btn").attr("disabled", "disabled");
						$("#project_restart_btn").attr("disabled", "disabled");
						$("#project_start_btn").attr("disabled", "disabled");
						$("#project_delete_btn").removeAttr("disabled");
					}
				}
			}
		});
	}catch(err){
		loadProjectLock = false;
		console.log(err);
	}
}
$.loadProjectStatus();
var i_loadProjectStatus = window.setInterval("$.loadProjectStatus()",30000);

//delete project
$("#project_delete_btn").live("click", function () {
	if($(this).attr("disabled") == 'disabled'){
		return false;
	}
	
	var r = confirm("Delete project: "+uuid+" ?");
	if(r != true){
		return false;
	}
	var obj = $(this);
	$.btnLoadingStart(obj);
	$.ajax({
		type:'POST',
		url: '/api.php?mod=project&action=delete',
		timeout : 6000,
		dataType:'json',
		cache: false,
		data:{
			"uuid": uuid,
			"token": $("#token").text()
		},
		success:function(data){
			if(!data || !data.hasOwnProperty('status') || !data.hasOwnProperty('msg')){
				alert("Error: Empty response.");
				console.log("Error: Empty response.");
			}else if(data.status == 1){
				alert("You have deleted project "+uuid+" successfully");
				$.gotoUrl('/labs.php');
			}else{
				alert(data.msg);
				console.log("Error: "+data.msg);
			}
		},
		complete:function(XMLHttpRequest,status){
			if(status=='timeout'){
				alert("Error: Operation Timeout.");
				console.log("Error: Operation Timeout");
			}
			$.btnLoadingStop(obj);
		}
	});
	
	return false;
});

//start project
$("#project_start_btn").live("click", function () {
	if($(this).attr("disabled") == 'disabled'){
		return false;
	}
	var obj = $(this);
	$.btnLoadingStart(obj);
	$.ajax({
		type:'POST',
		url: '/api.php?mod=project&action=start',
		timeout : 10000,
		dataType:'json',
		cache: false,
		data:{
			"uuid": uuid,
			"token": $("#token").text()
		},
		success:function(data){
			if(!data || !data.hasOwnProperty('status') || !data.hasOwnProperty('msg')){
				alert("Error: Empty response.");
				console.log("Error: Empty response.");
			}else if(data.status == 1){
				window.location.reload();
			}else{
				alert(data.msg);
				console.log("Error: "+data.msg);
			}
		},
		complete:function(XMLHttpRequest,status){
			if(status=='timeout'){
				alert("Error: Operation Timeout.");
				console.log("Error: Operation Timeout");
			}
			$.btnLoadingStop(obj);
		}
	});
	
	return false;
});

//stop project
$("#project_stop_btn").live("click", function () {
	if($(this).attr("disabled") == 'disabled'){
		return false;
	}
	
	var obj = $(this);
	$.btnLoadingStart(obj);
	$.ajax({
		type:'POST',
		url: '/api.php?mod=project&action=stop',
		timeout : 6000,
		dataType:'json',
		cache: false,
		data:{
			"uuid": uuid,
			"token": $("#token").text()
		},
		success:function(data){
			if(!data || !data.hasOwnProperty('status') || !data.hasOwnProperty('msg')){
				alert("Error: Empty response.");
				console.log("Error: Empty response.");
			}else if(data.status == 1){
				window.location.reload();
			}else{
				alert(data.msg);
				console.log("Error: "+data.msg);
			}
		},
		complete:function(XMLHttpRequest,status){
			if(status=='timeout'){
				alert("Error: Operation Timeout.");
				console.log("Error: Operation Timeout");
			}
			$.btnLoadingStop(obj);
		}
	});
	
	return false;
});

//restart project
$("#project_restart_btn").live("click", function () {
	if($(this).attr("disabled") == 'disabled'){
		return false;
	}
	
	var obj = $(this);
	$.btnLoadingStart(obj);
	$.ajax({
		type:'POST',
		url: '/api.php?mod=project&action=restart',
		timeout : 6000,
		dataType:'json',
		cache: false,
		data:{
			"uuid": uuid,
			"token": $("#token").text()
		},
		success:function(data){
			if(!data || !data.hasOwnProperty('status') || !data.hasOwnProperty('msg')){
				alert("Error: Empty response.");
				console.log("Error: Empty response.");
			}else if(data.status == 1){
				window.location.reload();
			}else{
				alert(data.msg);
				console.log("Error: "+data.msg);
			}
		},
		complete:function(XMLHttpRequest,status){
			if(status=='timeout'){
				alert("Error: Operation Timeout.");
				console.log("Error: Operation Timeout");
			}
			$.btnLoadingStop(obj);
		}
	});
	
	return false;
});

});
