import React, { Component } from 'react';

class ListDisplay extends Component {
  render() {
    const items = ['Apple', 'Banana', 'Cherry'];
    return (
      <ul>
        {items.map((item, i) => <li key={i}>{item}</li>)}
      </ul>
    );
  }
}

export default ListDisplay;
