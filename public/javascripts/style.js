window.onload=function(){
	var oMessage=document.getElementById('message1');
	var oMessage2=document.getElementById('message2');
	var oMain = document.getElementsByTagName('main')[0];
	var ohomeTitle = document.getElementById('home_title');
	var ohomeTag = document.getElementById('home_tag');
	var oHead = document.getElementById('header');
	var oBody = document.getElementById('body');
	var oClassily = document.getElementById('classily');
    ohomeTitle.addEventListener("click",function () {
        window.location='/index';
    })
	oClassily.addEventListener("click",function () {
		startmove(ohomeTag,{opacity:100});
	})

	oBody.addEventListener("click",function () {
		startmove(ohomeTag,{opacity:0});
	})

};
	