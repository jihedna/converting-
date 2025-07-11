import React, { Component } from 'react';

class ImageToggle extends Component {
  constructor(props) {
    super(props);
    this.state = { showFirst: true };
  }

  toggleImage = () => {
    this.setState(prev => ({ showFirst: !prev.showFirst }));
  }

  render() {
    const img1 = "https://via.placeholder.com/150/0000FF";
    const img2 = "https://via.placeholder.com/150/FF0000";

    return (
      <div>
        <img src={this.state.showFirst ? img1 : img2} alt="Toggle" />
        <br />
        <button onClick={this.toggleImage}>Toggle Image</button>
      </div>
    );
  }
}

export default ImageToggle;
