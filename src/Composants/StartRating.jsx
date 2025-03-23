import { useEffect, useState } from "react";

const styleContainer = {
  display: "flex",
  gap: "10px",
};

const styleContainerStart = {
  display: "flex",
  alignItems: "center",
};

export default function StartRating({
  maxRating = 5,
  color = "rgb(198, 173, 126)",
  size = "16px",
  commentaire = true,
  saveRate,
}) {
  const [rating, setRating] = useState(0);
  const [tempRating, setTempRating] = useState(0);
  useEffect(
    function () {
      saveRate(rating);
    },
    [rating]
  );

  const Appreciation =
    rating === 0
      ? "null"
      : rating === 1 || rating === 2
      ? "passable"
      : rating === 3 || rating === 4
      ? "bien"
      : "excellent";
  return (
    <>
      <div style={styleContainer}>
        <div className="startRating" style={styleContainerStart}>
          {" "}
          {Array.from({ length: maxRating }, (_, i) => (
            <Start
              key={i}
              onRate={setRating}
              i={i}
              full={i >= (tempRating > rating ? tempRating : rating)}
              onHoverIn={() => setTempRating(i + 1)}
              onHoverOut={() => setTempRating(0)}
              color={color}
              size={size}
            />
          ))}{" "}
        </div>

        <span style={{ fontSize: "16px" }}>
          {tempRating > rating ? tempRating : rating}
        </span>
      </div>
      {/* <span style={{ fontSize: size }}>
        {rating === 0
          ? "null"
          : rating === 1 || rating === 2
          ? "passable"
          : rating === 3 || rating === 4
          ? "bien"
          : "excellent"}
      </span> */}
    </>
  );
}

function Start({ onRate, i, full, onHoverIn, onHoverOut, size, color }) {
  const styleStart = {
    width: size,
    height: size,
    cursor: "pointer",
  };
  function HandleRate() {
    onRate(i + 1);
  }

  return (
    <>
      <span
        onClick={HandleRate}
        style={styleStart}
        onMouseEnter={onHoverIn}
        onMouseLeave={onHoverOut}
      >
        {full ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="#000"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="{2}"
              d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill={color}
            stroke={color}
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        )}
      </span>
    </>
  );
}
