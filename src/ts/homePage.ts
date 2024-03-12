import { Playlist } from "./types/Playlist";
import { UserProfile } from "./types/UserProfile";

const url =
  "https://spotify81.p.rapidapi.com/user_profile?id=nocopyrightsounds&playlistLimit=1&artistLimit=10";

const options = {
  method: "GET",
  headers: {
    "X-RapidAPI-Key": "5eba36709fmsh46db4e8e33040c1p10a999jsnc724d1df5f73",
    "X-RapidAPI-Host": "spotify81.p.rapidapi.com",
  },
};

const playlistIds: string[] = [];

const getPlaylistIds = async (): Promise<void> => {
  try {
    const response = await fetch(url, options);
    const data = (await response.json()) as UserProfile;

    for (let playlist of data.public_playlists) {
      let uri = playlist.uri;
      const uriKeys = uri.split(":");
      playlistIds.push(uriKeys[uriKeys.length - 1]);
    }
  } catch (e) {
    console.log(e);
  }
};

const getPlaylist = async (): Promise<Playlist[]> => {
  try {
    const playlists: Playlist[] = [];

    for (let id of playlistIds) {
      const response = await fetch(
        `https://spotify81.p.rapidapi.com/playlist?id=${id}`,
        options
      );
      const data = (await response.json()) as Playlist;
      playlists.push(data);
    }

    return playlists;
  } catch (e) {
    console.log(e);
    return [];
  }
};

const renderPlaylist = (playlist: Playlist) => {
  const playlistDiv = document.getElementById(
    "playlistDiv"
  ) as HTMLElement | null;

  if (playlistDiv) {
    const playlistCard = document.createElement("div");
    playlistCard.innerHTML = `
        <a href="../../playlist.html?id=${playlist.id}">
            <img src="${playlist.images[0].url}"/>
        </a>
        <h1>${playlist.name}</h1>
    `;
    playlistDiv.appendChild(playlistCard);
  }
};

const handleLoad = async () => {
  await getPlaylistIds();
  const playlists = await getPlaylist();

  playlists.forEach((playlist) => {
    renderPlaylist(playlist);
  });
};

document.addEventListener("DOMContentLoaded", handleLoad);