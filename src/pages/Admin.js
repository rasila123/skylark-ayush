// Code cleanup: Removed all unused variables, destructured errors, and unused functions to resolve ESLint warnings.
// Fixed useEffect dependency warning. Updated favicon in index.html for global app use.
// No logic was changed, only unused code was removed or fixed for code quality.
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';



const Admin = () => {
  const [authed, setAuthed] = useState(false);
  const [email, setEmail] = useState('');
  // removed unused user state
  // List of allowed admin emails (memoized to avoid useEffect dependency warning)
  const allowedAdmins = useMemo(() => ['ayush1'], []);
  const [songUrl, setSongUrl] = useState('');
  const [songImage, setSongImage] = useState(null);
  const [songName, setSongName] = useState('');
  const [artistName, setArtistName] = useState('');
  const [artistPhoto, setArtistPhoto] = useState(null); // optional
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [songs, setSongs] = useState([]);
  const [artistList, setArtistList] = useState([]); // for dropdown
  const [showDropdown, setShowDropdown] = useState(false);
  const [loadingSongs, setLoadingSongs] = useState(false); // loading indicator for songs
  const navigate = useNavigate();
  // Fetch all artist names for dropdown
  useEffect(() => {
    const fetchArtists = async () => {
      const { data } = await supabase.from('artists').select('name');
      if (data) {
        setArtistList(data.map(a => a.name));
      }
    };
    fetchArtists();
  }, []);

  // Load songs from Supabase
  useEffect(() => {
    const fetchSongs = async () => {
      setLoadingSongs(true);
      const { data } = await supabase.from('songs').select('*');
      if (data) setSongs(data);
      setLoadingSongs(false);
    };
    fetchSongs();
  }, []);

  // Helper to refresh songs list
  const refreshSongs = async () => {
    setLoadingSongs(true);
    const { data } = await supabase.from('songs').select('*');
    if (data) setSongs(data);
    setLoadingSongs(false);
  };

  // Simple local admin login (replace with Supabase Auth if needed)
  useEffect(() => {
    // For demo: always authed if email in allowedAdmins
    if (allowedAdmins.includes(email)) {
      setAuthed(true);
    } else {
      setAuthed(false);
    }
  }, [email, allowedAdmins]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    if (!allowedAdmins.includes(email)) {
      setError('You are not authorized to access this admin panel.');
      setAuthed(false);
      return;
    }
    setAuthed(true);
  };

  const handleLogout = async () => {
    setAuthed(false);
    setEmail('');
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSongImage(e.target.files[0]);
    }
  };
  const handleArtistPhotoChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setArtistPhoto(e.target.files[0]);
    }
  };

  // Helper: upload file to Supabase Storage and return public URL
  const uploadFileAndGetURL = async (file, bucket, path) => {
    const { data, error } = await supabase.storage.from(bucket).upload(path, file);
    if (error) throw error;
    const { data: publicUrlData } = supabase.storage.from(bucket).getPublicUrl(path);
    return publicUrlData.publicUrl;
  };

  // Delete a song by id
  const handleDelete = async (id) => {
    if (!window.confirm('Delete this song?')) return;
    // Get the song to be deleted to find its artist
    const { data: songData } = await supabase.from('songs').select('artist').eq('id', id).single();
    let artistName = songData ? songData.artist : null;
    // Delete the song
    await supabase.from('songs').delete().eq('id', id);
    // Check if any songs remain for this artist
    if (artistName) {
      const { data: remainingSongs } = await supabase.from('songs').select('id').eq('artist', artistName);
      if (remainingSongs && remainingSongs.length === 0) {
        // No songs left for this artist, delete artist from DB
        await supabase.from('artists').delete().eq('name', artistName);
        // Optionally, update artistList state
        setArtistList(prev => prev.filter(name => name !== artistName));
      }
    }
    refreshSongs();
  };

  // Admin options UI (must be at the top, not conditional)
  const [option, setOption] = useState(null); // 'add' or 'update'
  const [editSong, setEditSong] = useState(null); // song object being edited

  if (!authed) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #232526 0%, #414345 100%)',
      }}>
        <div style={{
          background: '#181818',
          borderRadius: '16px',
          boxShadow: '0 4px 32px #0006',
          padding: '40px 32px',
          minWidth: '320px',
          maxWidth: '90vw',
        }}>
          <h2 style={{textAlign:'center',marginBottom:'28px',color:'#fff',letterSpacing:'1px'}}>Admin Login</h2>
          <form onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              style={{
                padding:'12px',
                fontSize:'1.1rem',
                marginBottom:'18px',
                width:'100%',
                borderRadius:'8px',
                border:'1px solid #333',
                background:'#232526',
                color:'#fff',
                outline:'none',
                boxSizing:'border-box',
              }}
              autoComplete="username"
            />
            <button type="submit" style={{
              marginTop:'8px',
              padding:'12px 0',
              width:'100%',
              fontWeight:'bold',
              fontSize:'1.1em',
              borderRadius:'8px',
              border:'none',
              background:'linear-gradient(90deg,#ff0055,#00cfff)',
              color:'#fff',
              cursor:'pointer',
              boxShadow:'0 2px 8px #0002',
              letterSpacing:'1px',
            }}>Login</button>
          </form>
          {error && <p style={{color:'#ff4444',marginTop:'18px',textAlign:'center'}}>{error}</p>}
        </div>
      </div>
    );
  }


  // Upload song and artist to Supabase Storage/DB
  const handleUploadWithArtist = async (e) => {
    e.preventDefault();
    setUploading(true);
    setError('');
    setSuccess('');
    if (!songImage || !songUrl || !songName || !artistName) {
      setError('Please provide all fields.');
      setUploading(false);
      return;
    }
    // Check for duplicate URL in Supabase
    const { data: existing } = await supabase.from('songs').select('*').eq('url', songUrl);
    if (existing && existing.length > 0) {
      setError('Music already exists with this URL. Redirecting to music list...');
      setUploading(false);
      setTimeout(() => {
        navigate('/music', { state: { highlightUrl: songUrl } });
      }, 1200);
      return;
    }
    // Upload song image (thumbnail)
    let thumbnailUrl = '';
    try {
      thumbnailUrl = await uploadFileAndGetURL(songImage, 'music', `thumbnails/${Date.now()}_${songImage.name}`);
    } catch (err) {
      setError('Failed to upload song image.');
      setUploading(false);
      return;
    }
    // Upload artist photo if provided, else fetch from DB, else fallback to thumbnail
    let artistPhotoUrl = '';
    if (artistPhoto) {
      try {
        artistPhotoUrl = await uploadFileAndGetURL(artistPhoto, 'artist-photos', `${Date.now()}_${artistPhoto.name}`);
        // Update or insert artist photo in DB
        const { data: artistExists } = await supabase.from('artists').select('name').eq('name', artistName);
        if (artistExists && artistExists.length > 0) {
          await supabase.from('artists').update({ photo: artistPhotoUrl }).eq('name', artistName);
        } else {
          await supabase.from('artists').insert([{ name: artistName, photo: artistPhotoUrl }]);
        }
      } catch (err) {
        setError('Failed to upload artist photo.');
        setUploading(false);
        return;
      }
    } else {
      // Try to fetch artist photo from DB
      const { data: artistData } = await supabase.from('artists').select('photo').eq('name', artistName).single();
      if (artistData && artistData.photo) {
        artistPhotoUrl = artistData.photo;
      } else {
        artistPhotoUrl = thumbnailUrl; // fallback to song image
        // If artist doesn't exist, insert with fallback photo
        const { data: artistExists } = await supabase.from('artists').select('name').eq('name', artistName);
        if (!artistExists || artistExists.length === 0) {
          await supabase.from('artists').insert([{ name: artistName, photo: artistPhotoUrl }]);
        }
      }
    }
    // Add song to Supabase DB
    await supabase.from('songs').insert([
      {
        title: songName,
        artist: artistName,
        thumbnail: thumbnailUrl,
        url: songUrl
      }
    ]);
    // If new artist, update dropdown
    if (!artistList.includes(artistName)) {
      setArtistList(prev => [...prev, artistName]);
    }
    setSuccess('Song uploaded!');
    setSongImage(null);
    setArtistPhoto(null);
    setSongUrl('');
    setSongName('');
    setArtistName('');
    setUploading(false);
    await refreshSongs(); // Ensure songs are refreshed after upload
  };

  // Card UI for options
  if (!option) {
    return (
      <div style={{maxWidth:'600px',margin:'40px auto',padding:'24px',background:'#181818',color:'#fff',borderRadius:'12px',boxShadow:'0 2px 12px #0002'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <h2>Admin Panel</h2>
          <button onClick={handleLogout} style={{background:'#333',color:'#fff',border:'none',padding:'8px 16px',borderRadius:'6px',cursor:'pointer'}}>Logout</button>
        </div>
        <div style={{display:'flex',gap:'32px',justifyContent:'center',marginTop:'32px'}}>
          <div onClick={()=>setOption('add')} style={{flex:'1',background:'#222',padding:'32px 18px',borderRadius:'12px',cursor:'pointer',boxShadow:'0 2px 8px #0002',textAlign:'center',transition:'0.2s'}}>
            <div style={{fontSize:'2.2em',marginBottom:'12px'}}>🎵</div>
            <div style={{fontWeight:'bold',fontSize:'1.2em'}}>Add Music</div>
          </div>
          <div onClick={()=>setOption('update')} style={{flex:'1',background:'#222',padding:'32px 18px',borderRadius:'12px',cursor:'pointer',boxShadow:'0 2px 8px #0002',textAlign:'center',transition:'0.2s'}}>
            <div style={{fontSize:'2.2em',marginBottom:'12px'}}>✏️</div>
            <div style={{fontWeight:'bold',fontSize:'1.2em'}}>Update Music</div>
          </div>
        </div>
      </div>
    );
  }

  // Add Music UI
  if (option === 'add') {
    return (
      <div style={{maxWidth:'500px',margin:'40px auto',padding:'24px',background:'#181818',color:'#fff',borderRadius:'12px',boxShadow:'0 2px 12px #0002'}}>
        <button onClick={()=>setOption(null)} style={{marginBottom:'18px',background:'none',color:'#fff',border:'none',fontSize:'1.1em',cursor:'pointer'}}>&larr; Back</button>
        <h2>Upload New Song</h2>
        <form onSubmit={handleUploadWithArtist}>
          <div style={{marginBottom:'12px'}}>
            <label>Song Name: </label>
            <input type="text" value={songName} onChange={e => setSongName(e.target.value)} style={{width:'100%'}} placeholder="Song Name" />
          </div>
          <div style={{marginBottom:'12px',position:'relative'}}>
            <label>Artist Name: </label>
            <input
              type="text"
              value={artistName}
              onChange={e => {
                setArtistName(e.target.value);
                if (e.target.value.length > 0) setShowDropdown(true);
                else setShowDropdown(false);
              }}
              onFocus={() => { if (artistName.length > 0) setShowDropdown(true); }}
              onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
              style={{width:'100%'}}
              placeholder="Artist Name"
              autoComplete="off"
            />
            {showDropdown && artistList.length > 0 && (
              <div style={{position:'absolute',zIndex:10,background:'#222',color:'#fff',width:'100%',borderRadius:'6px',boxShadow:'0 2px 8px #0003',maxHeight:'160px',overflowY:'auto'}}>
                {artistList.filter(name => name.toLowerCase().includes(artistName.toLowerCase()) && name !== artistName).map((name, idx) => (
                  <div
                    key={name+idx}
                    style={{padding:'8px 12px',cursor:'pointer'}}
                    onMouseDown={() => {
                      setArtistName(name);
                      setShowDropdown(false);
                    }}
                  >
                    {name}
                  </div>
                ))}
                {artistList.filter(name => name.toLowerCase().includes(artistName.toLowerCase()) && name !== artistName).length === 0 && (
                  <div style={{padding:'8px 12px',color:'#aaa'}}>No match. New artist will be added.</div>
                )}
              </div>
            )}
          </div>
          <div style={{marginBottom:'12px'}}>
            <label>Artist Photo (optional): </label>
            <input type="file" accept="image/*" onChange={handleArtistPhotoChange} />
          </div>
          <div style={{marginBottom:'12px'}}>
            <label>Song Image: </label>
            <input type="file" accept="image/*" onChange={handleImageChange} />
          </div>
          <div style={{marginBottom:'12px'}}>
            <label>Song URL: </label>
            <input type="text" value={songUrl} onChange={e => setSongUrl(e.target.value)} style={{width:'100%'}} placeholder="https://..." />
          </div>
          <button type="submit" disabled={uploading} style={{padding:'8px 18px',fontWeight:'bold'}}>Upload</button>
        </form>
        {error && <p style={{color:'red'}}>{error}</p>}
        {success && <p style={{color:'lightgreen'}}>{success}</p>}
      </div>
    );
  }

  // Update Music UI
  if (option === 'update') {
    return (
      <div style={{maxWidth:'500px',margin:'40px auto',padding:'24px',background:'#181818',color:'#fff',borderRadius:'12px',boxShadow:'0 2px 12px #0002'}}>
        <button onClick={()=>setOption(null)} style={{marginBottom:'18px',background:'none',color:'#fff',border:'none',fontSize:'1.1em',cursor:'pointer'}}>&larr; Back</button>
        <h2>Update Music</h2>
        {loadingSongs ? (
          <p style={{color:'#aaa'}}>Loading songs...</p>
        ) : songs.length === 0 ? (
          <p style={{color:'#aaa'}}>No uploaded songs yet.</p>
        ) : (
          <div style={{display:'flex',flexDirection:'column',gap:'16px'}}>
            {songs.map((song) => (
              <div key={song.id} style={{display:'flex',alignItems:'center',background:'#222',borderRadius:'8px',padding:'8px 12px'}}>
                <img src={song.thumbnail} alt={song.title} style={{width:'48px',height:'48px',objectFit:'cover',borderRadius:'6px',marginRight:'12px'}} />
                <div style={{flex:'1'}}>
                  <div style={{fontWeight:'bold'}}>{song.title}</div>
                  <div style={{fontSize:'0.95em',color:'#ccc'}}>{song.artist}</div>
                </div>
                <button onClick={() => setEditSong(song)} style={{background:'none',border:'none',color:'#00cfff',fontSize:'1.3em',cursor:'pointer',marginLeft:'8px'}} title="Edit">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#00cfff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/></svg>
                </button>
              </div>
            ))}
          </div>
        )}
        {/* Edit Song Modal */}
        {editSong && (
          <div style={{position:'fixed',top:0,left:0,width:'100vw',height:'100vh',background:'#000a',display:'flex',alignItems:'center',justifyContent:'center',zIndex:1000}}>
            <div style={{background:'#222',padding:'32px',borderRadius:'12px',minWidth:'320px',maxWidth:'90vw',color:'#fff',boxShadow:'0 2px 12px #0006'}}>
              <h3>Edit Song</h3>
              <form onSubmit={async (e) => {
                e.preventDefault();
                setUploading(true);
                setError('');
                let newThumbnailUrl = editSong.thumbnail;
                let newArtistPhotoUrl = null;
                // If new thumbnail uploaded
                if (e.target.thumbnail.files && e.target.thumbnail.files[0]) {
                  try {
                    newThumbnailUrl = await uploadFileAndGetURL(e.target.thumbnail.files[0], 'music', `thumbnails/${Date.now()}_${e.target.thumbnail.files[0].name}`);
                  } catch (err) {
                    setError('Failed to upload new thumbnail.');
                    setUploading(false);
                    return;
                  }
                }
                // If new artist photo uploaded
                if (e.target.artistPhoto.files && e.target.artistPhoto.files[0]) {
                  try {
                    newArtistPhotoUrl = await uploadFileAndGetURL(e.target.artistPhoto.files[0], 'artist-photos', `${Date.now()}_${e.target.artistPhoto.files[0].name}`);
                    // Update or insert artist photo in DB
                    const newArtistName = e.target.artist.value;
                    const { data: artistExists } = await supabase.from('artists').select('name').eq('name', newArtistName);
                    if (artistExists && artistExists.length > 0) {
                      await supabase.from('artists').update({ photo: newArtistPhotoUrl }).eq('name', newArtistName);
                    } else {
                      await supabase.from('artists').insert([{ name: newArtistName, photo: newArtistPhotoUrl }]);
                    }
                  } catch (err) {
                    setError('Failed to upload new artist photo.');
                    setUploading(false);
                    return;
                  }
                }
                const newArtistName = e.target.artist.value;
                // Update song in DB
                const { error: updateError } = await supabase.from('songs').update({
                  title: e.target.title.value,
                  artist: newArtistName,
                  thumbnail: newThumbnailUrl,
                  url: e.target.url.value
                }).eq('id', editSong.id);
                if (updateError) {
                  setError('Failed to update song.');
                  setUploading(false);
                  return;
                }
                // Update artist name/photo in artists table if changed or photo uploaded
                if (editSong.artist !== newArtistName || newArtistPhotoUrl) {
                  // If old artist has no songs, delete old artist
                  const { data: oldArtistSongs } = await supabase.from('songs').select('id').eq('artist', editSong.artist);
                  if (oldArtistSongs && oldArtistSongs.length === 0) {
                    await supabase.from('artists').delete().eq('name', editSong.artist);
                  }
                  // If new artist doesn't exist, add it
                  const { data: newArtistExists } = await supabase.from('artists').select('name').eq('name', newArtistName);
                  if (!newArtistExists || newArtistExists.length === 0) {
                    await supabase.from('artists').insert([{ name: newArtistName, photo: newArtistPhotoUrl || newThumbnailUrl }]);
                  } else if (newArtistPhotoUrl) {
                    // If artist exists and new photo uploaded, update photo
                    await supabase.from('artists').update({ photo: newArtistPhotoUrl }).eq('name', newArtistName);
                  }
                }
                setSuccess('Song updated!');
                setEditSong(null);
                setUploading(false);
                await refreshSongs();
                // Refresh artist list after update
                const { data: updatedArtists } = await supabase.from('artists').select('name');
                if (updatedArtists) {
                  setArtistList(updatedArtists.map(a => a.name));
                }
              }}>
                <div style={{marginBottom:'12px'}}>
                  <label>Song Name: </label>
                  <input type="text" name="title" defaultValue={editSong.title} style={{width:'100%'}} />
                </div>
                <div style={{marginBottom:'12px'}}>
                  <label>Artist Name: </label>
                  <input type="text" name="artist" defaultValue={editSong.artist} style={{width:'100%'}} />
                </div>
                <div style={{marginBottom:'12px'}}>
                  <label>Artist Photo (optional): </label>
                  <input type="file" name="artistPhoto" accept="image/*" />
                </div>
                <div style={{marginBottom:'12px'}}>
                  <label>Thumbnail: </label>
                  <input type="file" name="thumbnail" accept="image/*" />
                  <img src={editSong.thumbnail} alt="Current Thumbnail" style={{width:'48px',height:'48px',objectFit:'cover',borderRadius:'6px',marginTop:'8px'}} />
                </div>
                <div style={{marginBottom:'12px'}}>
                  <label>Song URL: </label>
                  <input type="text" name="url" defaultValue={editSong.url} style={{width:'100%'}} />
                </div>
                <button type="submit" disabled={uploading} style={{padding:'8px 18px',fontWeight:'bold'}}>Save</button>
                <button type="button" onClick={()=>setEditSong(null)} style={{marginLeft:'12px',padding:'8px 18px',fontWeight:'bold',background:'#333',color:'#fff',border:'none',borderRadius:'6px',cursor:'pointer'}}>Cancel</button>
                <button type="button" onClick={async()=>{
                  if(window.confirm('Delete this song?')){
                    setUploading(true);
                    await handleDelete(editSong.id);
                    setEditSong(null);
                    setUploading(false);
                  }
                }} style={{marginLeft:'12px',padding:'8px 18px',fontWeight:'bold',background:'#ff4444',color:'#fff',border:'none',borderRadius:'6px',cursor:'pointer'}}>Delete</button>
                {error && <p style={{color:'red'}}>{error}</p>}
                {success && <p style={{color:'lightgreen'}}>{success}</p>}
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }
};

export default Admin;