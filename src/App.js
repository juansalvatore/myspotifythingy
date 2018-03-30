import React, { Component } from 'react'
import logo from './logo.svg'
import './App.css'
import Spotify from 'spotify-web-api-js'

const spotifyWebApi = new Spotify()

class App extends Component {
  constructor() {
    super()
    const params = this.getHashParams()
    this.state = {
      loggedIn: params.access_token ? true : false,
      nowPlaying: {
        name: 'Not Checked',
        image: {
          url: '',
          width: '',
          height: '',
        },
      },
    }
    if (params.access_token) {
      spotifyWebApi.setAccessToken(params.access_token)
    }
  }

  getHashParams() {
    var hashParams = {}
    var e,
      r = /([^&;=]+)=?([^&;]*)/g,
      q = window.location.hash.substring(1)
    while ((e = r.exec(q))) {
      hashParams[e[1]] = decodeURIComponent(e[2])
    }
    return hashParams
  }

  checkNowPlaying = () => {
    spotifyWebApi.getMyCurrentPlaybackState().then(response => {
      console.log('Response is: ', response)
      this.setState({
        nowPlaying: {
          name: response.item.name,
          image: {
            url: response.item.album.images[0].url,
            width: response.item.album.images[0].width,
            height: response.item.album.images[0].height,
          },
        },
      })
    })
  }

  render() {
    return (
      <div className="App">
        <a
          style={{ display: this.state.loggedIn ? 'none' : true }}
          href="http://localhost:8888"
        >
          <button>Login with Spotify</button>
        </a>
        <div style={{ display: this.state.loggedIn ? true : 'none' }}>
          <div>Now playing {this.state.nowPlaying.name}</div>
          <div>
            <img
              src={this.state.nowPlaying.image.url}
              style={{ width: this.state.nowPlaying.image.width }}
            />
          </div>
          <button onClick={this.checkNowPlaying}>Check Now Playing</button>
        </div>
      </div>
    )
  }
}

export default App
