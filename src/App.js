import React, { Component } from 'react'
import logo from './logo.svg'
import './App.css'
import Spotify from 'spotify-web-api-js'
import { geolocated } from 'react-geolocated'

const spotifyWebApi = new Spotify()
const mapboxgl = require('mapbox-gl/dist/mapbox-gl.js')
let map = null

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
      coordinates: {
        latitude: 0,
        longitude: 0,
        load: true,
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

  saveCoordinates = nextProps => {
    this.setState({
      coordinates: {
        latitude: this.props.coords.latitude,
        longitude: this.props.coords.longitude,
        load: false,
      },
    })

    // SET TIMEOUT HAS TO BE CORRECTED
  }

  componentDidMount = props => {
    // call to check last son played
    this.checkNowPlaying()

    // initialize mapbox map
    mapboxgl.accessToken = ''
    map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v10',
      // long lat
      center: [
        this.state.coordinates.longitude,
        this.state.coordinates.latitude,
      ],
      zoom: 1,
    })
  }

  componentDidUpdate(props) {
    console.log('PROPS UNDEFINED: ', this.props.coords != null)
    if (this.props.coords != null) {
      map.flyTo({
        center: [
          this.state.coordinates.longitude,
          this.state.coordinates.latitude,
        ],
        zoom: 12,
      })
    }
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

        <div
          style={{
            display: this.state.loggedIn ? true : 'none',
          }}
        >
          <div
            id="map"
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              width: '100%',
              height: '100%',
            }}
          />
          <div style={{ position: 'absolute' }}>
            <div>Now playing {this.state.nowPlaying.name} </div>
            <div>
              <img
                src={this.state.nowPlaying.image.url}
                style={{ width: 200 }}
              />
            </div>

            {this.props.coords != null && this.state.coordinates.load === true
              ? this.saveCoordinates()
              : null}

            {console.log(this.state.coordinates)}
            <button onClick={this.checkNowPlaying}>Check Now Playing</button>
          </div>
        </div>
      </div>
    )
  }
}

export default geolocated({
  positionOptions: {
    enableHighAccuracy: false,
    timeout: Infinity,
  },
  userDecisionTimeout: null,
})(App)
