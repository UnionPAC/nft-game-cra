import React, { useState, useEffect } from "react";
import "./SelectCharacter.css";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS, transformCharacterData } from "../../constants";
import myEpicGame from "../../utils/MyEpicGame.json";

const SelectCharacter = ({ setCharacterNFT }) => {
  // this holds all the character metadat we get back from our contract
  const [characters, setCharacters] = useState([]);

  // initialze our actual game contract and store in state (to be used multiple times)
  const [gameContract, setGameContract] = useState(null);

  const mintCharacterNFTAction = async (characterId) => {
    try {
      if (gameContract) {
        console.log("Minting character in progress...");
        const mintTx = gameContract.mintCharacterNFT(characterId);
        await mintTx.wait();
        console.log("mint tx:", mintTx);
      }
    } catch (error) {
      console.warn("MintCharacterAction Error:", error);
    }
  };

  // render methods
  const renderCharacters = () =>
    characters.map((character, index) => (
      <div className="character-item" key={character.name}>
        <div className="name-container">
          <p>{character.name}</p>
        </div>
        <img src={character.imageURI} alt={character.name} />
        <button
          type="button"
          className="character-mint-button"
          onClick={() => mintCharacterNFTAction(index)}
        >
          {`Mint ${character.name}`}
        </button>
      </div>
    ));

  // setting game contract to state
  useEffect(() => {
    const { ethereum } = window;
    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const gameContract = new ethers.Contract(
        CONTRACT_ADDRESS,
        myEpicGame.abi,
        signer
      );

      // set gameContract in state
      setGameContract(gameContract);
      console.log("Game Contract set!");
    } else {
      console.log("Ethereum object not found :( ");
    }
  }, []);

  useEffect(() => {
    const getCharacters = async () => {
      try {
        console.log("Getting contract characters to mint!");

        const charactersTx = await gameContract.getAllDefaultCharacters();
        console.log("charactersTx:", charactersTx);

        // Transform the character data...
        const characters = charactersTx.map((characterData) =>
          transformCharacterData(characterData)
        );

        // set characters in state
        setCharacters(characters);
      } catch (error) {
        console.error("Something went wrong fetching characters ...", error);
      }
    };

    const onCharacterMint = async (sender, tokenId, characterIndex) => {
      console.log(
        `CharacterNFTMinted - sender: ${sender} tokenId: ${tokenId} characterIndex: ${characterIndex} `
      );
      if (gameContract) {
        const characterNFT = await gameContract.checkIfUserHasNFT();
        console.log("Character NFT: ", characterNFT);
        setCharacterNFT(transformCharacterData(characterNFT));
        alert(
          `Your NFT is all done -- see it here: https://testnets.opensea.io/assets/${CONTRACT_ADDRESS}/${tokenId.toNumber()}`
        );
      }
    };

    if (gameContract) {
      getCharacters();
      // setup NFT Minted Listener
      gameContract.on("CharacterNFTMinted", onCharacterMint);
    }

    return () => {
      // cleanup
      if (gameContract) {
        gameContract.off("CharcterNFTMinted", onCharacterMint);
      }
    };
  }, [gameContract]);

  return (
    <div className="select-character-container">
      <h2 style={{ padding: "30px 0" }}>Mint Your Hero .... Choose Wisely!</h2>
      {characters.length > 0 && (
        <div className="character-grid">{renderCharacters()}</div>
      )}
    </div>
  );
};

export default SelectCharacter;
