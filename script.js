function getobjects(){
	objects = [];
	return [];
}

function createLines(c1, c2) {
	const line = document.createElement("div");
	line.className = "line";
  
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
  
  let idCounter = 1;
  allobjects = [];
  clickables = [];
  closeButton = null;
  
  function close() {
	const peripheralCircles = parentCircle.querySelectorAll(".peripheral-circle");
	peripheralCircles.forEach((circle) => circle.remove());
  
	clickables = [];
	parentCircle.removeChild(closeButton);
  }
  
  function createCloseButton(circle, id) {
	closeButton = document.createElement("div");
	closeButton.id = "closeButton-" + id;
	closeButton.className = "closeButton";
	closeButton.innerText = "X";
	closeButton.style.top = parseInt(circle.style.top)+ 5 + "px";
	closeButton.style.left = parseInt(circle.style.left) + "px";
	closeButton.setAttribute("data-parent", circle.id);
	container.appendChild(closeButton);
	allobjects.push(closeButton);
  }

  function handleCloseButtonClick(target){
    const targetId = target.id.split("-")[1];
    const targetCircle = document.getElementById(`circle-${targetId}`);
	targetCircle.style["left"] = parseInt(targetCircle.style.left)- 2*targetCircle.vector[0]+'px';
	targetCircle.style["top"] = parseInt(targetCircle.style.top)- 2*targetCircle.vector[1]+'px';
    const targetLines = document.querySelectorAll(`[data-from="${targetCircle.id}"]`);//, [data-to="${targetCircle.id}"]`);
    targetLines.forEach((line) => {
        line.remove();
    });
	console.log("here");
    const targetButtons = targetCircle.subcircles;
	console.log(targetButtons);
    targetButtons.forEach((button) => {
        button.remove();
    });
    // const index = allobjects.indexOf(targetCircle);
    // if (index > -1) {
    //     allobjects.splice(index, 1);
    // }
	closeButton.remove();
	if(targetCircle.parent.className!='center-circle'){
	createCloseButton(targetCircle.parent, targetCircle.parent.id.split("-")[1]);
	}
	clickables = targetCircle.parent.subcircles;

}

function createCircles(circle, n) {
	clickables = [];
	circle.style["left"] = parseInt(circle.style.left)+ 2*circle.vector[0]+'px';
	circle.style["top"] = parseInt(circle.style.top)+ 2*circle.vector[1]+'px';
	circle.subcircles = [];
	for (let i = 0; i < n; i++) {
	  const angle = (i / n) * Math.PI * 2;
	  const x = Math.cos(angle) * 100 + parseInt(circle.style.left);
	  const y = Math.sin(angle) * 100 + parseInt(circle.style.top);
	  const peripheralCircle = document.createElement("div");
	  peripheralCircle.vector = [
		Math.cos(angle) * 100,
		Math.sin(angle) * 100,
	  ];
	  peripheralCircle.id = "circle-" + idCounter++;//allobjects[i].id
	  peripheralCircle.className = "peripheral-circle";
	  peripheralCircle.innerText = "Concept";//allobjects[i].title
	  peripheralCircle.style.top = y + "px";
	  peripheralCircle.style.left = x + "px";
	  circle.appendChild(peripheralCircle);
	  container.appendChild(peripheralCircle);
	  allobjects.push(peripheralCircle);
	  clickables.push(peripheralCircle);
	  console.log('here',clickables);
	  circle.subcircles.push(peripheralCircle);
	  peripheralCircle.parent = circle;
	  const line = createLines(peripheralCircle, circle);
	  line.setAttribute("data-from", circle.id);
	  line.setAttribute("data-to", peripheralCircle.id);
	  circle.appendChild(line);
	  container.insertBefore(line, circle);
	  allobjects.push(line);
	}
	if(circle.className!='center-circle'){
	const line = createLines(circle.parent, circle);
	line.setAttribute("data-from", circle.id);
	line.setAttribute("data-to", circle.parent.id);
	circle.appendChild(line);
	container.insertBefore(line, circle.parent);
	allobjects.push(line);
	}
  }

document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('container');
    const circle = document.createElement('div'); 
    circle.id = 'circle-' + idCounter++;
    circle.className = 'center-circle';
    circle.innerText = 'Concept';
    circle.vector = [0,0];
    circle.style.top = container.offsetHeight / 2 - 50 + 'px';
    circle.style.left = container.offsetWidth / 2 - 50 + 'px';
    allobjects.push(circle);

    container.appendChild(circle);

	//n=len(list)
    createCircles(circle, 6);

    container.addEventListener("click", (e) => {
        const target = e.target;
        if (target.classList.contains("peripheral-circle") && clickables.includes(target)) {
			if (closeButton!=null){
			closeButton.remove();
			}
            createCircles(target,5);
            createCloseButton(target,target.id.split("-")[1]);
        } else if (target.classList.contains("closeButton")) {
            handleCloseButtonClick(target);
        }
    });
});


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
    //   const objRect = obj.getBoundingClientRect();
    //   obj.style['left'] = `${objRect.left + diffX}px`;
    //   obj.style.top = `${objRect.top + diffY}px`;
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





