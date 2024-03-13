import { Playlist } from "./types/Playlist";
import { Track } from "./types/Track";

const urlParams = new URLSearchParams(window.location.search);
const playlistId = urlParams.get("id");

const options = {
  method: "GET",
  headers: {
    "X-RapidAPI-Key": "1c97dd9171mshce60f6ca494e49ep1675cbjsn61e55e9dd7f6",
    "X-RapidAPI-Host": "spotify81.p.rapidapi.com",
  },
};

const getPlaylistTracks = async (id: string): Promise<Track[]> => {
  const playlistTracks: Track[] = [];
  try {
    const response = await fetch(
      `https://spotify81.p.rapidapi.com/playlist?id=${id}`,
      options
    );
    const data = (await response.json()) as Playlist;

    for (let trackData of data.tracks.items) {
      playlistTracks.push(trackData.track);
    }

    return playlistTracks;
  } catch (e) {
    console.log(e);
    return [];
  }
};

const getPlaylist = async (id: string): Promise<Playlist | null> => {
  try {
    const response = await fetch(
      `https://spotify81.p.rapidapi.com/playlist?id=${id}`,
      options
    );
    return (await response.json()) as Playlist;
  } catch (e) {
    console.log(e);
    return null;
  }
};

const renderPlaylistTrack = (track: Track) => {
  const playlistTracks = document.getElementById(
    "playlistTracks"
  ) as HTMLElement | null;
  const audioElement = document.getElementById(
    "audioElement"
  ) as HTMLAudioElement | null;
  const currentTrackImage = document.getElementById(
    "currentTrackImage"
  ) as HTMLImageElement | null;

  if (playlistTracks) {
    console.log("Album: ", track.album);

    const trackDiv = document.createElement("div");
    const artistLinks = track.artists.map(
      (artist) =>
        `<a href="../../artists.html?id=${artist.id}">${artist.name}</a>`
    );
    trackDiv.innerHTML = `
 <img src="${track.album.images[0].url}"/>  
 <h1>${track.name}</h1>
 <h2>${artistLinks}</h2>
 <a href="../../album.html?id=${track.album.id}">
  <p>${track.album.name}</p>
 </a>
 <p>${track.duration_ms}</p>
 `;

    trackDiv.addEventListener("click", () => {
      if (audioElement && currentTrackImage) {
        currentTrackImage.src = track.album.images[0].url;
        audioElement.src = track.preview_url;
        audioElement.play();
      }
    });

    playlistTracks.appendChild(trackDiv);
  }
};

const renderPlaylistDesc = (playlist: Playlist) => {
  const playlistDescDiv = document.getElementById(
    "playlistDesc"
  ) as HTMLElement | null;

  if (playlistDescDiv) {
    playlistDescDiv.innerHTML = `
      <img src="${playlist.images[0].url}">
      <h1>${playlist.name}</h1>
      <p>Realizzata per ${playlist.owner?.display_name}</p>
      <p>${playlist.tracks.items.length} brani</p>
    `;
  }
};

const handleLoad = async () => {
  if (playlistId) {
    const tracks = await getPlaylistTracks(playlistId);
    const playlist = await getPlaylist(playlistId);

    if (playlist) renderPlaylistDesc(playlist);

    for (let track of tracks) {
      renderPlaylistTrack(track);
    }
  }
};

document.addEventListener("DOMContentLoaded", handleLoad);