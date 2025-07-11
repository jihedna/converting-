import React, { Component } from 'react';

class Message extends Component {
  constructor(props) {
    super(props);
    this.state = { show: true };
  }

  toggleMessage = () => {
    this.setState(prev => ({ show: !prev.show }));
  }

  render() {
    return (
      <div>
        {this.state.show && <p>This is a message.</p>}
        <button onClick={this.toggleMessage}>Toggle Message</button>
      </div>
    );
  }
}

export default Message;
