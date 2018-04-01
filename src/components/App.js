import React, { Component } from 'react'
import '../css/App.css'
import { Map, LastPlayed } from '../components'

class App extends Component {
  render() {
    return (
      <div>
        <Map />
        <LastPlayed />
      </div>
    )
  }
}

export { App }
