
let files = [],
	dragArea = document.querySelector('.drag-area'),
	input = document.querySelector('.drag-area input'),
	button = document.querySelector('.card button'),
	select = document.querySelector('.drag-area .select'),
	container = document.querySelector('.container');
var filesToUpload = []; //store files

/** CLICK LISTENER */
select.addEventListener('click', () => input.click());

/* INPUT CHANGE EVENT */
input.addEventListener('change', () => {
	let file = input.files;

	// if user select no image
	if (file.length == 0) return;
	if ((files.length + file.length) <= 10) {
		for (let i = 0; i < file.length; i++) {
			if (file[i].type.split("/")[0] != 'image') continue;
			var x = file[i].size / 1024 / 1024
			if (x >= 1) {
				M.toast({ html: `Max Allowed Size is 1MB!!`, classes: 'red rounded' });
				// alert("Max Allowed Size is 1MB")
				continue;
			}
			if (!files.some(e => e.name == file[i].name)) {

				files.push(file[i]);
			}
		}
	}
	else {
		M.toast({ html: `Only 10 Images Allowed one Time!!`, classes: 'red rounded' });
		// alert("Only 10 Images Allowed one Time")
	}
	showImages();
});

/** SHOW IMAGES */
function showImages() {
	container.innerHTML = files.reduce((prev, curr, index) => {
		return `${prev}
		    <div class="image">
			    <span onclick="delImage(${index})">&times;</span>
			    <img src="${URL.createObjectURL(curr)}" />
			</div>`
	}, '');
}

/* DELETE IMAGE */
function delImage(index) {
	files.splice(index, 1);
	filesToUpload.splice(index, 1)
	showImages();
}

/* DRAG & DROP */
dragArea.addEventListener('dragover', e => {
	e.preventDefault()
	dragArea.classList.add('dragover')
})

/* DRAG LEAVE */
dragArea.addEventListener('dragleave', e => {
	e.preventDefault()
	dragArea.classList.remove('dragover')
});

/* DROP EVENT */
dragArea.addEventListener('drop', e => {
	e.preventDefault()
	dragArea.classList.remove('dragover');

	let file = e.dataTransfer.files;
	for (let i = 0; i < file.length; i++) {
		/** Check selected file is image */
		if (file[i].type.split("/")[0] != 'image') continue;

		if (!files.some(e => e.name == file[i].name)) files.push(file[i])
	}
	showImages();
});



jQuery_3_6_1(document).ready(function (readyEvent) {
	


	//upload file
	jQuery_3_6_1('#filee').on('change', function () {

		// jQuery_3_6_1("#upload_prev").html('');

		fileCounter = this.files.length; //count files

		//Store all files to our main array
		var files = this.files;
		for (var i = 0; i < files.length; i++) {
			var x = files[i].size / 1024 / 1024

			if (x <= 1) {
				filesToUpload.push(files[i]);
			}
			else {
				continue
			}


		}

	});


	//Demo Upload button
	jQuery_3_6_1(document).on('click', '#upload_file', function () {
		if (filesToUpload.length) {
			if (document.getElementById("titling").innerText == "--Select Specie--") {
				M.toast({ html: "Select Specie from the Dropdown.", classes: 'red rounded' });
			}
			else if (document.getElementById("title_farm").innerText == "--Select Farm/Orchid--") {
				M.toast({ html: "Select Farm from the Dropdown.", classes: 'red rounded' });
			}
			else {

				var form_data = new FormData();
				var ins = document.getElementById('filee').files.length;

				
				for (var x = 0; x < filesToUpload.length; x++) {
					var tex = `img${x+1}`;

					var imageTag = document.getElementById(tex);
					const imageUrl = URL.createObjectURL(filesToUpload[x]);
      				imageTag.src = imageUrl;
					form_data.append("files[]", filesToUpload[x]);
				}
				const parentElement = document.getElementById("report-parent");
				for (var x = filesToUpload.length + 1; x <= 10; x++) {
					var tex = `rep${x}`;

					var imageTag = document.getElementById(tex);
					parentElement.removeChild(imageTag);
					// imageTag.remove();
				}
				
				form_data.append("farm", jQuery_3_6_1("#title_farm").attr('name'));
				
				form_data.append("specie_name", document.getElementById("titling").innerText);
				console.log(form_data)
				M.toast({ html: `Please Wait`, classes: 'green rounded' });
				jQuery_3_6_1.ajax({
					url: '/upload', // point to server-side URL
					dataType: 'json', // what to expect back from server
					cache: false,
					contentType: false,
					processData: false,
					data: form_data,
					type: 'post',
					 
					complete: function (data) {
						console.log(data.responseText);
						const cleanedResponse = data.responseText.replace(/'/g, '"');
						const parsedList = JSON.parse(cleanedResponse);
						// console.log(parsedList[0][0]);
						console.log(parsedList);
						var disease_names = ["Anthracnose"  , "Die Black" , "Gall Midge" , "Healthy",
						"Powdery Mildew"  , "Sooty Mould"]
						var cure = ["Prochloraz is used as a cold non- recirculating spray. Hot water dips used to control fruit flies will also control anthracnose and stem end rots. Hot benomyl dips will control anthracnose and are useful where stem end rots are a problem."
						,"After pruning, apply copper oxychloride at a concentration of 0.3% on the wounds. Apply Bordeaux mixture twice a year to reduce the infection rate on the trees. Sprays containing the fungicide thiophanate-methyl have proven effective against it."
						,"In the event of severe infestation of Gall midge, application of any of the plant based products like l0% Neem leaf extract, 5% NSKE, 1% Neem oil, 0.3 % Fish oil resin soap, 3 % Dasagavya and 3 % Herbal plant extraction can be sprayed to bring down the pest population. Collect and destroy infested crop debris"
						,"Dissolve 20 grams potassium nitrate in one liter water and spray on both sides of leaves branches and trunk before the time for flowering. adding one gram urea in the nitrate. solution may produce better mango yield calcium nitrate can be sprayed instead of potassium nitrate to get good. results."
						,"Treating the plants with foliar sprays based on sulfur, carbonic acid, neem oil, koanin and ascorbic acid can prevent severe infection. Furthermore, milk is a natural fungicide. It can be applied in the form of whey to control powdery mildew."
						,"Pruning to remove most of the infested plant parts is helpful. If the tree is small, sooty mold can be washed off with a strong stream of water or soap and water Systemic insecticides (such as Imidacloprid) are also effective but must be properly timed so that the pollinator killing insecticide isn't inside the plant during bloom time.",
					]
						for(var i = 0; i <parsedList.length ; i++){
								console.log(i);
								var list_pred = [0,0,0,0,0,0];
								var disease_pointer = "No";
								for(let j = 0; j < parsedList[i].length;j++){
									if(parsedList[i][j] == "Anthracnose"){
											list_pred[0] =parsedList[i][j+1];
											disease_pointer = "Yes"
									}
									else if(parsedList[i][j] == "Die Black"){
										list_pred[1] =parsedList[i][j+1]
										disease_pointer = "Yes"
									}
									else if(parsedList[i][j] == "Gall Midge"){
										list_pred[2] =parsedList[i][j+1]
										disease_pointer = "Yes"
									}
									else if(parsedList[i][j] == "Healthy"){
										list_pred[3] =parsedList[i][j+1]
									}
									else if(parsedList[i][j] == "Powdery Mildew"){
										list_pred[4] =parsedList[i][j+1]
										disease_pointer = "Yes"
									}
									else if(parsedList[i][j] == "Sooty Mould"){
										list_pred[5] =parsedList[i][j+1]
										disease_pointer = "Yes"
									}
								}
								console.log( list_pred);
								const highestValue = Math.max(...list_pred);
								const highestIndex = list_pred.indexOf(highestValue);
								console.log(highestIndex)
								if(highestIndex == 3){
									jQuery_3_6_1(`#head${i+1}`).text(`For More Better Results`);
								}
								jQuery_3_6_1(`#cure${i+1}`).text(`${cure[highestIndex]}`);
								jQuery_3_6_1(`#name${i+1}`).text(`Image: ${parsedList[i][0]}`);
								jQuery_3_6_1(`#dis${i+1}`).text(`Disease Found: ${disease_pointer}`);
								chartcreate(list_pred,i+1);
						}
						 
						M.Toast.dismissAll();
						M.toast({ html: "Processing  Done.", classes: 'green rounded' });
						for (var w = filesToUpload.length - 1; w >= 0; w--) {
							delImage(w)
						}
						// var delayInMilliseconds = 1000; //1 second
						// console.log(result);
						// setTimeout(function () {
							// localStorage.setItem("user_id", firebase.auth().currentUser.uid);
							// window.location.href = 'main_page.html';
							

						// }, delayInMilliseconds);
						// var table_li =  data.responseText.split("+")
						// for(var k = 0; k < table_li.length;k++){
						// 	var insider = table_li[k].split("@")
						// 	if(table_li[k] == "" ){
						// 		continue;
						// 	}
						// 	if (insider[1] == "normal"){
						// 		jQuery_3_6_1("#tabledata").append(`<tr  class="text-center">
						// 				<td>${k+1}</td>
						// 				<td>${insider[0]}</td>
						// 				<td>no</td>
						// 				<td>${insider[1]}</td>
										
						// 				<td>${Math.round(insider[2] * 100) }%</td>
						// 				<td>${insider[3]}</td>
						// 			</tr>`)
						// 	}
						// 	else{
						// 		jQuery_3_6_1("#tabledata").append(`<tr  class="text-center">
						// 				<td>${k+1}</td>
						// 				<td>${insider[0]}</td>
						// 				<td>yes</td>
						// 				<td>${insider[1]}</td>
						// 				<td>${Math.round(insider[2] * 100) }%</td>
						// 				<td>${insider[3]}</td>
						// 			</tr>`)
						// 	}
							
						   
						// }
						
						
						var delayInMilliseconds = 2500; //1 second
						setTimeout(function () {
							M.Toast.dismissAll();
							document.getElementById("cen").style.display = "none";
							document.getElementById("report-card").style.display = "block";
							 
						// document.getElementById("pdf").style.visibility = "visible";
						// document.getElementById("csv").style.visibility = "visible";
					  
						  }, delayInMilliseconds);
						
					}
				})
			}
		}

		else {
			M.Toast.dismissAll();
			M.toast({ html: `Nothing to upload!!`, classes: 'orange rounded' });

		}
	})


});



function chartcreate(lst,i){
	var options2 = {

		series: [{
			name: 'Count',
			data: lst
		}],
		chart: {
			width:500,
			height: 300,
			type: 'bar',
			events: {
				click: function (chart, w, e) {
					// console.log(chart, w, e)
				}
			}
		},
	
		plotOptions: {
			bar: {
				columnWidth: '75%',
				distributed: true,
			}
		},
	
		dataLabels: {
			enabled: true
		},
		legend: {
			show: false
		},
		xaxis: {
			categories: [
				 
				['Anthracnose'],
				['Die','Black'],
				['Gall', 'Midge'],
				
				
				['Healthy'],
			[ "Powdery", "Mildew" ],
			["Sooty","Mould"]
	
	
			],
			labels: {
				style: {
	
					fontSize: '14px'
				}
			}
		}
	
	};
	
	var chart1 = new ApexCharts(document.querySelector(`#chart${i}`), options2);
	chart1.render();




}

