import React from 'react';
import { useParams } from 'react-router-dom';
import './ArtistPage.css';
import { supabase } from '../supabaseClient';

const ArtistPage = () => {
  const { artistId } = useParams();
  const [songs, setSongs] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchSongs = async () => {
      setLoading(true);
      const { data, error } = await supabase.from('songs').select('*').eq('artist', artistId);
      if (error) {
        console.error('Error fetching artist songs:', error.message);
        setSongs([]);
      } else if (data) {
        setSongs(data);
      }
      setLoading(false);
    };
    fetchSongs();
  }, [artistId]);

  return (
    <div className="artist-songs-page">
      <h2>{artistId.toUpperCase()} Songs</h2>
      {loading ? (
        <p style={{color:'#aaa'}}>Loading songs...</p>
      ) : songs.length === 0 ? (
        <p style={{color:'#aaa'}}>No songs found for this artist.</p>
      ) : (
        <div className="song-grid">
          {songs.map((song, index) => (
            <div className="song-card" key={song.id || index} onClick={() => window.open(song.url, '_blank')}>
              <img src={song.thumbnail} alt={song.title} />
              <p>{song.title}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ArtistPage;
