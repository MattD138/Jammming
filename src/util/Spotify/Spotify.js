import Config from '../Config';
let accessToken;
let expiresIn;

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

  // Get current user's Spotify User ID
  async getUserID() {

    const accessToken = this.getAccessToken();
    const headers = {
      Authorization: `Bearer ${accessToken}`
    };

    const response = await fetch('https://api.spotify.com/v1/me', {
      headers: headers
    });
    const jsonResponse = await response.json();

    if (jsonResponse.error) {
      console.log('getUserID Error:', jsonResponse.error.message);
      return;
    }
    const userID = jsonResponse.id;
    console.log('User ID:', userID);
    return userID;

  },

  // Create new playlist for user and note playlist ID
  // Done by sending a POST request to 'Create a Playlist' endpoint with user ID
  async getPlaylistID(userID, playlistName) {

    const accessToken = this.getAccessToken();
    const headers = {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    };
    const body = JSON.stringify({
      name: playlistName,
      public: true
    });

    const response = await fetch(`https://api.spotify.com/v1/users/${userID}/playlists`, {
      method: 'POST',
      headers: headers,
      body: body
    });
    const jsonResponse = await response.json();

    if (jsonResponse.error) {
      console.log('getPlaylistID Error:', jsonResponse.error.message);
      return;
    }
    const playlistID = jsonResponse.id;
    console.log('Created Playlist ID:', playlistID);
    return playlistID;

  },

  // Add selected tracklist to the user's new Spotify playlist
  // Done by sending a POST request to 'Add Items to a Playlist' endpoint with playlist ID
  async addSongsToPlaylist(playlistID, trackURIs) {

    const accessToken = this.getAccessToken();
    const headers = {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    };
    const body = JSON.stringify({
      uris: trackURIs
    });

    const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistID}/tracks`, {
      method: 'POST',
      headers: headers,
      body: body
    });
    const jsonResponse = await response.json();

    if (jsonResponse.error) {
      console.log('addSongsToPlaylist Error:', jsonResponse.error.message);
      return;
    }
    console.log('Successfully added songs to playlist. Snapshot ID:', jsonResponse.snapshot_id);

  },

  search(searchTerm) {
    let accessToken = this.getAccessToken();
    return fetch(`https://api.spotify.com/v1/search?type=track&q=${searchTerm}`, {
      headers: {Authorization: `Bearer ${accessToken}`}
    })
    .then(response => response.json())
    .then(jsonResponse => {
      if (jsonResponse.error) {
        alert(jsonResponse.error.message);
        return [];
      }
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
      return searchResults;
    })
  },

  async savePlaylist(playlistName, trackURIs) {

    if (!playlistName || !trackURIs) {
      return;
    }

    const userID = await this.getUserID();
    const playlistID = await this.getPlaylistID(userID, playlistName);
    console.log('trackURIs:', trackURIs)
    this.addSongsToPlaylist(playlistID, trackURIs);

  }

};

export default Spotify;