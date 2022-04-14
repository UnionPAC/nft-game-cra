const CONTRACT_ADDRESS = "0xC5AeD9A694232Fc8fa11a2b3f44Cdd21e8A4B366";

const transformCharacterData = (CharacterData) => {
  return {
    name: CharacterData.name,
    imageURI: CharacterData.imageURI,
    hp: CharacterData.hp.toNumber(),
    maxHp: CharacterData.maxHp.toNumber(),
    attackDamage: CharacterData.attackDamage.toNumber(),
  };
};

export { CONTRACT_ADDRESS, transformCharacterData };
