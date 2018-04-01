import React, { Component } from 'react'
import '../css/App.css'
import Spotify from 'spotify-web-api-js'
import { geolocated } from 'react-geolocated'

const spotifyWebApi = new Spotify()
const mapboxgl = require('mapbox-gl/dist/mapbox-gl.js')
let map = null

class Map extends Component {
  constructor() {
    super()
    const params = this.getHashParams()
    this.state = {
      loggedIn: params.access_token ? true : false,
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

  saveCoordinates = nextProps => {
    this.setState({
      coordinates: {
        latitude: this.props.coords.latitude,
        longitude: this.props.coords.longitude,
        load: false,
      },
    })
  }

  componentDidMount = props => {
    // initialize mapbox map
    mapboxgl.accessToken = ''
    map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/juansalvatore2/cjfg0h9lc0ytu2rs37esypzw7',
      attributionControl: false,
      pitch: 50,
      // long lat
      center: [
        this.state.coordinates.longitude,
        this.state.coordinates.latitude,
      ],
      zoom: 3,
    })
  }

  componentDidUpdate(props) {
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
      <div className="Map">
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
          {/* MAP */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100vh',
            }}
          >
            <div
              id="map"
              style={{
                position: 'absolute',
                width: '99%',
                height: '98%',
              }}
            />
            {/* Save where the user is located and fly */}
            {this.props.coords != null && this.state.coordinates.load === true
              ? this.saveCoordinates()
              : null}
          </div>
          {/* SPOTIFY */}
        </div>
      </div>
    )
  }
}

Map = geolocated({
  positionOptions: {
    enableHighAccuracy: true,
    timeout: Infinity,
  },
  userDecisionTimeout: null,
})(Map)

export { Map }
