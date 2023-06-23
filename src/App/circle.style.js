import styled from 'styled-components';

export const ParentContainer = styled.div`
  position: relative;
  width: 100%; /* Adjust as needed */
  height: 100%; /* Adjust as needed */
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const CenterCircle = styled.div`
  margin: auto;
  position: absolute;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: #2ecc71;
  justify-content: center;
  align-items: center;
  font-size: 18px;
  color: #fff;
  text-align: center;
  line-height: 50px;
  cursor: pointer;
  top: ${props => props.top ?? '50%'};
  left: ${props => props.left ?? '50%'};
  transform: translate(-50%, -50%);
`;



