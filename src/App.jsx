import { useState, useEffect, useRef } from "react";
import "./App.css";
import Card from "./Card/Card";
import pokemonList from "./assets/pokemonList";
import shuffleArray from "./ShuffleArray";

function App() {
  //FOR DEBUGGING PURPOSES
  const [pokemonInError, setPokemonInError] = useState([]);
  const [countCompletedRequests, setCountCompletedRequests] = useState(0);
  function reportError(pokemonName) {
    setPokemonInError((prevErrors) => [...prevErrors, pokemonName]);
  }

  const initialRender = useRef(true);

  //THE REMAINING POKEMONS
  const [remainingPokemons, setRemainingPokemons] = useState([...pokemonList]);

  //THE CURRENT RANDOM 8 POKEMONS TO CHOOSE FROM
  const [currentRandomPokemons, setCurrentRandomPokemons] = useState(
    shuffleArray(remainingPokemons).slice(0, 8)
  );

  //POKEMONS THAT THE USER HAS SELECTED
  const [alreadySelectedPokemons, setAlreadySelectedPokemons] = useState([]);

  //GAME OVER and SCORE
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);

  //CALLED WHEN USER SELECTS A POKEMON
  function processPlayerSelection(pokemon) {
    if (gameOver) return;
    if (alreadySelectedPokemons.includes(pokemon)) {
      setGameOver(true);
      return;
    } else {
      setAlreadySelectedPokemons((prevArray) => [...prevArray, pokemon]);
      setRemainingPokemons((prevArray) =>
        prevArray.filter((item) => item !== pokemon)
      );
      setScore(score + 1);
    }
  }

  function resetGame() {
    setScore(0);
    setGameOver(false);
    initialRender.current = true;
    setRemainingPokemons([...pokemonList]);
    setCurrentRandomPokemons(shuffleArray(remainingPokemons).slice(0, 8));
    setAlreadySelectedPokemons([]);
  }

  //REFRESH 8 RANDOM POKEMONS
  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false;
      return;
    }

    const MIN = Math.max(0, 8 - alreadySelectedPokemons.length);
    const MAX = 8;
    let counter;
    let newRandomPokemons = [];

    shuffleArray(remainingPokemons);
    shuffleArray(alreadySelectedPokemons);

    //TAKE THE LOWER OF 8 OR THE LENGTH OF remainingPokemons
    const numberOfNewPokemon = Math.min(
      remainingPokemons.length,
      Math.floor(Math.floor(Math.random() * (MAX - MIN + 1)) + MIN)
    );

    //TAKE FROM remaningPokemons
    for (let i = 0; i < numberOfNewPokemon; i++) {
      newRandomPokemons.push(remainingPokemons[i]);
    }

    //FILL THE REMAINDER OF THE ARRAY FROM THE ALREADY SELECTED POKEMONS
    counter = MAX - newRandomPokemons.length;
    for (let i = 0; i < counter; i++) {
      newRandomPokemons.push(alreadySelectedPokemons[i]);
    }

    shuffleArray(newRandomPokemons);
    setCurrentRandomPokemons(newRandomPokemons);
  }, [alreadySelectedPokemons]);

  //TRIGGER WHEN ITS GAME OVER!
  useEffect(() => {
    if (gameOver) {
      console.log(`GameOver! Your score was ${score}`);
      //NEED TO ADD MODAL ANNOUNCING
    }
  }, [gameOver]);

  return (
    <div>
      {gameOver ? <p>GAME OVER!</p> : null}
      <p>Score: {score}</p>
      <div id="cardFrame">
        {currentRandomPokemons.map((item) => (
          <Card
            key={item}
            pokemonName={item}
            reportError={reportError}
            setCountCompletedRequests={setCountCompletedRequests}
            selectPokemon={processPlayerSelection}
          />
        ))}
      </div>
      <button onClick={resetGame}>Reset</button>
    </div>
  );
}

export default App;
