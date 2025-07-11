import React, { Component } from 'react';

class FetchUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      loading: true
    };
  }

  componentDidMount() {
    fetch('https://jsonplaceholder.typicode.com/users/1')
      .then(res => res.json())
      .then(data => this.setState({ user: data, loading: false }));
  }

  render() {
    const { loading, user } = this.state;
    return loading ? (
      <p>Loading user...</p>
    ) : (
      <div>
        <h2>{user.name}</h2>
        <p>Email: {user.email}</p>
      </div>
    );
  }
}

export default FetchUser;
