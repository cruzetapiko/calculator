import './styles.css';
import DigitButton from './DigitButton';
import OperationButton from './OperationButton';
import {useReducer} from 'react';



export const ACTIONS = {
  ADD_DIGIT: 'add-digit',
  CLEAR: 'clear',
  DELETE_DIGIT: 'delete-digit',
  CHOOSE_OPERATION: 'choose-operation',
  EQUALS: 'equals'
}

function reducer(state, {type, payload}) {
  switch (type) {
    case ACTIONS.ADD_DIGIT:
    
      if (payload.digit === '0' && state.currentOperand === '0') return state;
      if (payload.digit === '.' && state.currentOperand.includes('.')) return state;
      if (state.previousOperand === '' && state.currentOperand === '' && payload.digit === '.') return state;
      
      return {...state,currentOperand: `${state.currentOperand || ""}${payload.digit}`}

    case ACTIONS.DELETE_DIGIT:
      if (state.overwrite) {
        return {
          ...state, 
          overwrite: false,
          currentOperand: null
        }
      }
      if (state.currentOperand == null) return state;
      if (state.currentOperand.length === 1) {
      return {...state, currentOperand: null};
    }
      return {
        ...state, 
        currentOperand: state.currentOperand.slice(0, -1)
      }
    
    case ACTIONS.CHOOSE_OPERATION:
      if (state.currentOperand == null && state.previousOperand == null) {
        return state;
      } 

      if (state.currentOperand == null) {
        return {
          ...state,
          operation: payload.operation,
        };
        
      }

      if (state.previousOperand == null) {
        return {
          ...state,
          operation: payload.operation, 
          previousOperand: state.currentOperand,
          currentOperand: null,
         };
       }
  
      const computation = evaluate(state);
      return {
         ...state,
         operation: payload.operation,
         currentOperand: null,
         previousOperand: computation.toString(),
       };

    case ACTIONS.CLEAR:
      return {...state, currentOperand: '', previousOperand: '', operation: ''}

    case ACTIONS.EQUALS:
      if (state.currentOperand == null || 
          state.previousOperand == null ||
          state.operation == null
        ) {
        return state;
        }

      return {
        ...state,
        overwrite: true,
        previousOperand: null,
        operation: null,
        currentOperand: evaluate(state),
      } 
    }
}

function evaluate({ currentOperand, previousOperand, operation }) {
  const prev = parseFloat(previousOperand);
  const current = parseFloat(currentOperand);
  if (isNaN(prev) || isNaN(current)) return '';
  let computation = '';
  switch (operation) {
    case '+':
      computation = prev + current;
      break;
    case '-':
      computation = prev - current;
      break;
    case '*':
      computation = prev * current;
      break;
    case '÷':
      computation = prev / current;
      break;
  }
  return computation.toString();
}

const INTEGER_FORMATTER = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 });

function formatOperand(operand) {
  if (operand == null) return '';
  const [integer, fraction] = operand.split('.');
  if (fraction == null) return INTEGER_FORMATTER.format(integer);
  return `${INTEGER_FORMATTER.format(integer)}.${fraction}`;
}


function App() {
  const [{currentOperand, previousOperand, operation}, dispatch] = useReducer(reducer, {});
  
  return (
    <div className="calculator-grid">
      <div className="output">
        <div className="previous-operand">{formatOperand(previousOperand)} {operation}</div>
        <div className="current-operand">{formatOperand(currentOperand)}</div>
      </div>
      <button className="span-two" onClick={() => dispatch({ type: ACTIONS.CLEAR })  }>AC</button>
      <button onClick={() => dispatch({ type: ACTIONS.DELETE_DIGIT }) }>DEL</button>
      <OperationButton dispatch={dispatch} operation="÷" />
      <DigitButton dispatch={dispatch} digit="1" />
      <DigitButton dispatch={dispatch} digit="2" />
      <DigitButton dispatch={dispatch} digit="3" />
      <OperationButton dispatch={dispatch} operation="*" />
      <DigitButton dispatch={dispatch} digit="4" />
      <DigitButton dispatch={dispatch} digit="5" />
      <DigitButton dispatch={dispatch} digit="6" />
      <OperationButton dispatch={dispatch} operation="+" />
      <DigitButton dispatch={dispatch} digit="7" />
      <DigitButton dispatch={dispatch} digit="8" />
      <DigitButton dispatch={dispatch} digit="9" />
      <OperationButton dispatch={dispatch} operation="-" />
      <DigitButton dispatch={dispatch} digit="0" />
      <DigitButton dispatch={dispatch} digit="." />
      <button className='span-two' onClick={() => dispatch({ type: ACTIONS.EQUALS })  }>=</button>
    </div>
  );
}

export default App;
