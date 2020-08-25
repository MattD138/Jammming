import Config from '../Config';
let accessToken;
let expiresIn;
let dumbFlag = true;

export const Spotify = {

  getAccessToken() {
    if (accessToken) {
      return accessToken;
    } else if (window.location.href.match(/access_token=([^&]*)/)
      && window.location.href.match(/expires_in=([^&]*)/)) {// Check if access token has just been obtained as URL
      accessToken = window.location.href.match(/access_token=([^&]*)/)[1];
      expiresIn = window.location.href.match(/expires_in=([^&]*)/)[1];
      // Set accessToken variable to expire at the same time as the token itself
      window.setTimeout(() => accessToken = '', expiresIn * 1000);
      // Clear Spotify's response parameters from URL to avoid looping over the old response again
      window.history.pushState('Access Token', '', '/');
      console.log('Spotify auth success, expires in', expiresIn/60, 'minutes.');
      console.log('accessToken', accessToken);
      return accessToken;
    } else {
      // User has not logged in or token expired
      // Re-authenticate with Spotify
      let requestURL = `https://accounts.spotify.com/authorize?client_id=${Config.clientID}&response_type=token&redirect_uri=${Config.redirectURI}&scope=playlist-modify-public%20playlist-modify-private`;
      window.location.assign(requestURL);
    }
  },

  search(searchTerm) {
    let accessToken = this.getAccessToken();
    return fetch(`https://api.spotify.com/v1/search?type=track&q=${searchTerm}`, {
      headers: {Authorization: `Bearer ${accessToken}`}
    })
    .then(response => response.json())
    .then(jsonResponse => {
      console.log('jsonResponse', jsonResponse);
      let searchResults = jsonResponse.tracks.items;
      searchResults = searchResults.map(track => {
        return {
          id: track.id,
          name: track.name,
          artist: track.artists[0].name,
          album: track.album.name,
          uri: track.uri
        }
      })
      console.log(searchResults);
      return searchResults;
    })
  }

};

//Spotify.getAccessToken();
if (dumbFlag) {
  Spotify.search('Bad Things');
  dumbFlag = false;
}

export default Spotify;