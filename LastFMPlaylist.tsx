import { useEffect, useState } from "react";
import sound from "./sound.gif";

interface LFMProps {
  user: string;
  refresh: number;
  limit: number;
}

interface SongTypes {
  artist: { "#text": string };
  name: string;
  url: string;
  image: { "#text": string }[];
}

const LastFMPlaylist = ({
  user = "vagab0nd_",
  refresh = 30,
  limit = 10
}: LFMProps) => {
  const lfm = import.meta.env.VITE_LASTFM;
  const [songs, setSongs] = useState([]);
  const [songError, setSongError] = useState("");
  const placeholderArt: string = "2a96cbd8b46e442fc41c2b86b821562f.png";

  // Minimal Styling
  const songsList: object = {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    listStyle: "none",
  }
  const currentlyPlaying: object = {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontWeight: "700",
    borderRadius: "0.5em",
  }
  const albumArt: object = { borderRadius: "0.5em", width: "64px" };
  const fontBold: object = { fontWeight: "700" };

  const getSongs = async () => {
    try {
      const response = await fetch(
        `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${user}&api_key=${lfm}&limit=${limit}&format=json`)
      const data = await response.json();
      setSongs(data.recenttracks.track);
    } catch (error) {
      setSongError("Error fetching songs... ;(");
    }
  }

  useEffect(() => {
    getSongs();
    const interval = setInterval(getSongs, refresh * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <ul style={songsList}>
      {songs.length === 0 &&
        <>
          {songError.length === 0 ?
            <li>Loading songs...</li>
            :
            <li>{songError}</li>
          }
        </>
      }
      {songs.length === limit &&
        <li style={fontBold}>No music playing</li>
      }
      {songs.map(({ artist, name, url, image }: SongTypes, index) => (
        <li key={index}>
          <>
            {songs.length === limit + 1 && index === 0 ?
              <>
                {image[1]["#text"].slice(-36) === placeholderArt ?
                  <div style={currentlyPlaying}>
                    <img src={sound} />
                    <a href={url} target="_blank" rel="noreferrer">{artist["#text"]} - {name}</a>
                  </div>
                  :
                  <div style={currentlyPlaying}>
                    <img src={image[3]["#text"]} style={albumArt} />
                    <img src={sound} />
                    <a href={url} target="_blank" rel="noreferrer">{artist["#text"]} - {name}</a>
                  </div>
                }
              </>
              :
              <a href={url} target="_blank" rel="noreferrer">{artist["#text"]} - {name}</a>
            }
          </>
        </li>
      ))}
    </ul>
  )
}

export default LastFMPlaylist