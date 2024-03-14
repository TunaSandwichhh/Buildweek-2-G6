import { ArtistOverview } from "./types/ArtistOverview";
import { Track } from "./types/Track";

const urlParams = new URLSearchParams(window.location.search);
const artistId = urlParams.get("id");

const options = {
  method: "GET",
  headers: {
    "X-RapidAPI-Key": "3332715f74msh602a78a6b6a8068p1c70cbjsnf18409ce7070",
    "X-RapidAPI-Host": "spotify81.p.rapidapi.com",
  },
};

const formatMilliseconds = (milliseconds: number): string => {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  const formattedMinutes = minutes.toString();
  const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds.toString();

  return `${formattedMinutes}:${formattedSeconds}`;
};

const getArtistOverview = async (
  id: string
): Promise<ArtistOverview | null> => {
  try {
    const response = await fetch(
      `https://spotify81.p.rapidapi.com/artist_overview?id=${id}`,
      options
    );
    console.log(response.ok);

    const data = await response.json();
    console.log(data);

    return data.data.artist as ArtistOverview;
  } catch (e) {
    console.log(e);
    return null;
  }
};

const getTrackDetails = async (id: string): Promise<Track | null> => {
  try {
    const response = await fetch(
      `https://spotify81.p.rapidapi.com/tracks?ids=${id}`,
      options
    );

    const trackDetails = await response.json();

    return trackDetails.tracks[0] as Track;
  } catch (e) {
    console.log(e);
    return null;
  }
};

const renderHeader = (artistOvw: ArtistOverview) => {
  const artistHeroDesc = document.getElementById(
    "artistHeroDesc"
  ) as HTMLElement | null;

  const artistHeroDiv = document.getElementById(
    "artistHero"
  ) as HTMLElement | null;

  if (artistHeroDiv) {
    artistHeroDiv.style.backgroundImage = `url('${artistOvw.visuals.headerImage.sources[0].url}')`;
  }

  if (artistHeroDesc) {
    artistHeroDesc.innerHTML = `
    <p class="mb-0"><i class="bi bi-check-circle-fill me-2"></i>Artista verificato</p>
    <p class="playlist-name display-2 fw-bold" id="playlistName">${
      artistOvw.profile.name
    }</p>
    <p>${artistOvw.stats.monthlyListeners.toLocaleString(
      "en-US"
    )} ascoltatori mensili</p>
    `;
  }
};

const renderPopularTracks = (artistOvw: ArtistOverview, index: number) => {
  const bodyRightDiv = document.getElementById(
    "body-right"
  ) as HTMLElement | null;
  const audioElement = document.getElementById(
    "audioElement"
  ) as HTMLAudioElement | null;
  const currentTrackImage = document.getElementById(
    "currentTrackImage"
  ) as HTMLImageElement | null;
  const playerTrackName = document.getElementById(
    "playerTrackName"
  ) as HTMLElement | null;
  const playerArtistName = document.getElementById(
    "playerArtistName"
  ) as HTMLElement | null;

  if (bodyRightDiv) {
    const trackDiv = document.createElement("div");
    trackDiv.classList.add(
      "row",
      "row-single-tracks",
      "d-flex",
      "align-items-center"
    );

    const artistLinks = artistOvw.discography.topTracks.items[
      index
    ].track.artists.items.map(
      (artist) =>
        `<a href="../../artists.html?id=${artist.uri
          .split(":")
          .pop()}" class="text-decoration-none text-secondary">${
          artist.profile.name
        }</a>`
    );

    trackDiv.innerHTML = `
    <div class="col">${index + 1}</div>
    <div class="col-5 d-flex">
      <div>
        <img id="trackImg-${index + 1}"
          src="${
            artistOvw.discography.topTracks.items[index].track.album.coverArt
              .sources[0].url
          }"
          class="img-fluid " />
      </div>
      <div class="d-flex flex-column justify-content-center">
        <p class="mb-0">
          <a href="../../album.html?id=${artistOvw.discography.topTracks.items[
            index
          ].track.album.uri
            .split(":")
            .pop()}" class="text-decoration-none text-white">${
      artistOvw.discography.topTracks.items[index].track.name
    }</a>
        </p>
        <p class="my-0">
          ${artistLinks}
        </p>
      </div>
    </div>
    <div class="col">${formatMilliseconds(
      artistOvw.discography.topTracks.items[index].track.duration
        .totalMilliseconds
    )}</div>
    `;

    bodyRightDiv.appendChild(trackDiv);

    const trackImg = document.getElementById(
      `trackImg-${index + 1}`
    ) as HTMLImageElement;

    trackImg?.addEventListener("click", async () => {
      if (
        audioElement &&
        currentTrackImage &&
        playerArtistName &&
        playerTrackName
      ) {
        currentTrackImage.src =
          artistOvw.discography.topTracks.items[
            index
          ].track.album.coverArt.sources[0].url;
        playerTrackName.innerText =
          artistOvw.discography.topTracks.items[index].track.name;
        playerArtistName.innerText = `${artistOvw.discography.topTracks.items[
          index
        ].track.artists.items.map((artist) => artist.profile.name)}`;

        const trackDetails = await getTrackDetails(
          artistOvw.discography.topTracks.items[index].track.id
        );

        if (trackDetails) {
          audioElement.src = trackDetails.preview_url;
          audioElement.play();
        }
      }
    });
  }
};

// const renderPopularTracks = (artistOvw: ArtistOverview) => {
//   const popularTracksDiv = document.getElementById(
//     "popularTracks"
//   ) as HTMLElement | null;
//   const audioElement = document.getElementById(
//     "audioElement"
//   ) as HTMLAudioElement | null;
//   const currentTrackImage = document.getElementById(
//     "currentTrackImage"
//   ) as HTMLImageElement | null;

//   if (popularTracksDiv) {
//     artistOvw.discography.topTracks.items.slice(0, 5).forEach((trackItem) => {
//       const trackDiv = document.createElement("div");

//       trackDiv.innerHTML = `
//         <img src="${trackItem.track.album.coverArt.sources[0].url}"/>
//         <p>${trackItem.track.name}</p>
//       `;

//       trackDiv.addEventListener("click", async () => {
//         if (audioElement && currentTrackImage) {
//           currentTrackImage.src = trackItem.track.album.coverArt.sources[0].url;

//           const trackDetails = await getTrackDetails(trackItem.track.id);
//           if (trackDetails) {
//             audioElement.src = trackDetails.preview_url;
//             audioElement.play();
//           }
//         }
//       });

//       popularTracksDiv.appendChild(trackDiv);
//     });
//   }
// };

const renderDiscography = (artistOvw: ArtistOverview, index: number) => {
  const discographyDiv = document.getElementById(
    "discography"
  ) as HTMLElement | null;

  if (discographyDiv) {
    const albumDiv = document.createElement("div");
    albumDiv.innerHTML = `

      <a href="../../album.html?id=${artistOvw.discography.albums.items[index].releases.items[0].id}">
      <img src="${artistOvw.discography.albums.items[index].releases.items[0].coverArt.sources[0].url}"/>
      <p>${artistOvw.discography.albums.items[index].releases.items[0].name}</p>
      </a>
    `;

    discographyDiv.appendChild(albumDiv);
  }
};

const renderRelatedArtists = (artistOvw: ArtistOverview, index: number) => {
  const relatedArtistsDiv = document.getElementById(
    "relatedArtists"
  ) as HTMLElement | null;

  if (relatedArtistsDiv) {
    const artistDiv = document.createElement("div");

    artistDiv.innerHTML = `

    <a href="../../artists.html?id=${artistOvw.relatedContent.relatedArtists.items[index].id}">
      <img src="${artistOvw.relatedContent.relatedArtists.items[index].visuals.avatarImage.sources[0].url}"/>
      <p>${artistOvw.relatedContent.relatedArtists.items[index].profile.name}</p>
    </a>
    `;

    relatedArtistsDiv.appendChild(artistDiv);
  }
};

const handleLoad = async () => {
  if (artistId) {
    console.log(artistId);
    const artistOvw = await getArtistOverview(artistId);
    if (artistOvw) {
      renderHeader(artistOvw);

      const popularTracks = artistOvw.discography.topTracks.items;

      popularTracks.forEach((popularTrack, index) => {
        if (index < 5) renderPopularTracks(artistOvw, index);
      });

      const artistAlbums = artistOvw.discography.albums.items;

      artistAlbums.forEach((album, index) => {
        if (index < 5) {
          renderDiscography(artistOvw, index);
        }
      });

      const relatedArtists = artistOvw.relatedContent.relatedArtists.items;

      relatedArtists.forEach((artist, index) => {
        if (index < 5) {
          renderRelatedArtists(artistOvw, index);
        }
      });
    }
  }
};

document.addEventListener("DOMContentLoaded", handleLoad);
