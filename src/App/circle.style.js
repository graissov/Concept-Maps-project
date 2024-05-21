import styled from 'styled-components';

export const ParentContainer = styled.div`
  position: relative;
  width: 100%; 
  height: 100%; 
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const CenterCircle = styled.div`
  margin: auto;
  position: absolute;
	box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  width: ${props => (props.center ? '70px' : '40px')};
  height: ${props => (props.center ? '70px' : '40px')};
  border-radius: 50%;
  background-color: #2ecc71;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  top: ${props => props.top ?? '50%'};
  left: ${props => props.left ?? '50%'};
  transform: translate(-50%, -50%);
`;




export const CenterText = styled.div`
  font-size: 18px;
  color: #FFFFB4;
  width: auto; 
  white-space: nowrap; 
  text-align: center;
  line-height: 50px;
  font-family: 'Poppins', sans-serif;
  transform: translate(
    ${props => (props.vector ? `${props.vector[0]*0.7}px` : '0')},
    ${props => (props.vector ? `${props.vector[1]*0.5}px` : '0')}
  );
`;





export const Line = styled.div`
  position: absolute;
  background-color: black;
  height: 2px;
  width: ${(props) => props.distance}px;
  top: ${(props) => props.yMid}px;
  left: ${(props) => props.xMid - props.distance / 2}px;
  transform: rotate(${(props) => props.slopeDeg}deg);
  z-index: -1;
`;




