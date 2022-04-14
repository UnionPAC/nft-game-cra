import React, { useEffect, useState } from "react";
import twitterLogo from "./assets/twitter-logo.svg";
import "./App.css";
import SelectCharacter from "./Components/SelectCharacter";
import { CONTRACT_ADDRESS, transformCharacterData } from "./constants";
import myEpicGame from "./utils/MyEpicGame.json";
import { ethers } from "ethers";

// Constants
const TWITTER_HANDLE = "unionpac_";
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const App = () => {
  const [currentAccount, setCurrentAccount] = useState(null);
  const [characterNFT, setCharacterNFT] = useState(null);

  const checkNetwork = async () => {
    try {
      if (window.ethereum.networkVersion !== "4") {
        alert("Please connect to the Rinkeby Network 🙂");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        console.log("Please install MetaMask! 🦊");
        return;
      } else {
        console.log("Got the Ethereum object", ethereum);
      }

      const accounts = await ethereum.request({ method: "eth_accounts" });
      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account:", account);
        setCurrentAccount(account);
      } else {
        console.log("No authorized account found...");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const renderContent = () => {
    // Scenario 1: User has not connected to app - Show Connect To Wallet Button
    if (!currentAccount) {
      return (
        <div className="connect-wallet-container">
          <img
            src="https://media.giphy.com/media/Fbgsz50fzMGVW/giphy.gif"
            alt="Inuyasha attacking GIF"
            className="gif"
          />
          <button
            onClick={connectWallet}
            className="cta-button connect-wallet-button"
          >
            Connect Wallet To Begin
          </button>
        </div>
      );
    }
    // Scenario 2: User has connected to app and does NOT have a character NFT - Show SelectCharacter component
    if (currentAccount && !characterNFT) {
      return <SelectCharacter setCharacterNFT={setCharacterNFT} />;
    }
  };

  const connectWallet = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        alert("Get MetaMask 🦊");
        return;
      }

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    checkNetwork();
    checkIfWalletIsConnected();
  }, []);

  useEffect(() => {
    const fetchNFTMetadata = async () => {
      console.log("Checking for Character NFT on address:", currentAccount);

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const gameContract = new ethers.Contract(
        CONTRACT_ADDRESS,
        myEpicGame.abi,
        signer
      );

      const tx = await gameContract.checkIfUserHasNFT();
      console.log(tx);
      if (tx.name) {
        console.log("User has a character NFT!");
        setCharacterNFT(transformCharacterData(tx));
      } else {
        console.log("User does not have a character NFT yet!");
      }
    };

    if (currentAccount) {
      console.log("Current Account:", currentAccount);
      fetchNFTMetadata();
    }
  }, [currentAccount]);

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">💮 Inuyasha World Slayer 💮</p>
          <p className="sub-text">
            Sesshōmaru is after the Tessaiga 🗡 &nbsp;again <br /> ... team up to take
            him down!
          </p>
          {renderContent()}
        </div>

        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built by @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;
