import React, { Component } from 'react';

class FormInput extends Component {
  constructor(props) {
    super(props);
    this.state = { inputValue: '' };
  }

  handleChange = (e) => {
    this.setState({ inputValue: e.target.value });
  }

  render() {
    return (
      <div>
        <input type="text" onChange={this.handleChange} />
        <p>You typed: {this.state.inputValue}</p>
      </div>
    );
  }
}

export default FormInput;
