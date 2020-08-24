import React from 'react';
import './App.css';
import { Playlist } from '../Playlist/Playlist';
import { SearchBar } from '../SearchBar/SearchBar';
import { SearchResults } from '../SearchResults/SearchResults';
import { findAllInRenderedTree } from 'react-dom/test-utils';

const hardcodedResults = [
  {
    name:   'Faded',
    artist: 'ZHU',
    album:  'THE NIGHTDAY',
    id:     1
  },
  {
    name:   'Sandstorm',
    artist: 'Darude',
    album:  'Before The Storm',
    id:     2
  },
  {
    name:   'Sanctuary',
    artist: 'Gareth Emery',
    album:  'Sanctuary',
    id:     3
  },
  {
    name:   'Shelter',
    artist: 'Porter Robinson',
    album:  'Shelter',
    id:     4
  },
  {
    name:   'Sun & Moon',
    artist: 'Above & Beyond',
    album:  'Group Therapy',
    id:     5
  }
]
const hardcodedPlaylistName = 'Funky Beats';
const hardcodedPlaylistTracks = [
  hardcodedResults[1],
  hardcodedResults[4]
];

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      searchResults: hardcodedResults,
      playlistName: hardcodedPlaylistName,
      playlistTracks: hardcodedPlaylistTracks
    };
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
  }

  addTrack(track) {
    if (!this.state.playlistTracks.find(savedTrack => savedTrack.id === track.id)) {
      // Track is not already in playlist
      let updatedPlaylist = this.state.playlistTracks;
      updatedPlaylist.push(track);
      this.setState({
        playlistTracks: updatedPlaylist
      });
    }
  }

  removeTrack(track) {
    let updatedPlaylist = this.state.playlistTracks.filter(savedTrack => savedTrack.id !== track.id);
    this.setState({
      playlistTracks: updatedPlaylist
    });
  }

  updatePlaylistName(name) {
    this.setState({
      playlistName: name
    });
  }

  render() {
    return(
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar />
          <div className="App-playlist">
            <SearchResults searchResults={this.state.searchResults} onAdd={this.addTrack} />
            <Playlist playlistName={this.state.playlistName} playlistTracks={this.state.playlistTracks} onRemove={this.removeTrack} onNameChange={this.updatePlaylistName} />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
