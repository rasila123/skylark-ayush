// Code cleanup: Removed all unused variables, destructured errors, and unused functions to resolve ESLint warnings.
// Fixed useEffect dependency warning. Updated favicon in index.html for global app use.
// No logic was changed, only unused code was removed or fixed for code quality.

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import './Admin.css';

// Domain skylarkinfotainment.in purchased from hostinger and hosted on vercel

const Admin = () => {
  const [authed, setAuthed] = useState(false);
  const [secret, setSecret] = useState('');
  const [showSecret, setShowSecret] = useState(false);
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

  // Login handler: check secret code from DB
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    // Fetch password from DB (table: password, column: password)
    const { data, error: dbError } = await supabase.from('password').select('password').single();
    if (dbError || !data || !data.password) {
      setError('Error fetching secret code from server.');
      setAuthed(false);
      return;
    }
    if (secret !== data.password) {
      setError('Incorrect secret code.');
      setAuthed(false);
      return;
    }
    setAuthed(true);
  };

  const handleLogout = async () => {
    setAuthed(false);
    setSecret('');
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
    const { error } = await supabase.storage.from(bucket).upload(path, file);
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
      <div className="admin-login-bg" style={{ paddingBottom: '80px' }}>
        <div className="admin-login-box">
          <div style={{textAlign:'center',marginBottom:'12px',color:'#2a5d9f',fontWeight:'bold'}}>Official Skylark Infotainment Admin Panel</div>
          <h2 className="admin-login-title">Admin Login</h2>
          <form onSubmit={handleLogin} autoComplete="off">
            <div className="admin-secret-field">
              <input
                type={showSecret ? 'text' : 'password'}
                placeholder="enter secret code"
                value={secret}
                onChange={e => setSecret(e.target.value)}
                className="admin-login-input"
                autoComplete="off"
              />
              <span
                className="admin-eye-icon"
                onClick={() => setShowSecret(s => !s)}
                tabIndex={0}
                aria-label={showSecret ? 'Hide code' : 'Show code'}
              >
                {showSecret ? (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 1l22 22"/><path d="M17.94 17.94A10.94 10.94 0 0 1 12 19C7 19 2.73 15.11 1 12c.74-1.32 1.81-2.87 3.08-4.13M9.88 9.88A3 3 0 0 1 12 9c1.66 0 3 1.34 3 3 0 .39-.08.76-.21 1.1"/><path d="M21 21L3 3"/></svg>
                ) : (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="12" rx="10" ry="7"/><circle cx="12" cy="12" r="3"/></svg>
                )}
              </span>
            </div>
            <button type="submit" className="admin-login-btn">Login</button>
          </form>
          {error && <p className="admin-login-error">{error}</p>}
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
    // Validate song image dimensions (must be 300x300px)
    const validateImageDimensions = (file) => {
      return new Promise((resolve, reject) => {
        const img = new window.Image();
        img.onload = function() {
          if (img.width === img.height) {
            resolve(true);
          } else {
            reject(new Error('Song image width x height must be equal.'));
          }
        };
        img.onerror = function() {
          reject(new Error('Invalid image file.'));
        };
        img.src = URL.createObjectURL(file);
      });
    };
    try {
      await validateImageDimensions(songImage);
    } catch (err) {
      alert(err.message);
      setError(err.message);
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
      <div className="admin-panel-container" style={{ paddingBottom: '80px' }}>
        <div className="admin-panel-header">
          <h2>Admin Panel</h2>
          <button onClick={handleLogout} className="admin-logout-btn">Logout</button>
        </div>
        <div className="admin-panel-options">
          <div onClick={()=>setOption('add')} className="admin-panel-option">
            <div className="admin-panel-option-icon">🎵</div>
            <div className="admin-panel-option-label">Add Music</div>
          </div>
          <div onClick={()=>setOption('update')} className="admin-panel-option">
            <div className="admin-panel-option-icon">✏️</div>
            <div className="admin-panel-option-label">Update Music</div>
          </div>
        </div>
      </div>
    );
  }

  // Add Music UI
  if (option === 'add') {
    return (
      <div className="admin-add-container" style={{ paddingBottom: '80px' }}>
        <button onClick={()=>setOption(null)} className="admin-back-btn">&larr; Back</button>
        <h2>Upload New Song</h2>
        <form onSubmit={handleUploadWithArtist}>
          <div className="admin-form-group">
            <label>Song Name: </label>
            <input type="text" value={songName} onChange={e => setSongName(e.target.value)} className="admin-input" placeholder="Song Name" />
          </div>
          <div className="admin-form-group admin-artist-group">
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
              className="admin-input"
              placeholder="Artist Name"
              autoComplete="off"
            />
            {showDropdown && artistList.length > 0 && (
              <div className="admin-dropdown">
                {artistList.filter(name => name.toLowerCase().includes(artistName.toLowerCase()) && name !== artistName).map((name, idx) => (
                  <div
                    key={name+idx}
                    className="admin-dropdown-item"
                    onMouseDown={() => {
                      setArtistName(name);
                      setShowDropdown(false);
                    }}
                  >
                    {name}
                  </div>
                ))}
                {artistList.filter(name => name.toLowerCase().includes(artistName.toLowerCase()) && name !== artistName).length === 0 && (
                  <div className="admin-dropdown-no-match">No match. New artist will be added.</div>
                )}
              </div>
            )}
          </div>
          <div className="admin-form-group">
            <label>Artist Photo (optional): </label>
            <input type="file" accept="image/*" onChange={handleArtistPhotoChange} />
          </div>
          <div className="admin-form-group">
            <label>Song Image: </label>
            <input type="file" accept="image/*" onChange={handleImageChange} />
          </div>
          <div className="admin-form-group">
            <label>Song URL: </label>
            <input type="text" value={songUrl} onChange={e => setSongUrl(e.target.value)} className="admin-input" placeholder="https://..." />
          </div>
          <button type="submit" disabled={uploading} className="admin-upload-btn">Upload</button>
        </form>
        {uploading && (
          <div className="admin-uploading-spinner" style={{marginTop:'16px'}}>
            <svg width="36" height="36" viewBox="0 0 50 50">
              <circle cx="25" cy="25" r="20" fill="none" stroke="#2a5d9f" strokeWidth="5" strokeLinecap="round" strokeDasharray="31.4 31.4" transform="rotate(-90 25 25)">
                <animateTransform attributeName="transform" type="rotate" from="0 25 25" to="360 25 25" dur="1s" repeatCount="indefinite" />
              </circle>
            </svg>
            <div style={{color:'#2a5d9f',marginTop:'8px',fontWeight:'bold'}}>Uploading...</div>
          </div>
        )}
        {error && <p className="admin-error-msg">{error}</p>}
        {success && <p className="admin-success-msg">{success}</p>}
      </div>
    );
  }

  // Update Music UI
  if (option === 'update') {
    return (
      <div className="admin-update-container" style={{ paddingBottom: '80px' }}>
        <button onClick={()=>setOption(null)} className="admin-back-btn">&larr; Back</button>
        <h2>Update Music</h2>
        {loadingSongs ? (
          <p className="admin-loading-msg">Loading songs...</p>
        ) : songs.length === 0 ? (
          <p className="admin-loading-msg">No uploaded songs yet.</p>
        ) : (
          <div className="admin-song-list">
            {songs.map((song) => (
              <div key={song.id} className="admin-song-item">
                <img src={song.thumbnail} alt={song.title} className="admin-song-thumb" />
                <div className="admin-song-info">
                  <div className="admin-song-title">{song.title}</div>
                  <div className="admin-song-artist">{song.artist}</div>
                </div>
                <button onClick={() => setEditSong(song)} className="admin-edit-btn" title="Edit">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#00cfff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/></svg>
                </button>
              </div>
            ))}
          </div>
        )}
        {/* Edit Song Modal */}
        {editSong && (
          <div className="admin-edit-modal-bg">
            <div className="admin-edit-modal">
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
                <div className="admin-form-group">
                  <label>Song Name: </label>
                  <input type="text" name="title" defaultValue={editSong.title} className="admin-input" />
                </div>
                <div className="admin-form-group">
                  <label>Artist Name: </label>
                  <input type="text" name="artist" defaultValue={editSong.artist} className="admin-input" />
                </div>
                <div className="admin-form-group">
                  <label>Artist Photo (optional): </label>
                  <input type="file" name="artistPhoto" accept="image/*" />
                </div>
                <div className="admin-form-group">
                  <label>Thumbnail: </label>
                  <input type="file" name="thumbnail" accept="image/*" />
                  <img src={editSong.thumbnail} alt="Current Thumbnail" className="admin-edit-thumb" />
                </div>
                <div className="admin-form-group">
                  <label>Song URL: </label>
                  <input type="text" name="url" defaultValue={editSong.url} className="admin-input" />
                </div>
                <button type="submit" disabled={uploading} className="admin-save-btn">Save</button>
                <button type="button" onClick={()=>setEditSong(null)} className="admin-cancel-btn">Cancel</button>
                <button type="button" onClick={async()=>{
                  if(window.confirm('Delete this song?')){
                    setUploading(true);
                    await handleDelete(editSong.id);
                    setEditSong(null);
                    setUploading(false);
                  }
                }} className="admin-delete-btn">Delete</button>
                {error && <p className="admin-error-msg">{error}</p>}
                {success && <p className="admin-success-msg">{success}</p>}
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }
};

export default Admin;