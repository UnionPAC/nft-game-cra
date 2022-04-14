const CONTRACT_ADDRESS = "0x82E3cf99e8D9dB265FE1F459974Af300c7921974";

const transformCharacterData = (CharacterData) => {
  return {
    name: CharacterData.name,
    imageURI: CharacterData.imageURI,
    hp: CharacterData.hp.toNumber(),
    maxHp: CharacterData.hp.toNumber(),
    attackDamage: CharacterData.attackDamage.toNumber(),
  };
};

export { CONTRACT_ADDRESS, transformCharacterData };
