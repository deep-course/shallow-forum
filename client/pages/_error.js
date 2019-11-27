import React from 'react'

export default class Error extends React.Component {
  static getInitialProps({ res, err }) {
  }

  render() {
    return (
      <p>error</p>
    )
  }
}
