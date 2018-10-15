$(function(){
        $.extend({
                escapeHtml : function(str) {
                        var entityMap = {
                                "&": "&amp;",
                                "<": "&lt;",
                                ">": "&gt;",
                                '"': '&quot;',
                                "'": '&#39;',
                                "/": '&#x2F;'
                        };
                        return String(str).replace(/[&<>"'\/]/g, function (s) {
                                return entityMap[s];
                        });
                }
	});
	
	$.extend({
                btnLoadingStart : function(obj) {
                        if(!obj){
                        	return;
                        }
                        $(obj).addClass('btnloading');
                }
	});
	
	$.extend({
                btnLoadingStop : function(obj) {
                        if(!obj){
                        	return;
                        }
                        $(obj).removeClass('btnloading');
                }
	});
        
        
	
	$.extend({
		gotoUrl : function(url) {
			window.location.href = url;
		}
	});
});
