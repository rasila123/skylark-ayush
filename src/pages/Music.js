import React from 'react';
import { useLocation } from 'react-router-dom';
import './Music.css';
import { supabase } from '../supabaseClient';

const Music = () => {
  const [songs, setSongs] = React.useState([]);
  const location = useLocation();
  const highlightUrl = location.state && location.state.highlightUrl;
  const [highlighted, setHighlighted] = React.useState(null);

  React.useEffect(() => {
    const fetchSongs = async () => {
      const { data, error } = await supabase.from('songs').select('*');
      console.log('Supabase songs data:', data, 'Error:', error);
      if (error) {
        console.error('Error fetching songs:', error.message);
        setSongs([]);
      } else if (data) {
        setSongs(data);
      }
    };
    fetchSongs();
  }, []);

  React.useEffect(() => {
    if (highlightUrl) {
      setHighlighted(highlightUrl);
      // Remove highlight after 2.5s
      const timer = setTimeout(() => setHighlighted(null), 2500);
      return () => clearTimeout(timer);
    }
  }, [highlightUrl]);

  return (
    <div className="music-page">
      <h2 class="section-heading">Our Music</h2>
      <div className="song-grid">
        {songs.map((song) => (
          <div id='music-page-card'
            className={
              'song-card' + (highlighted && song.url === highlighted ? ' highlighted-song-card' : '')
            }
            key={song.id}
            onClick={() => window.open(song.url, '_blank')}
          >
            <img src={song.thumbnail} alt={song.title} />
            <p>{song.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Music;
