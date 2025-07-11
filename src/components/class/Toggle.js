import React, { Component } from 'react';

class Toggle extends Component {
  constructor(props) {
    super(props);
    this.state = { isOn: true };
  }

  toggle = () => {
    this.setState(prev => ({ isOn: !prev.isOn }));
  }

  render() {
    return (
      <button onClick={this.toggle}>
        {this.state.isOn ? 'ON' : 'OFF'}
      </button>
    );
  }
}

export default Toggle;
