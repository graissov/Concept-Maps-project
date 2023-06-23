import React, { useState, useEffect } from 'react';
import {ParentContainer, CenterCircle} from './circle.style.js';



export const App = () => {
  const [objects, setObjects] = useState([]);
  const [cardsToDisplay, setCardsToDisplay] = useState([]);
  const [clickables, setClickables] = useState([]);
  const [closeButton, setCloseButton] = useState(null);
  const [id, setId] = useState(1);
  const [visible, setVisible] = useState(true);
  const [clickedObject, setClickedObject] = useState(null);
  const [divToRender, setDivToRender] = useState(null);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/objects")
      .then((res) => res.json())
      .then((data) => {
        let objectsList = [];
        const cards = data.map((object) => {
          objectsList.push(object);
          return {
            title: object.title,
            visible: true, // Add visible property
            element: (
              <Card
                key={object.id}
                title={object.title}
                onClick={() => clicked(object)}
              />
            ),
          };
        });
        // console.log(objectsList);
        setObjects(objectsList);
        setCardsToDisplay(cards);
      })
      .then(() => {
      });
  }, [objects]);

  const searchInputChangeHandler = (e) => {
    const value = e.target.value.toLowerCase();
    const updatedCards = cardsToDisplay.map(card => {
      const isVisible = card.title.toLowerCase().includes(value);
      return {
        ...card,
        visible: isVisible, // Update visibility
      };
    });
    setCardsToDisplay(updatedCards);
  };

  const clicked = (object) => {
    setClickedObject(object);
    setVisible(false);
    setCardsToDisplay([]);
    setDivToRender(<ConceptMap object={object} allobjects={objects}/>)//(<Circle object={object}/>);
    };


  // Rest of the App component code...

  return (
    <div>
      {visible && <Input onChange={searchInputChangeHandler}/>}
      {divToRender}
      <div id="container">
        {visible && cardsToDisplay.map(card => card.visible && card.element)}
      </div>
    </div>
  );
};

const Input = (props) => {
  return (
    <input
        type="text"
        onChange={props.onChange}
        placeholder="Search"
    />
  );
};


const Card = ({ title, onClick }) => {
  return (
    <div onClick={onClick}>
      <h2>{title}</h2>
    </div>
  );
};

const ConceptMap = ({ object, allobjects }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [prevX, setPrevX] = useState(0);
  const [prevY, setPrevY] = useState(0);
  const [divPosition, setDivPosition] = useState({ left: 0, top: 0 });
  const [childCircles, setChildCircles] = useState([]);

  useEffect(() => {
    let childrenList = [];

    console.log("OHRIIUNSD",allobjects)
    allobjects.forEach((child_object) => {
      object.related_concepts.forEach((related_concept) => {
        if (related_concept === child_object.title) {
          childrenList.push(child_object);
        }
      });
    });
    console.log("childrenList",childrenList);

		let n = childrenList.length;
    let updatedList = [];
		for (let i = 0; i < n; i++) {

			//geometry
			const angle = (i / n) * Math.PI * 2;
			const x = Math.round(Math.cos(angle) * 100) + parseInt(divPosition.left);
			const y = Math.round(Math.sin(angle) * 100) + parseInt(divPosition.top);
			const peripheralCircle = document.createElement("div");
			peripheralCircle.vector = [
				Math.cos(angle) * 100,
				Math.sin(angle) * 100,
			];

      childrenList[i].x = x + parseInt(divPosition.left);
      childrenList[i].y = y + parseInt(divPosition.top);
      updatedList.push(childrenList[i])
      console.log(i, childrenList[i].x, childrenList[i].y)
  

		}
    setChildCircles(updatedList);
    console.log("aaaaaaaaaaaaaaaaaaaaaaa",childCircles);
  },[]);

  const handleMouseDown = (event) => {
    setIsDragging(true);
    setPrevX(event.clientX);
    setPrevY(event.clientY);
  };

  const handleMouseMove = (event) => {
    if (isDragging) {
      const diffX = event.clientX - prevX;
      const diffY = event.clientY - prevY;

      setDivPosition((prevPosition) => ({
        left: prevPosition.left + diffX,
        top: prevPosition.top + diffY,
      }));

      setPrevX(event.clientX);
      setPrevY(event.clientY);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    > 
      <div
        style={{
          position: 'absolute',
          left: divPosition.left + 'px',
          top: divPosition.top + 'px',
        }}
      >
        <Circle object={object} />
        {childCircles.map(object => <Circle object={object}/>)}
      </div>
    </div>
  );
};

const Circle = ({ object, x, y }) => {
  console.log("render",object.y, object.x)
  return (
    <ParentContainer>
      <CenterCircle top={object.y} left={object.x}>
        {object.title}
      </CenterCircle>
    </ParentContainer>
  );
}




