### myspotifythingy

A side project I'll build just for fun, to keep learning about react, redux, mocha and chia!

## wanna play with my project and try it out? Then...

1 - `git clone ${my_repository_link}`

2 - `npm install`

3 - Create your own: client_id and client_secret on Spotify's website

4 - Add your CLIENT_ID and CLIENT_SECRET to ./authorization_code/app.js

* Create a file called keys.js outside of the main project's file

  ```
     const CLIENT_ID = 'your client id string'
     const CLIENT_SECRET = 'your client secret string'

     export default { CLIENT_ID, CLIENT_SECRET }
  ```

* After this just import your global variables to app.js like this:
  `import { CLIENT_ID, CLIENT_SECRET } from '../../keys.js'`

5 - `node server/server.js` will initialize a node server at localhost:8888

6 - `npm start`

And that's it! have fun
