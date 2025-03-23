import { useEffect, useRef, useState } from "react";
import StartRating from "./Composants/StartRating";

const tempMovieData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
  },
  {
    imdbID: "tt0133093",
    Title: "The Matrix",
    Year: "1999",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
  },
  {
    imdbID: "tt6751668",
    Title: "Parasite",
    Year: "2019",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
  },
];

const tempWatchedData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
    runtime: 148,
    imdbRating: 8.8,
    userRating: 10,
  },
  {
    imdbID: "tt0088763",
    Title: "Back to the Future",
    Year: "1985",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
    runtime: 116,
    imdbRating: 8.5,
    userRating: 9,
  },
];

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

const KEY = "216cf407";

export default function App() {
  const [movies, setMovies] = useState(tempMovieData);
  const [query, setQuery] = useState("");
  const [IsLoading, setLoading] = useState(false);
  const [erreur, setErreur] = useState(false);
  const [selectedID, setSelectedID] = useState(null);

  const [watched, setWatched] = useState(function () {
    const dataWatched = localStorage.getItem("watched");
    return JSON.parse(dataWatched) ?? [];
  });

  function CloseMovieDetail() {
    setSelectedID(null);
  }

  function deleteMovie(id) {
    setWatched((prev) => {
      const filter = prev.filter((movie) => movie.imdbID != id);
      return filter;
    });
  }

  useEffect(
    function () {
      const controller = new AbortController();
      async function fetchMovies() {
        try {
          setLoading(true);
          setErreur(false);
          const res = await fetch(
            `https://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
            { signal: controller.signal }
          );
          const data = await res.json();
          setMovies(data.Search ?? []);
          if (!res.ok) throw new Error("quelque chose c'est passée");
        } catch (e) {
          if ((e.name = "AbortError")) {
            console.error(e.message);
            setErreur(true);
          }
        } finally {
          setLoading(false);
        }
      }

      fetchMovies();

      return function () {
        controller.abort();
      };
    },
    [query]
  );

  useEffect(
    function () {
      localStorage.setItem("watched", JSON.stringify(watched));
    },
    [watched]
  );

  return (
    <>
      <NavBar movies_={movies}>
        <Logo />
        <SearchBar query={query} setQuery={setQuery} />
        <NumResults movies__={movies} />
      </NavBar>
      <Main>
        <Box>
          {IsLoading ? (
            <p className="loader">LOADING...</p>
          ) : erreur ? (
            <p className="error">ERROR...</p>
          ) : movies.length === 0 && query.trim().length > 3 ? (
            <p className="error">AUCUN FILM TROUVEE...</p>
          ) : (
            <MoviesList
              movies__={movies}
              onSelected={setSelectedID}
              selectedID={selectedID}
            />
          )}
        </Box>
        <Box>
          {selectedID ? (
            <MovieDetails
              selectedID={selectedID}
              onClose={CloseMovieDetail}
              onSetWatched={setWatched}
              watched_={watched}
            />
          ) : (
            <>
              <WatchedSummary watched_={watched} />
              <SummaryList
                watched_={watched}
                setSelectedID={setSelectedID}
                ondeleteMovie={deleteMovie}
              />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}

function NavBar({ children }) {
  return <nav className="nav-bar">{children}</nav>;
}

function Logo() {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>usePopcorn</h1>
    </div>
  );
}

function SearchBar({ query, setQuery }) {
  const inputEl = useRef(null);

  useEffect(function () {
    function callBack(e) {
      if (document.activeElement == inputEl.current) return;
      if (e.code === "Enter") {
        inputEl.current.focus();
        setQuery("");
      }
    }

    document.addEventListener("keydown", callBack);

    return () => document.addEventListener("keydown", callBack);
  }, []);
  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      ref={inputEl}
    />
  );
}

function NumResults({ movies__ }) {
  return (
    <p className="num-results">
      Found <strong>{movies__.length}</strong> results
    </p>
  );
}

function Main({ children }) {
  return <main className="main">{children}</main>;
}

function Box({ children }) {
  const [isOpen, setIsOpen1] = useState(true);

  return (
    <div className="box">
      <button
        className="btn-toggle"
        onClick={() => setIsOpen1((open) => !open)}
      >
        {isOpen ? "–" : "+"}
      </button>
      {isOpen && children}
    </div>
  );
}

function MoviesList({ movies__, onSelected, selectedID }) {
  return (
    <ul className="list">
      {movies__?.map((movie) => (
        <Movie
          movie_={movie}
          key={movie.imdbID}
          onSelected={onSelected}
          selectedID={selectedID}
        />
      ))}
    </ul>
  );
}

function Movie({ movie_, onSelected, selectedID }) {
  function HandleClick(id) {
    onSelected((prev) => (prev === id ? null : id));
  }

  return (
    <li onClick={() => HandleClick(movie_.imdbID)}>
      <img src={movie_.Poster} alt={`${movie_.Title} poster`} />
      <h3>{movie_.Title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movie_.Year}</span>
        </p>
      </div>
    </li>
  );
}

function MovieDetails({ selectedID, onClose, onSetWatched, watched_ }) {
  const [movie, setMovie] = useState({});
  const [isLoading, setLoading] = useState(false);
  const [erreur, setErreur] = useState(false);
  useEffect(
    function () {
      async function getMovieDetail() {
        try {
          setLoading(true);
          setErreur(false);
          const res = await fetch(
            `https://www.omdbapi.com/?apikey=${KEY}&i=${selectedID}`
          );
          if (!res.ok) throw new Error("quelque chose c'est passé");
          const data = await res.json();
          setMovie(data);
        } catch (err) {
          console.log(err.message);
          setErreur(true);
        } finally {
          setLoading(false);
        }
      }
      getMovieDetail();
    },
    [selectedID]
  );

  useEffect(function () {
    function callBack(e) {
      if (e.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener("keydown", callBack);

    return function () {
      document.removeEventListener("keydown", callBack);
    };
  }, []);

  const {
    Title,
    Year,
    Poster,
    Runtime,
    imdbRating,
    Plot,
    released,
    Actors,
    Director,
    Genre,
  } = movie;

  const [userRating_, setUserRating_] = useState(0);
  //console.log(userRating_);
  function handleAddWathched() {
    console.log(userRating_);
    const movie_ = {
      imdbID: selectedID,
      Title: movie.Title,
      Year: movie.Year,
      Poster: movie.Poster,
      Runtime: Number(movie.Runtime.split(" ").at(0)),
      imdbRating: Number(movie.imdbRating),
      userRating: userRating_,
    };

    onSetWatched((prev) => {
      const filter = prev.filter((movie) => movie.imdbID != movie_.imdbID);
      return [...filter, movie_];
    });
    console.log(movie_.Runtime);
    onClose();
  }

  const Selectedmovie = watched_.find((movie) => movie.imdbID == selectedID);

  useEffect(
    function () {
      if (!Title) return;

      document.title = Title || "movie";

      return function () {
        document.title = "usePopCorn";
      };
    },
    [Title]
  );
  return (
    <>
      {isLoading ? (
        <p className="loader">LOADING...</p>
      ) : erreur ? (
        <p className="error">ERREUR...</p>
      ) : (
        <div className="details">
          <header>
            {" "}
            <button className="btn-back" onClick={onClose}>
              &larr;
            </button>
            <img src={Poster} alt={`poster of ${Title} movie`} />
            <div className="details-overview">
              <h2>{Title}</h2>
              <p>
                {released} &bull; {Runtime}
                <p>{Genre}</p>
              </p>
              <p>
                <span>⭐️</span>
                {imdbRating} iMDb rating
              </p>
            </div>
          </header>
          <section>
            {Selectedmovie ? (
              ""
            ) : (
              <div className="rating">
                {" "}
                <StartRating
                  color={"rgb(198, 173, 126)"}
                  size={"16px"}
                  //   commentaire={"Bien"}
                  maxRating={10}
                  saveRate={setUserRating_}
                />
              </div>
            )}
            {Selectedmovie ? (
              <p> Note Attribuée: {Selectedmovie.userRating}</p>
            ) : userRating_ === 0 ? (
              ""
            ) : (
              <button className="btn-add" onClick={handleAddWathched}>
                + add to list
              </button>
            )}
            <p>
              <em>{Plot}</em>
            </p>
            <p>starring {Actors}</p>
            <p>Directed by {Director}</p>
          </section>
        </div>
      )}
    </>
  );
}

function SummaryBox() {
  const [isOpen2, setIsOpen2] = useState(true);
  return (
    <div className="box">
      <button
        className="btn-toggle"
        onClick={() => setIsOpen2((open) => !open)}
      >
        {isOpen2 ? "–" : "+"}
      </button>

      {isOpen2 && <></>}
    </div>
  );
}

function WatchedSummary({ watched_ }) {
  const avgImdbRating = average(watched_.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched_.map((movie) => movie.userRating));
  const avgRuntime = average(watched_.map((movie) => movie.runtime));
  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched_.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating.toFixed(2)}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating.toFixed(2)}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime} min</span>
        </p>
      </div>
    </div>
  );
}

function SummaryList({ watched_, setSelectedID, ondeleteMovie }) {
  return (
    <ul className="list">
      {watched_.map((movie) => (
        <Summary
          movie_={movie}
          key={movie.imdbID}
          setSelectedID={setSelectedID}
          ondeleteMovie={ondeleteMovie}
        />
      ))}
    </ul>
  );
}

function Summary({ movie_, setSelectedID, ondeleteMovie }) {
  function handleClcik(movie) {
    setSelectedID(movie.imdbID);
  }
  return (
    <li onClick={() => handleClcik(movie_)}>
      <img src={movie_.Poster} alt={`${movie_.Title} poster`} />
      <h3>{movie_.Title}</h3>
      <div>
        <p>
          <span>⭐️</span>
          <span>{movie_.imdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{movie_.userRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{movie_.Runtime} min</span>
        </p>
      </div>
      <button
        className="btn-delete"
        onClick={(event) => {
          event.stopPropagation();
          ondeleteMovie(movie_.imdbID);
        }}
      >
        X
      </button>
    </li>
  );
}
