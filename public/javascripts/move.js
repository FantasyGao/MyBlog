//链式运动框架
function getstyle(obj,name) {
	if(obj.currentStyle) {
		return obj.currentStyle[name];
	} else {
		return getComputedStyle(obj, null)[name];
	}
}

function startmove(obj,json,fnEnd) {
    clearInterval(obj.timer);
	obj.timer=setInterval(function(){
		var bstop=true;
		for(var name in json) {
			 var cur=0;
			if(name=='opacity'){
				cur=Math.round(parseFloat(getstyle(obj,name))*100);
			} else {
				cur=parseInt(getstyle(obj,name));
			 }
			var speed=(json[name]-cur)/3;
			if(speed>0){
				speed=Math.ceil(speed);
			} else{
				speed=Math.floor(speed);
			}
			if(cur!=json[name]){
				bstop=false;
			}
			if(name=='opacity') {
				obj.style[name]=(cur+speed)/100;
			} else{
				obj.style[name]=cur+speed+'px';
			}
		}
		if(bstop){
			clearInterval(obj.timer);
			if(fnEnd)fnEnd();
		}
	},30);
	
}