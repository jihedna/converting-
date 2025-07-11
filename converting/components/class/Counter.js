import React, { Component } from 'react';

class Counter extends Component {
  constructor(props) {
    super(props);
    // Initialize state
    this.state = {
      count: 0
    };
  }

  // Method to increment count
  increment = () => {
    this.setState((prevState) => ({
      count: prevState.count + 1
    }));
  }

  // Method to decrement count
  decrement = () => {
    this.setState((prevState) => ({
      count: prevState.count - 1
    }));
  }

  render() {
    return (
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <h1>Counter: {this.state.count}</h1>
        <button onClick={this.increment}>Increment</button>
        <button onClick={this.decrement} style={{ marginLeft: '10px' }}>Decrement</button>
      </div>
    );
  }
}

export default Counter;
