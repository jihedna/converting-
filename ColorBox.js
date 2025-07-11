import React, { Component } from 'react';

class ColorBox extends Component {
  constructor(props) {
    super(props);
    this.state = { color: 'lightblue' };
  }

  changeColor = () => {
    const colors = ['lightblue', 'lightgreen', 'lightcoral', 'lightgoldenrodyellow'];
    const random = colors[Math.floor(Math.random() * colors.length)];
    this.setState({ color: random });
  }

  render() {
    return (
      <div style={{ backgroundColor: this.state.color, padding: '20px' }}>
        <button onClick={this.changeColor}>Change Color</button>
      </div>
    );
  }
}

export default ColorBox;
