//Function to get objects
function getObjects() {
	objects = [
  	{
    		id: 1,
        parent_id: null,
    		title: "Main concept",
		className: 'center-circle',
		div: null,
    },
    {
    		id: 2,
        parent_id: 1,
    		title: "concept 1.1",
		className: 'peripheral-circle',
		div: null,
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
		}
    
  ];

	return objects;
}


//Function to create html objects
function draw(objects) {


	//creating the main circle
	const container = document.getElementById('container');
    const circle = document.createElement('div'); 
    circle.id = objects[0].id;
	circle.innerText = objects[0].title;
	circle.className = 'center-circle'; 
    circle.vector = [0,0];
    circle.style.top = container.offsetHeight / 2 - 50 + 'px';
    circle.style.left = container.offsetWidth / 2 - 50 + 'px';
    allobjects.push(circle);
    container.appendChild(circle);


	//creating subcircles of the main circle
    createCircles(circle,objects);


	//listen to clicks
    container.addEventListener("click", (e) => {
        const target = e.target;


		//if peripheral circle was clicked, remove the close button
        if (target.classList.contains("peripheral-circle") && clickables.includes(target)) 
		{
			if (closeButton!=null){
				closeButton.remove();
			}

			console.log('oooo')
			//create new circles
			createCircles(target,objects);
			console.log(target)
			extendLine(target);

			//create close button on the extended circle
			createCloseButton(target,target.id.split("-")[1]);


		//if close button
        } else if (target.classList.contains("closeButton")) 
		{
			//close
            handleCloseButtonClick(target);
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
		console.log(diffX ,diffY)


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
	targetCircle.style["left"] = parseInt(targetCircle.style.left)- 2*targetCircle.vector[0]+'px';
	targetCircle.style["top"] = parseInt(targetCircle.style.top)- 2*targetCircle.vector[1]+'px';
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


	// creating a list of shildren circles of given parent
	circle.subcircles = [];
	objects.forEach((child_object) => {
		if (circle.id == child_object.parent_id)
		{
			circle.subcircles.push(child_object);
		}
	});


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
		peripheralCircle.id = circle.subcircles[i].id;
		peripheralCircle.className = "peripheral-circle";
		peripheralCircle.innerText = circle.subcircles[i].title;
		peripheralCircle.style.top = y + "px";
		peripheralCircle.style.left = x + "px";
		peripheralCircle.parent = circle;
		circle.appendChild(peripheralCircle);
		container.appendChild(peripheralCircle);
		circle.subcirclesHTML.push(peripheralCircle);
		allobjects.push(peripheralCircle);
		clickables.push(peripheralCircle);
		console.log('here',clickables);
		circle.subcirclesHTML.push(peripheralCircle);


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
function extendLine(circle){
	//extend line connecting the passed circle with its parent
	console.log("not 1");
	if(circle.id!=1)
	{
		console.log("here n")
		console.log(circle.id);
		const line = createLines(circle.parent, circle, objects);
		line.setAttribute("data-from", circle.id);
		line.setAttribute("data-to", circle.parent_id);
		circle.appendChild(line);
		container.insertBefore(line, circle.parent);
		allobjects.push(line);
	}
}

//Main
objects = getObjects();
allobjects = [];
clickables = [];
closeButton = null;
draw(objects)
