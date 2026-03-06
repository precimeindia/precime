// Static data for global precious metal mining hubs
export interface MiningHub {
  id: string;
  country: string;
  coordinates: [number, number]; // [longitude, latitude]
  metals: {
    symbol: string;
    name: string;
    globalShare: string;
    description: string;
  }[];
}

export const MINING_HUBS: MiningHub[] = [
  {
    id: "zaf",
    country: "South Africa",
    coordinates: [22.9375, -30.5595], // Central South Africa
    metals: [
      {
        symbol: "Pt",
        name: "Platinum",
        globalShare: "~70%",
        description: "The Bushveld Complex holds the vast majority of the world's known Platinum Group Metals (PGM) reserves."
      },
      {
        symbol: "Pd",
        name: "Palladium",
        globalShare: "~35%",
        description: "A co-product of platinum mining, making South Africa the second-largest global producer behind Russia."
      },
      {
        symbol: "Rh",
        name: "Rhodium",
        globalShare: "~80%",
        description: "Extremely rare byproduct of platinum mining. South Africa completely dominates global supply."
      },
      {
        symbol: "Ir",
        name: "Iridium",
        globalShare: ">80%",
        description: "Mined almost entirely as a byproduct in the Bushveld Complex."
      },
      {
        symbol: "Ru",
        name: "Ruthenium",
        globalShare: ">85%",
        description: "Another incredibly rare PGM heavily dependent on South African output."
      }
    ]
  },
  {
    id: "rus",
    country: "Russia",
    coordinates: [105.3188, 61.524], // Central Russia
    metals: [
      {
        symbol: "Pd",
        name: "Palladium",
        globalShare: "~40%",
        description: "Norilsk Nickel is the world's largest individual producer of palladium, usually mined alongside nickel."
      },
      {
        symbol: "Pt",
        name: "Platinum",
        globalShare: "~10%",
        description: "Significant producer but secondary to South Africa."
      }
    ]
  },
  {
    id: "chn",
    country: "China",
    coordinates: [104.1954, 35.8617],
    metals: [
      {
        symbol: "Au",
        name: "Gold",
        globalShare: "~10%",
        description: "Historically the world's largest gold-producing nation, driven by domestic demand and state-owned enterprises."
      }
    ]
  },
  {
    id: "aus",
    country: "Australia",
    coordinates: [133.7751, -25.2744],
    metals: [
      {
        symbol: "Au",
        name: "Gold",
        globalShare: "~10%",
        description: "Massive reserves and highly developed mining infrastructure keep Australia neck-and-neck with China for top gold production."
      }
    ]
  },
  {
    id: "mex",
    country: "Mexico",
    coordinates: [-102.5528, 23.6345],
    metals: [
      {
        symbol: "Ag",
        name: "Silver",
        globalShare: "~25%",
        description: "The undisputed leader in global silver production, with massive primary silver mines like Penasquito."
      }
    ]
  },
  {
    id: "per",
    country: "Peru",
    coordinates: [-75.0152, -9.19],
    metals: [
      {
        symbol: "Ag",
        name: "Silver",
        globalShare: "~15%",
        description: "A historic mining powerhouse, Peru is consistently the second or third largest silver producer globally."
      },
      {
        symbol: "Cu",
        name: "Copper",
        globalShare: "~10%",
        description: "A major player in the copper market, tightly linked to silver and gold byproduct production."
      }
    ]
  },
  {
    id: "chl",
    country: "Chile",
    coordinates: [-71.543, -35.6751],
    metals: [
      {
        symbol: "Cu",
        name: "Copper",
        globalShare: "~28%",
        description: "The absolute titan of the copper industry. Codelco and Escondida drive global copper pricing."
      }
    ]
  },
  {
    id: "can",
    country: "Canada",
    coordinates: [-106.3468, 56.1304],
    metals: [
      {
        symbol: "Au",
        name: "Gold",
        globalShare: "~6%",
        description: "The Canadian Shield holds vast gold deposits, with significant long-term secure production."
      }
    ]
  }
];
