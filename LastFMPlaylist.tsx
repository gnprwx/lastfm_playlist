import { useEffect, useState } from "react";
import axios from "axios";
import sound from "./sound.gif";

interface LFMProps {
  user: string,
  refresh: number,
  limit: number
}

interface SongTypes {
  artist: { "#text": string },
  name: string,
  url: string,
  image: { "#text": string }[]
}


const LastFMPlaylist = ({ user = "vagab0nd_", refresh = 30, limit = 10 }: LFMProps) => {
  const LFM = import.meta.env.VITE_LASTFM;
  const [songs, setSongs] = useState([]);
  const [songError, setSongError] = useState("");
  const PLACEHOLDER_ART: string = "2a96cbd8b46e442fc41c2b86b821562f.png";

  // Minimal Styling
  const SONGS_LIST: object = {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    listStyle: "none"
  }
  const CURRENTLY_PLAYING: object = {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontWeight: "700",
    borderRadius: "0.5em"
  }
  const ALBUM_ART: object = { borderRadius: "0.5em", width: "64px" }

  const getSongs = async () => {
    try {
      const response = await axios.get(
        `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${user}&api_key=${LFM}&limit=${limit}&format=json`
      );
      const data = await response.data.recenttracks.track;
      setSongs(data);
    } catch (error) {
      setSongError("Error fetching songs... ;(")
    }
  }

  useEffect(() => {
    getSongs();
    const interval = setInterval(getSongs, (refresh * 1000));
    return () => clearInterval(interval);
  }, [])

  return (
    <ul style={SONGS_LIST}>
      {songs.length === 0 &&
        <>
          {songError.length === 0 ?
            <li>Loading songs...</li>
            :
            <li>{songError}</li>}
        </>
      }
      {songs.length === 10 &&
        <li style={{ fontWeight: "700" }}>No music playing</li>
      }
      {songs.map(({ artist, name, url, image }: SongTypes, index) =>
        <li key={index}>
          <>
            {songs.length === 11 && index === 0 ?
              <>
                {image[1]["#text"].slice(-36) === PLACEHOLDER_ART ?
                  <div style={CURRENTLY_PLAYING}>
                    <img src={sound} />
                    <a href={url} target="_blank">{artist["#text"]} - {name}</a>
                  </div>
                  :
                  <div style={CURRENTLY_PLAYING}>
                    <img src={image[3]["#text"]} style={ALBUM_ART} />
                    <img src={sound} />
                    <a href={url} target="_blank">{artist["#text"]} - {name}</a>
                  </div>
                }
              </>
              :
              <a href={url} target="_blank">{artist["#text"]} - {name}</a>
            }
          </>
        </li>
      )}
    </ul>
  )
}

export default LastFMPlaylist