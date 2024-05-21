import React, { useState, useEffect } from 'react';
import './style.css';
import {ParentContainer, CenterCircle, CenterText, Line} from './circle.style.js';



export const App = () => {
  console.log('asdf')
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
        console.log("data",data)
        const objectsList = data.map((object) => object);
        setObjects(objectsList);
        
        const cards = objectsList
        .filter(object => object.parent_id !== 1)
        .map(object => ({
          title: object.title,
          visible: true,
          element: (
            <Card
              key={object.id}
              title={object.title}
              onClick={() => clicked(object)}
            />
          ),
        }));
      
        setCardsToDisplay(cards);
      })
      .catch((error) => {
        console.error('Error fetching objects:', error);
      });
  }, []);
  
  const searchInputChangeHandler = (e) => {
    const value = e.target.value.toLowerCase();
    const updatedCards = cardsToDisplay.map(card => {
      const isVisible = card.title.toLowerCase().includes(value);
      console.log(isVisible)
      return {
        ...card,
        visible: isVisible, 
      };
    });
    console.log("here");
    setCardsToDisplay(updatedCards);
    console.log(updatedCards)
  };

  const clicked = (object) => {
    setVisible(false);
    setCardsToDisplay([]);
    object.x = 0;
    object.y = 0;
    object.first = true;
    object.isCenter = true;
    setClickedObject(object);
    console.log(objects);
    
    };

    useEffect(() => {
      if(clickedObject){
        setDivToRender(<ConceptMap object={clickedObject} allobjects={objects}/>)
      }
      
      console.log(objects,clickedObject,'lol'); 
    }, [objects, clickedObject]);
    
  

  return (
    <div style={{ 
      width: '100%', 
      minHeight: '100vh',
      backgroundColor: '#0BAEDB',

       }}>
      {visible && <Input onChange={searchInputChangeHandler}/>}
      {divToRender}
      {visible && cardsToDisplay.some(card => card.visible) ? (
      cardsToDisplay.map(card => card.visible && card.element)
      ) : ( visible && 
        <div style={{
          width: '45%',
          margin: '10px auto',
          border: '1px solid #ddd',
          borderRadius: '5px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
          backgroundColor: '#FFBAD0',
          padding: '.5rem',
          fontFamily: "'Poppins', sans-serif",
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <p>No such concept</p>
        </div>      )}   
    </div>
  );
};

const Input = (props) => {
  return (
    <div style={{ paddingTop: '2vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <h1 style={{ height: '50px', fontFamily: "'Poppins', sans-serif", marginBottom: '10px' }}>Concept Maps</h1>
      <input
        type="text"
        className="search-bar__input"
        style={{
          alignItems: 'center',
          width: '50%',
          height: '50px',
          paddingLeft: '0px',
          color: 'blue',
          fontSize: '1rem',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
          border: '1px solid #ddd',
          borderRadius: '50px',
          outline: 'none',
          textIndent: '30px',
          fontFamily: "'Poppins', sans-serif",
        }}
        onChange={props.onChange}
        placeholder="Start typing the concept name"
      />
    </div>
  );
};




const Card = ({ title, onClick }) => {
  return (
    <div className='card' onClick={onClick} style={{
      width: '45%',
      margin: '10px auto',
      border: '1px solid #ddd',
      borderRadius: '5px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
      backgroundColor: 'white',
      padding: '.5rem',
      fontFamily: "'Poppins', sans-serif",
      display: 'flex', justifyContent: 'center', alignItems: 'center' 
          }}>
      <h2 className='header'>{title}</h2>
    </div>
  );
};

const ConceptMap = ({ object, allobjects }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [prevX, setPrevX] = useState(0);
  const [prevY, setPrevY] = useState(0);
  const [divPosition, setDivPosition] = useState({ left: 0, top: 0 });

  useEffect(() => {
    
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const componentWidth = 0; 
    const componentHeight = 0; 
  
    const left = (screenWidth - componentWidth) / 2;
    const top = (screenHeight - componentHeight) / 2;
  
    setDivPosition({ left, top });
  }, []);

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
    position: 'relative',
    left: divPosition.left + 'px',
    top: divPosition.top + 'px',
    width: '400px',
    height: '600px',
  }}
>

        <Circle object={object} />
        <Main object = {object} allobjects={allobjects}/>
      </div>
    </div>
  );
};

const Main = ({ object, allobjects, circlestorender=[], revert}) => {
  const [childCircles, setChildCircles] = useState([]);
  const [renderNext,setRenderNext] = useState(false);
  const [nextNode,setNextNode] = useState(null);
  const [allRenderedCircles,setAllRenderedCircles] = useState(circlestorender);

  useEffect(() => {
    object.isCenter = true;
    let childrenList = [];
    allobjects.forEach((child_object) => {
      object.related_concepts.forEach((related_concept) => {
        if (related_concept === child_object.title) {
          const copiedObject = Object.assign({}, child_object);
          copiedObject.parent = object;
          copiedObject.isCenter = false;
          childrenList.push(copiedObject);
        }
      });
    });


		let n = childrenList.length;
    let updatedList = [];
    let angle = 0;
		for (let i = 0; i < n; i++) {
			
      if (object.parent){     
      if (i===0) {angle = calculateAngle(object)-(1 / (n)) * Math.PI}
      else {angle = angle + (1 / (n)) * Math.PI * 2;}
      }
      else{

      angle = (i / n) * Math.PI * 2;
      }
      let dist = 190
			const x = Math.round(Math.cos(angle) * dist) + object.x;
			const y = Math.round(Math.sin(angle) * dist) + object.y;
      childrenList[i].x = x ;
      childrenList[i].y = y ;
      childrenList[i].active = true ;
      childrenList[i].vector = [
				Math.cos(angle) * dist,
				Math.sin(angle) * dist,
			];
      updatedList.push(childrenList[i])
		}

    setChildCircles(updatedList);
  },[]);

  useEffect(() => {
    setAllRenderedCircles(prevAllRenderedCircles => [...prevAllRenderedCircles, ...childCircles]);
  }, [childCircles]);

  const doNotRender = () => {
    setNextNode(null);
  }



  const calculateAngle = (object) => {
  
    const dotProduct = object.vector[0] * (-1) + object.vector[1] * 0;
    const magnitude1 = Math.sqrt(object.vector[0] ** 2 + object.vector[1] ** 2);
    const magnitude2 = Math.sqrt(1);

    const cosAngle = dotProduct / (magnitude1 * magnitude2);
    let angleInRadians = Math.acos(cosAngle);
    if(object.vector[1]>0){
      angleInRadians = -1 * Math.acos(cosAngle);
    }
    return angleInRadians;
  };



  
  const clicked = (objectClicked) => {
    if(objectClicked===object)
    {
      object.x -= 2*object.vector[0];
      object.y -= 2*object.vector[1];
      object.isCenter = false;
      revert();

    }
    else if(childCircles.includes(objectClicked))
    {
      objectClicked.isCenter = true;
      objectClicked.x += 2*objectClicked.vector[0];
      objectClicked.y += 2*objectClicked.vector[1];
      setNextNode(objectClicked);
      setRenderNext(true);
    }
    };

  return(
    <div>
    {allRenderedCircles.map(objecttorender => <Circle object={objecttorender} onclick={() => clicked(objecttorender)}/>)}
    {nextNode && <Main object={nextNode} allobjects={allobjects} circlestorender={allRenderedCircles} revert={doNotRender}/>}
    </div>
    )
;

}

const Circle = ({ object, onclick }) => {
  const [distance, setDistance] = useState(0);
  const [xMid, setXMid] = useState(0);
  const [yMid, setYMid] = useState(0);
  const [slope_deg, setSlope_deg] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [isShown, setIsShown] = useState(false);

  const showPopup = () => {
    setIsOpen(true);
  };

  const showModul = () => {
    setIsShown(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };


  useEffect(() => {

  if(object.parent){
  
  let c1 = object.parent;
  let c2 = object;
  let x1 = parseInt(c1.x);
  let x2 = parseInt(c2.x);
  let y1 = parseInt(c1.y);
  let y2 = parseInt(c2.y);

  const distance = Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));

  let slope_rad = Math.atan2(y1 - y2, x1 - x2);
  let slope_deg = (slope_rad * 180) / Math.PI;

  let xMid = (x1 + x2) / 2;
  let yMid = (y1 + y2) / 2;
  setDistance(distance);
  setXMid(xMid);
  setYMid(yMid);
  setSlope_deg(slope_deg);
  }
},[]);

function handleTextClick(event) {
  event.stopPropagation(); 
}

return (
  <div>
    {isShown && <Modal startOpen={isShown}/>}
    {object.parent && <Line distance={distance} yMid={yMid} xMid={xMid} slopeDeg={slope_deg} />}
    <CenterCircle onClick={onclick} top={`${object.y}px`} left={`${object.x}px`} center = {object.isCenter}>  
      {object.isCenter ? (
        <CenterText
          vector={[0, -100]}
          onMouseEnter={showPopup}
          onMouseLeave={closeModal}
          onClick={handleTextClick} 
        >
          {object.title}
          {isOpen && <button onClick={showModul} className="infobtn">Learn More</button>

}
        </CenterText>
      ) : (
        <CenterText
          vector={object.vector}
          onMouseEnter={showPopup}
          onMouseLeave={closeModal}
          onClick={handleTextClick} 
        >
          {object.title}
          {isOpen &&       <button onClick={showModul}className="infobtn">Learn More</button>
}
        </CenterText>
      )}
    </CenterCircle>
  </div>
);


}



const Modal = (startOpen) => {
  const [isOpen, setIsOpen] = useState(startOpen);

  const showPopup = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <div>

      {isOpen && (
        <>
          <div className="modal active" id="modal">
            <div className="modal-header">
              <div className="title">Learn More</div>
              <button
                className="close-button"
                onClick={closeModal}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <p>
                Information about the selected concept
              </p>
            </div>
          </div>

          <div
            className="overlay active"
            id="overlay"
            onClick={closeModal}
          ></div>
        </>
      )}
    </div>
  );
};

export default Modal;

