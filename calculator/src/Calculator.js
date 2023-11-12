import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import './Calculator.css';
import { add, subtract, multiply, divide, reset } from './store/actions';

const Calculator = () => {
  const result = useSelector((state) => state.result);
  const dispatch = useDispatch();

  const [inputValue, setInputValue] = useState('');
  const [operatorValue, setOperatorValue] = useState('');

  const handleOperation = () => {
    const value = parseFloat(inputValue);
    if (!isNaN(value)) {
      switch (operatorValue) {
        case '+':
          dispatch(add(value));
          break;
        case '−':
          dispatch(subtract(value));
          break;
        case '×':
          dispatch(multiply(value));
          break;
        case '÷':
          dispatch(divide(value));
          break;
        default:
          break;
      }
      setInputValue('');
      setOperatorValue('');
    }
  };

  const handleReset = () => {
    dispatch(reset());
    setInputValue('');
    setOperatorValue('');
  }

  return (
    <div className='calculator'>
      <input
        type='text'
        className='number-field result-field'
        value={result}
        readOnly
      />
      <div className='display-operator'>{operatorValue}</div>
      <input
        type='text'
        className='number-field input-field'
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      <div className='button-grid'>
        <button className='button number' onClick={() => setInputValue(inputValue + '7')}>7</button>
        <button className='button number' onClick={() => setInputValue(inputValue + '8')}>8</button>
        <button className='button number' onClick={() => setInputValue(inputValue + '9')}>9</button>
        <button className='button operator' onClick={() => setOperatorValue('÷')}>÷</button>
        
        <button className='button number' onClick={() => setInputValue(inputValue + '4')}>4</button>
        <button className='button number' onClick={() => setInputValue(inputValue + '5')}>5</button>
        <button className='button number' onClick={() => setInputValue(inputValue + '6')}>6</button>
        <button className='button operator' onClick={() => setOperatorValue('×')}>×</button>
        
        <button className='button number' onClick={() => setInputValue(inputValue + '1')}>1</button>
        <button className='button number' onClick={() => setInputValue(inputValue + '2')}>2</button>
        <button className='button number' onClick={() => setInputValue(inputValue + '3')}>3</button>
        <button className='button operator' onClick={() => setOperatorValue('−')}>−</button>
        
        <button className='button reset' onClick={handleReset}>R</button>
        <button className='button number' onClick={() => setInputValue(inputValue + '0')}>0</button>
        <button className='button number' onClick={() => setInputValue(inputValue + '.')}>.</button>
        <button className='button operator' onClick={() => setOperatorValue('+')}>+</button>
        
        <button className='button equal' onClick={() => handleOperation()}>=</button>
      </div>
    </div>
  );

};

export default Calculator;
