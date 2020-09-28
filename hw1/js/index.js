function myFunction() {
	 var path2;
     path2 = document.getElementById('pth');
	 var ckd2;
     ckd2 = document.getElementById('ckd');
	 var label2;
	 label2 = document.getElementById('lbl');
	if (ckd2.checked) {
       label2.innerHTML = "Happy"
	   path2.style.transform = "";
	}
	else{
		label2.innerHTML = "Sad";
		path2.style = "transform:scale(1,-1); transform-origin: 50% 70%;"
	}
}