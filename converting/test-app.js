import React from 'react';
import ReactDOM from 'react-dom';

// Import all functional components
import Counter from './Counter-functional';
import Clock from './Clock-functional';
import Toggle from './Toggle-functional';
import FetchUser from './FetchUser-functional';
import ColorBox from './ColorBox-functional';
import FormInput from './FormInput-functional';
import ImageToggle from './ImageToggle-functional';
import Message from './Message-functional';
import ListDisplay from './ListDisplay-functional';

function App() {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h1>React Functional Components Test</h1>
      
      <div style={{ marginBottom: '30px', padding: '20px', border: '1px solid #ddd', borderRadius: '5px' }}>
        <h2>Counter Component</h2>
        <Counter />
      </div>
      
      <div style={{ marginBottom: '30px', padding: '20px', border: '1px solid #ddd', borderRadius: '5px' }}>
        <h2>Clock Component</h2>
        <Clock />
      </div>
      
      <div style={{ marginBottom: '30px', padding: '20px', border: '1px solid #ddd', borderRadius: '5px' }}>
        <h2>Toggle Component</h2>
        <Toggle />
      </div>
      
      <div style={{ marginBottom: '30px', padding: '20px', border: '1px solid #ddd', borderRadius: '5px' }}>
        <h2>FetchUser Component</h2>
        <FetchUser />
      </div>
      
      <div style={{ marginBottom: '30px', padding: '20px', border: '1px solid #ddd', borderRadius: '5px' }}>
        <h2>ColorBox Component</h2>
        <ColorBox />
      </div>
      
      <div style={{ marginBottom: '30px', padding: '20px', border: '1px solid #ddd', borderRadius: '5px' }}>
        <h2>FormInput Component</h2>
        <FormInput />
      </div>
      
      <div style={{ marginBottom: '30px', padding: '20px', border: '1px solid #ddd', borderRadius: '5px' }}>
        <h2>ImageToggle Component</h2>
        <ImageToggle />
      </div>
      
      <div style={{ marginBottom: '30px', padding: '20px', border: '1px solid #ddd', borderRadius: '5px' }}>
        <h2>Message Component</h2>
        <Message />
      </div>
      
      <div style={{ marginBottom: '30px', padding: '20px', border: '1px solid #ddd', borderRadius: '5px' }}>
        <h2>ListDisplay Component</h2>
        <ListDisplay />
      </div>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));
