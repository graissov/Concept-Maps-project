const objectCardTemplate = document.querySelector("[data-object-template]")
const objectCardContainer = document.querySelector("[data-object-cards-container]")
const searchInput = document.querySelector("[data-search]")
const searchwrapper = document.querySelector("[search-wrapper]")
const title = document.querySelector("[title]")

let objects = []
let allobjects = [];
let clickables = [];
let closeButton = null;	
let id = 1;

searchInput.addEventListener("input", e => {
  const value = e.target.value.toLowerCase()
  console.log(cards_to_display)
  cards_to_display.forEach(object => {
    const isVisible = object.title.toLowerCase().includes(value)
      object.element.classList.toggle("hide", !isVisible)
  })
})

function clicked(object){
	console.log(object.title)
	searchwrapper.classList.add("hide")
	objectCardContainer.classList.add("hide")
	title.textContent = "Showing a concept map from " + object.title + ". Click here to choose a difrent concept."
	title.addEventListener("click", ()=>location.reload())
	draw(objects,object)

}


fetch("http://127.0.0.1:5000/objects")
  .then(res => res.json())
  .then(data => {
	objects = data
    cards_to_display = data.map(object => {
      const card = objectCardTemplate.content.cloneNode(true).children[0]
      const header = card.querySelector("[data-header]")
      const body = card.querySelector("[data-body]")
      header.textContent = object.title
      objectCardContainer.append(card)
	  card.addEventListener("click", ()=>clicked(object))
      return { title: object.title, element: card}
    })})

  
  
//   document.getElementById('fetchDataBtn').addEventListener('click', () => {
// 	fetch("/objects?area=some_area")
// 	  .then(res => res.json())
// 	  .then(data => {
// 		// Process the retrieved JSON data
// 		console.log(data);
// 	  });
//   });
   
 
//connection throguh AJAX
	function loadDoc(callback) {
		console.log(1);
		const xhttp = new XMLHttpRequest();
		xhttp.open("GET", "http://127.0.0.1:5000/objects", true);
		xhttp.send();
		
		xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			const response = JSON.parse(this.responseText);
			callback(response);
		}
		};
	}
		

	//Function to get objects
	function getObjects() {
		objects = [
		{
				"id": 1,
			"parent_id": null,
				"title": "Main concept",
			"className": 'center-circle',
		},
		{
				"id": 2,
			"parent_id": 1,
				"title": "concept 1.1",
			"className": 'peripheral-circle',
		},
		{
				id: 3,
			parent_id: 1,
				title: "concept 1.2",
				className: 'peripheral-circle',
				div: null,
			},
		{
				id: 4,
			parent_id: 2,
				title: "concept 1.1.1",
				className: 'peripheral-circle',
				div: null,
			},
		{
				id: 5,
			parent_id: 2,
				title: "concept 1.1.2",
				className: 'peripheral-circle',
				div: null,
			},
		{
				id: 6,
			parent_id: 2,
				title: "concept 1.1.3",
				className: 'peripheral-circle',
				div: null,
			},
			{
				id: 7,
			parent_id: 3,
				title: "concept 1.2.1",
				className: 'peripheral-circle',
				div: null,
			},
			{
				id: 8,
			parent_id: 3,
				title: "concept 1.2.2",
				className: 'peripheral-circle',
				div: null,
			},
			{
			id: 9,
			parent_id: 3,
				title: "concept 1.2.3",
				className: 'peripheral-circle',
				div: null,
			},
			{
				id: 10,
				parent_id: 9,
					title: "concept 1.2.3.1",
					className: 'peripheral-circle',
					div: null,
				}    
		];

		return objects;
	}

	function draw(objects, selected_circle) {


		//creating the main circle
		const container = document.getElementById('container');
		const circle = document.createElement('div'); 

		const backToMainButton = document.createElement("button");
		backToMainButton.className = "backToMainButton";
		backToMainButton.innerText = "Back To Main";
		container.appendChild(backToMainButton);

		circle.objectState = selected_circle
		circle.id = id;
		id++;
		circle.innerText = selected_circle.title;
		circle.className = 'center-circle'; 
		circle.vector = [0,0];
		circle.style.top = container.offsetHeight / 2 - 50 + 'px';
		circle.style.left = container.offsetWidth / 2 - 50 + 'px';
		allobjects.push(circle);
		container.appendChild(circle);


		//creating subcircles of the main circle
		createCircles(circle,objects);

//styled-components
//emotion js
//data attrs

		//listen to clicks
		container.addEventListener("click", (e) => {
			const target = e.target;


			//if peripheral circle was clicked, remove the close button
			if (target.classList.contains("peripheral-circle") && clickables.includes(target)) 
			{
				if (closeButton!=null){
					closeButton.remove();
				}
				
				// // Show the pop-up with the concept's information
				// const concept = objects.find(obj => obj.id === parseInt(target.id));
				// showPopup(concept.title + ": " + concept.info);


				//create new circles
				createCircles(target,objects);
				extendLine(target);

				//create close button on the extended circle
				createCloseButton(target,target.id.split("-")[1]);


			//if close button
			} else if (target.classList.contains("closeButton")) 
			{
				//close
				handleCloseButtonClick(target);
			}
			else if (target.classList.contains("info-button")) 
			{
				showPopup(target);
			}
			else if (target.classList.contains("backToMainButton")) 
			{
				console.log("button click")
				backToMainMenu();
			}
		});


		// handling moving all objects on drag
		let isDragging = false;
		let prevX, prevY;


		window.addEventListener('mousedown', (event) => {
		isDragging = true;
		prevX = event.clientX;
		prevY = event.clientY;
		});


		window.addEventListener('mousemove', (event) => {
		if (isDragging) {
			const diffX = event.clientX - prevX;
			const diffY = event.clientY - prevY;


			// Update position of all objects
			allobjects.forEach((circle) => {
			circle.style["left"] = parseInt(circle.style.left)+ diffX+'px';
			circle.style["top"] = parseInt(circle.style.top)+ diffY+'px';
			});

			prevX = event.clientX;
			prevY = event.clientY;

		}
		});

		window.addEventListener('mouseup', () => {
			isDragging = false;
		});
	}


	//function to show the pop up with info
	function showPopup(infoButtonClicked) {

		
		target = infoButtonClicked.parentCircle;

		// Show the pop-up with the concept's information
		const concept = objects.find(obj => obj.id === parseInt(target.id));
		var title = concept.title + ": " + concept.info;	
		const popup = document.createElement('div');
		popup.className = 'popup';
		
		// Create a frame element
		const frame = document.createElement('div');
		frame.className = 'popup-frame';
		
		// Create a title element
		const popupTitle = document.createElement('h3');
		popupTitle.innerText = title;
		
		// Create a close button
		const closeButton = document.createElement('button');
		closeButton.innerText = 'Close';
		
		// Append the elements to the frame
		frame.appendChild(popupTitle);
		frame.appendChild(closeButton);
		
		// Append the frame to the pop-up
		popup.appendChild(frame);
		
		// Append the pop-up to the container
		const container = document.getElementById('container');
		container.appendChild(popup);
		
		// Add a click event listener to the close button to remove the pop-up
		closeButton.addEventListener('click', () => {
		popup.remove();
		
		// Make the concept map touchable again
		container.classList.remove('unclickable');
		});
		
		// Make the concept map untouchable while the pop-up is displayed
		container.classList.add('unclickable');
	}
	

	function backToMainMenu(){
		
		var allObjects = document.querySelectorAll('*');
		console.log(allObjects);
		classNamesToKeep = ["areas-container", "container"];
		for (var i = 0; i < classNamesToKeep.length; i++) 
		{
			var object = document.getElementById(classNamesToKeep[i]);

			while (object.firstChild) 
			{
				object.removeChild(object.firstChild);
			}
		}
		console.log(document.querySelectorAll('*'));
		
		
		init(1); 

		}


	//Function to create connecting lines
	function createLines(c1, c2) {
		const line = document.createElement("div");
		line.className = "line";

		console.log(c1);
		console.log(c2);
		x1 = parseInt(c1.style.left) + parseInt(c1.offsetWidth) / 2;
		x2 = parseInt(c2.style.left) + parseInt(c2.offsetWidth) / 2;
		y1 = parseInt(c1.style.top) + parseInt(c1.offsetWidth) / 2;
		y2 = parseInt(c2.style.top) + parseInt(c2.offsetWidth) / 2;
		console.log(x1, x2, y1, y2);
	
		const distance = Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
	
		slope_rad = Math.atan2(y1 - y2, x1 - x2);
		slope_deg = (slope_rad * 180) / Math.PI;
	
		xMid = (x1 + x2) / 2;
		yMid = (y1 + y2) / 2;
	
		line.style.width = distance + "px";
		line.style.top = yMid + "px";
		line.style.left = xMid - distance / 2 + "px";
		line.style.transform = "rotate(" + slope_deg + "deg)";
		// // Add the line to the DOM
		// document.body.appendChild(line);

		// // Animate the line
		// setTimeout(() => {
		//   line.style.width = distance + "px";
		//   line.style.top = x1 + distance + "px";
		// }, 10);
	
		// // Set transition duration
		// line.style.transition = "width 5s";
	
		return line;
	}
	

	//Function to create close button
	function createCloseButton(circle) {
		closeButton = document.createElement("div");
		closeButton.id = "closeButton";
		closeButton.className = "closeButton";
		closeButton.innerText = "X";
		closeButton.style.top = parseInt(circle.style.top)+ 5 + "px";
		closeButton.style.left = parseInt(circle.style.left) + "px";
		closeButton.parent = circle;
		// closeButton.setAttribute("data-parent", circle.id);
		container.appendChild(closeButton);
		allobjects.push(closeButton);
	}


	//Function To Handle clsoing 
	function handleCloseButtonClick(target){
		const targetCircle = target.parent;
		const targetLine = document.querySelector('[data-from="' + targetCircle.parent.id + '"][data-to="' + targetCircle.id + '"]');
		console.log("line", targetLine);
		// targetLine.setAttribute("style","display: block")
		targetCircle.style["left"] = parseInt(targetCircle.style.left) - 2*targetCircle.vector[0]+'px';
		targetCircle.style["top"] = parseInt(targetCircle.style.top) - 2*targetCircle.vector[1]+'px';
		const targetLines = document.querySelectorAll(`[data-from="${targetCircle.id}"]`);//, [data-to="${targetCircle.id}"]`);
		targetLines.forEach((line) => {
			line.remove();
		});
		console.log("here");
		const targetButtons = targetCircle.subcirclesHTML;
		console.log(targetButtons);
		targetButtons.forEach((button) => {
			button.remove();
		});
		closeButton.remove();
		if(targetCircle.parent.className!='center-circle'){
		createCloseButton(targetCircle.parent);
		}
		clickables = targetCircle.parent.subcirclesHTML;

	}


	//Function To Create and draw subcircles given a cricle
	function createCircles(circle,objects) {
		clickables = [];
		circle.style["left"] = parseInt(circle.style.left)+ 2*circle.vector[0]+'px';
		circle.style["top"] = parseInt(circle.style.top)+ 2*circle.vector[1]+'px';
		circle.subcirclesHTML = [];
		circle.subcirclesInfoButtons = [];


		// creating a list of shildren circles of given parent
		circle.subcircles = [];
		console.log("lalal",circle.objectState)
		console.log("lalal",circle.objectState.related_concepts)
		objects.forEach((child_object) => {
			circle.objectState.related_concepts.forEach((related_concept) => {
			if (related_concept == child_object.title)
			{
				console.log(circle.subcircles)
				circle.subcircles.push(child_object);
			}
		})});


		//circle.subcircles = rtelated concepts


		//creating div for each child
		n = circle.subcircles.length;
		for (let i = 0; i < n; i++) {

			//geometry
			const angle = (i / n) * Math.PI * 2;
			const x = Math.cos(angle) * 100 + parseInt(circle.style.left);
			const y = Math.sin(angle) * 100 + parseInt(circle.style.top);
			const peripheralCircle = document.createElement("div");
			peripheralCircle.vector = [
				Math.cos(angle) * 100,
				Math.sin(angle) * 100,
			];


			//creating circles
			peripheralCircle.id = id;
			id++;
			console.log("ID",circle.subcircles[i].id, circle.subcircles[i])
			peripheralCircle.objectState = circle.subcircles[i];
			peripheralCircle.className = "peripheral-circle";
			peripheralCircle.innerText = circle.subcircles[i].title;

			// Create the "info" button
			const infoButton = document.createElement("button");
			infoButton.className = "info-button";
			infoButton.innerText = "Info";
			infoButton.parentCircle = peripheralCircle;
		
			// Append the info button to the peripheral circle
			peripheralCircle.appendChild(infoButton);
		
			peripheralCircle.style.top = y + "px";
			peripheralCircle.style.left = x + "px";
			peripheralCircle.parent = circle;
			circle.appendChild(peripheralCircle);
			container.appendChild(peripheralCircle);

			// Append the peripheral circle to the container
			container.appendChild(peripheralCircle);

			
			allobjects.push(peripheralCircle);
			clickables.push(peripheralCircle);
			console.log('here',clickables);

			// Push the peripheral circle and info button to their respective arrays
			circle.subcirclesHTML.push(peripheralCircle);
			circle.subcirclesInfoButtons.push(infoButton);

			//creating and drawing lines
			const line = createLines(circle, peripheralCircle, objects);
			line.setAttribute("data-from", circle.id);
			line.setAttribute("data-to", peripheralCircle.id);
			circle.appendChild(line);
			container.insertBefore(line, circle);
			allobjects.push(line);

		}



	}


	//function to extend line on click
	// props:
	function extendLine(circle){
		//extend line connecting the passed circle with its parent
		console.log("not 1");
		if(circle.id!=1)
		{
			const targetLine = document.querySelector('[data-from="' + circle.parent.id + '"][data-to="' + circle.id + '"]');
			console.log(targetLine);
			// targetLine.setAttribute("style","display: none")
			console.log("here n");
			console.log(circle.id);
			const line = createLines(circle.parent, circle, objects);
			line.setAttribute("data-from", circle.id);
			line.setAttribute("data-to", circle.parent.id);
			circle.appendChild(line);
			container.insertBefore(line, circle.parent);
			allobjects.push(line);
		}
	}


	//Main
	// let objects = null;

	// loadDoc(function(response) {
	//   objects = response;
	//   allobjects = [];
	//   clickables = [];
	//   closeButton = null;
	
	//   draw(objects)
	// });



	function loadAreas() {
		const xhttp = new XMLHttpRequest();
		xhttp.open("GET", "http://127.0.0.1:5000/areas", true);
		xhttp.send();
		console.log("here werfdfwe");
		xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			console.log("here in if");
			const areas = JSON.parse(this.responseText);
			showAreas(areas);
		}
		};
	}
	
	function showAreas(areas) {
		// Get the areas container element
		const areasContainer = document.getElementById('areas-container');
	
		// Display the areas container
		areasContainer.style.display = 'block';
	
		// Create a new unordered list element
		var areasList = document.getElementById('areasList');
		console.log(">>>",areasList);
		if(areasList===null)
		{
			console.log("yes");
			areasList = document.createElement('ul');
			console.log(areasList);
		}
		// Append the list to the areas container
		areasContainer.appendChild(areasList);
	
		// Iterate over each area
		areas.forEach(area => {
		// Create a new list item for each area
		const areaItem = document.createElement('li');
		areaItem.innerText = area;
	
		// Append the list item to the areas list
		areasList.appendChild(areaItem);
	
		// Add a click event listener to the area item
		areaItem.addEventListener('click', () => {
			// Call the loadObjects function with the selected area
	
			// // Remove all list items from the areas list
			while (areasList.firstChild) {
			areasList.removeChild(areasList.firstChild);
			}
	
			// // Remove the areas list from its parent node
			// areasList.parentNode.removeChild(areasList);
	
			// Hide the areas container
			areasContainer.style.display = 'none';

			loadObjects(area);
		});
		});

	}
	
	function loadObjects(area) {
		const xhttp = new XMLHttpRequest();
		console.log("aaaaaaaaaa", `http://127.0.0.1:5000/objects?area=${encodeURIComponent(area)}`)
		xhttp.open("GET", `http://127.0.0.1:5000/objects?area=${encodeURIComponent(area)}`, true);
		xhttp.send();
	
		xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			objects = JSON.parse(this.responseText);
			draw(objects);
		}
		};
	}
	
	function init(call) {
		console.log(call);
		allobjects = [];
		clickables = [];
		closeButton = null;	
		loadAreas();
	}
	
	// init(0);