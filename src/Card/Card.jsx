import { useEffect, useState, useRef } from "react";
import "./Card.css";

export default function Card({
  pokemonName,
  reportError,
  setCountCompletedRequests,
  selectPokemon,
}) {
  const [pokemon, setPokemon] = useState();

  useEffect(() => {
    fetch("https://pokeapi.co/api/v2/pokemon/" + pokemonName.toLowerCase(), {
      mode: "cors",
    })
      .then(function (response) {
        if (!response.ok) {
          reportError(
            `${pokemonName}: Failed to fetch ${pokemonName}: ${response.statusText}`
          );
          throw new Error(
            `${pokemonName}: Failed to fetch ${pokemonName}: ${response.statusText}`
          );
        }
        return response.json();
      })
      .then(function (response) {
        setPokemon(response);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => setCountCompletedRequests((prevCount) => prevCount + 1));

    return () => {
      setCountCompletedRequests((prevCount) => prevCount - 1);
    };
  }, []);

  return (
    <div className="card" onClick={() => selectPokemon(pokemonName)}>
      {pokemon ? (
        <>
          <p>{pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</p>
          <img
            src={pokemon.sprites.other["official-artwork"].front_default}
            alt=""
          />
        </>
      ) : null}
    </div>
  );
}
