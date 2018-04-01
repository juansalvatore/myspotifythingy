import React, { Component } from 'react'
import '../css/App.css'
import Spotify from 'spotify-web-api-js'
import ReactRevealText from 'react-reveal-text'
import ContentLoader from 'react-content-loader'
import Img from 'react-image'

const spotifyWebApi = new Spotify()

class LastPlayed extends Component {
  constructor() {
    super()
    const params = this.getHashParams()
    this.state = {
      loggedIn: params.access_token ? true : false,
      showText: false,
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
      console.log(response)
      spotifyWebApi.skipToNext({ device_id: response.device.id }, result => {
        console.log(result)
      })
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
    const params = this.getHashParams()

    this.setState({ showText: false })
    setTimeout(() => {
      this.setState({ showText: true })
    }, 3000)
  }

  componentDidMount = props => {
    // call to check last son played
    this.checkNowPlaying()
    setTimeout(() => {
      this.setState({ showText: true })
    }, 1500)
  }

  render() {
    return (
      <div className="last-played">
        <div
          style={{
            display: this.state.loggedIn ? true : 'none',
          }}
        >
          {/* SPOTIFY */}
          <div
            style={{
              zIndex: 2,
              top: 15,
              left: 15,
              borderRadius: 5,
              position: 'absolute',
              backgroundColor: 'white',
              boxShadow: '10px 10px 10px 0px rgba(0,0,0,0.2)',
            }}
          >
            <div className="App" style={{ margin: 10 }}>
              <ReactRevealText show={this.state.showText}>
                {this.state.nowPlaying.name}
              </ReactRevealText>
            </div>
            <div>
              <Img
                src={this.state.nowPlaying.image.url}
                style={{ width: 200 }}
                loader={
                  <ContentLoader
                    height={200}
                    width={200}
                    speed={2}
                    primaryColor={'#f3f3f3'}
                    secondaryColor={'#ecebeb'}
                  >
                    <rect x="1" y="0" rx="5" ry="5" width="200" height="200" />
                  </ContentLoader>
                }
              />
            </div>

            <button style={{ margin: 10 }} onClick={this.checkNowPlaying}>
              Next
            </button>
          </div>
        </div>
      </div>
    )
  }
}

export { LastPlayed }
