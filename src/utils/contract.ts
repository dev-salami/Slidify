export const CA = "0x434B838d72358ba1F70698e01f6939979352A8C9";

export const CONTRACT_ADMIN = "0x8816Fa30064cEf7E532E6597C0F4B0adAACF0401";
export const ABI = [
  { type: "constructor", inputs: [], stateMutability: "nonpayable" },
  {
    type: "function",
    name: "GOLD_HINT_PRICE",
    inputs: [],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "SILVER_HINT_PRICE",
    inputs: [],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "admin",
    inputs: [],
    outputs: [{ name: "", type: "address", internalType: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "buyHint",
    inputs: [
      { name: "gameId", type: "uint256", internalType: "uint256" },
      {
        name: "hintType",
        type: "uint8",
        internalType: "enum Puzzle.HINT_TYPE",
      },
    ],
    outputs: [],
    stateMutability: "payable",
  },
  {
    type: "function",
    name: "cancelGame",
    inputs: [{ name: "gameId", type: "uint256", internalType: "uint256" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "createNewGame",
    inputs: [{ name: "gridSize", type: "uint8", internalType: "uint8" }],
    outputs: [
      { name: "", type: "uint256", internalType: "uint256" },
      { name: "", type: "bytes32", internalType: "bytes32" },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "currentGameId",
    inputs: [],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "games",
    inputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    outputs: [
      { name: "shuffleHash", type: "bytes32", internalType: "bytes32" },
      { name: "gridSize", type: "uint8", internalType: "uint8" },
      { name: "isActive", type: "bool", internalType: "bool" },
      { name: "isSolved", type: "bool", internalType: "bool" },
      { name: "player", type: "address", internalType: "address" },
      {
        name: "hintType",
        type: "uint8",
        internalType: "enum Puzzle.HINT_TYPE",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getGame",
    inputs: [{ name: "gameId", type: "uint256", internalType: "uint256" }],
    outputs: [
      { name: "shuffleHash", type: "bytes32", internalType: "bytes32" },
      { name: "gridSize", type: "uint8", internalType: "uint8" },
      { name: "isActive", type: "bool", internalType: "bool" },
      { name: "isSolved", type: "bool", internalType: "bool" },
      {
        name: "hintType",
        type: "uint8",
        internalType: "enum Puzzle.HINT_TYPE",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getUserCurrentGame",
    inputs: [],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "solvePuzzle",
    inputs: [{ name: "gameId", type: "uint256", internalType: "uint256" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "userCurrentGame",
    inputs: [{ name: "", type: "address", internalType: "address" }],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "withdrawFunds",
    inputs: [],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "event",
    name: "GameCanceled",
    inputs: [
      {
        name: "gameId",
        type: "uint256",
        indexed: true,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "GameCreated",
    inputs: [
      {
        name: "gameId",
        type: "uint256",
        indexed: true,
        internalType: "uint256",
      },
      {
        name: "shuffleHash",
        type: "bytes32",
        indexed: false,
        internalType: "bytes32",
      },
      {
        name: "gridSize",
        type: "uint8",
        indexed: false,
        internalType: "uint8",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "GameSolved",
    inputs: [
      {
        name: "gameId",
        type: "uint256",
        indexed: true,
        internalType: "uint256",
      },
      {
        name: "solver",
        type: "address",
        indexed: false,
        internalType: "address",
      },
    ],
    anonymous: false,
  },
  { type: "error", name: "GameNotActive", inputs: [] },
  { type: "error", name: "GameNotSolved", inputs: [] },
  { type: "error", name: "InvalidGridSize", inputs: [] },
  { type: "error", name: "InvalidHintType", inputs: [] },
  { type: "error", name: "InvalidPaymentAmount", inputs: [] },
  { type: "error", name: "NotAdmin", inputs: [] },
  { type: "error", name: "NotGameCreator", inputs: [] },
];

export const ABI2 = [
  { type: "constructor", inputs: [], stateMutability: "nonpayable" },
  {
    type: "function",
    name: "createNewGame",
    inputs: [{ name: "gridSize", type: "uint8", internalType: "uint8" }],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "currentGameId",
    inputs: [],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "games",
    inputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    outputs: [
      { name: "shuffleHash", type: "bytes32", internalType: "bytes32" },
      { name: "gridSize", type: "uint8", internalType: "uint8" },
      { name: "isActive", type: "bool", internalType: "bool" },
      { name: "isSolved", type: "bool", internalType: "bool" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getGame",
    inputs: [{ name: "gameId", type: "uint256", internalType: "uint256" }],
    outputs: [
      { name: "shuffleHash", type: "bytes32", internalType: "bytes32" },
      { name: "gridSize", type: "uint8", internalType: "uint8" },
      { name: "isActive", type: "bool", internalType: "bool" },
      { name: "isSolved", type: "bool", internalType: "bool" },
    ],
    stateMutability: "view",
  },
  {
    type: "event",
    name: "GameCreated",
    inputs: [
      {
        name: "gameId",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "shuffleHash",
        type: "bytes32",
        indexed: false,
        internalType: "bytes32",
      },
      {
        name: "gridSize",
        type: "uint8",
        indexed: false,
        internalType: "uint8",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "GameSolved",
    inputs: [
      {
        name: "gameId",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "solver",
        type: "address",
        indexed: false,
        internalType: "address",
      },
    ],
    anonymous: false,
  },
];
