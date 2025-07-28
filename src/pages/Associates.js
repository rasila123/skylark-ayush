
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Associates.css';
import { supabase } from '../supabaseClient';


const Associates = () => {
  const [artistList, setArtistList] = React.useState([]);
  const navigate = useNavigate();

  React.useEffect(() => {
    const fetchArtists = async () => {
      const { data, error } = await supabase.from('artists').select('*');
      let supabaseArtists = [];
      if (error) {
        console.error('Error fetching artists:', error.message);
      } else if (data) {
        supabaseArtists = data.map(a => ({ name: a.name, img: a.photo }));
      }
      // Merge with default artists, avoid duplicates
      const all = [...supabaseArtists];
      const unique = Array.from(new Map(all.map(a => [a.name, a])).values());
      setArtistList(unique);
    };
    fetchArtists();
  }, []);

  return (
    <div className="associates-page">
      <h2>Our Artists</h2>
      <div className="artist-grid">
        {artistList.map((artist, idx) => (
          <div
            className="artist-card"
            key={artist.name + idx}
            style={{cursor:'pointer'}}
            onClick={() => navigate(`/artist/${encodeURIComponent(artist.name)}`)}
          >
            <img src={artist.img || 'https://cdn-icons-png.flaticon.com/512/149/149071.png'} alt={artist.name} style={{width:'120px',height:'120px',objectFit:'cover',borderRadius:'50%',display:'block',margin:'0 auto'}} />
            <p>{artist.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Associates;
