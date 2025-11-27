// Base de dados expandida de aeroportos do mundo
// Inclui aliases e termos de busca alternativos

export const airportsDatabase = [
  // BRASIL
  { iataCode: 'GRU', name: 'Aeroporto Internacional de São Paulo-Guarulhos', city: 'São Paulo', country: 'Brasil', aliases: ['guarulhos', 'sao paulo', 'sp'] },
  { iataCode: 'CGH', name: 'Aeroporto de Congonhas', city: 'São Paulo', country: 'Brasil', aliases: ['congonhas', 'sao paulo', 'sp'] },
  { iataCode: 'VCP', name: 'Aeroporto Internacional de Viracopos', city: 'Campinas', country: 'Brasil', aliases: ['viracopos', 'campinas', 'sp'] },
  { iataCode: 'GIG', name: 'Aeroporto Internacional do Galeão', city: 'Rio de Janeiro', country: 'Brasil', aliases: ['galeao', 'rio', 'rj'] },
  { iataCode: 'SDU', name: 'Aeroporto Santos Dumont', city: 'Rio de Janeiro', country: 'Brasil', aliases: ['santos dumont', 'rio', 'rj'] },
  { iataCode: 'BSB', name: 'Aeroporto Internacional de Brasília', city: 'Brasília', country: 'Brasil', aliases: ['brasilia', 'df'] },
  { iataCode: 'CNF', name: 'Aeroporto Internacional de Confins', city: 'Belo Horizonte', country: 'Brasil', aliases: ['confins', 'tancredo neves', 'bh', 'mg'] },
  { iataCode: 'PLU', name: 'Aeroporto da Pampulha', city: 'Belo Horizonte', country: 'Brasil', aliases: ['pampulha', 'bh', 'mg'] },
  { iataCode: 'SSA', name: 'Aeroporto Internacional de Salvador', city: 'Salvador', country: 'Brasil', aliases: ['salvador', 'bahia', 'ba'] },
  { iataCode: 'REC', name: 'Aeroporto Internacional do Recife', city: 'Recife', country: 'Brasil', aliases: ['recife', 'pernambuco', 'pe'] },
  { iataCode: 'FOR', name: 'Aeroporto Internacional de Fortaleza', city: 'Fortaleza', country: 'Brasil', aliases: ['fortaleza', 'ceara', 'ce'] },
  { iataCode: 'CWB', name: 'Aeroporto Internacional Afonso Pena', city: 'Curitiba', country: 'Brasil', aliases: ['curitiba', 'parana', 'pr', 'afonso pena'] },
  { iataCode: 'POA', name: 'Aeroporto Internacional Salgado Filho', city: 'Porto Alegre', country: 'Brasil', aliases: ['porto alegre', 'rs', 'salgado filho'] },
  { iataCode: 'FLN', name: 'Aeroporto Internacional de Florianópolis', city: 'Florianópolis', country: 'Brasil', aliases: ['florianopolis', 'floripa', 'sc'] },
  { iataCode: 'MAO', name: 'Aeroporto Internacional de Manaus', city: 'Manaus', country: 'Brasil', aliases: ['manaus', 'amazonas', 'am'] },
  { iataCode: 'BEL', name: 'Aeroporto Internacional de Belém', city: 'Belém', country: 'Brasil', aliases: ['belem', 'para', 'pa'] },
  { iataCode: 'NAT', name: 'Aeroporto Internacional de Natal', city: 'Natal', country: 'Brasil', aliases: ['natal', 'rn'] },
  { iataCode: 'MCZ', name: 'Aeroporto Internacional de Maceió', city: 'Maceió', country: 'Brasil', aliases: ['maceio', 'alagoas', 'al'] },
  { iataCode: 'THE', name: 'Aeroporto de Teresina', city: 'Teresina', country: 'Brasil', aliases: ['teresina', 'piaui', 'pi'] },
  { iataCode: 'SLZ', name: 'Aeroporto Internacional de São Luís', city: 'São Luís', country: 'Brasil', aliases: ['sao luis', 'maranhao', 'ma'] },
  { iataCode: 'CGB', name: 'Aeroporto Internacional de Cuiabá', city: 'Cuiabá', country: 'Brasil', aliases: ['cuiaba', 'mato grosso', 'mt'] },
  { iataCode: 'VIX', name: 'Aeroporto de Vitória', city: 'Vitória', country: 'Brasil', aliases: ['vitoria', 'es'] },
  { iataCode: 'AJU', name: 'Aeroporto de Aracaju', city: 'Aracaju', country: 'Brasil', aliases: ['aracaju', 'sergipe', 'se'] },
  { iataCode: 'IGU', name: 'Aeroporto Internacional de Foz do Iguaçu', city: 'Foz do Iguaçu', country: 'Brasil', aliases: ['foz', 'iguacu', 'pr'] },
  { iataCode: 'GYN', name: 'Aeroporto de Goiânia', city: 'Goiânia', country: 'Brasil', aliases: ['goiania', 'goias', 'go'] },
  
  // ESTADOS UNIDOS
  { iataCode: 'JFK', name: 'John F Kennedy International Airport', city: 'New York', country: 'Estados Unidos', aliases: ['nova york', 'new york', 'ny', 'nyc', 'kennedy'] },
  { iataCode: 'LAX', name: 'Los Angeles International Airport', city: 'Los Angeles', country: 'Estados Unidos', aliases: ['los angeles', 'la', 'california'] },
  { iataCode: 'MIA', name: 'Miami International Airport', city: 'Miami', country: 'Estados Unidos', aliases: ['miami', 'florida', 'fl'] },
  { iataCode: 'ORD', name: "O'Hare International Airport", city: 'Chicago', country: 'Estados Unidos', aliases: ['chicago', 'ohare', 'illinois'] },
  { iataCode: 'SFO', name: 'San Francisco International Airport', city: 'San Francisco', country: 'Estados Unidos', aliases: ['san francisco', 'sf', 'california'] },
  { iataCode: 'ATL', name: 'Hartsfield-Jackson Atlanta International Airport', city: 'Atlanta', country: 'Estados Unidos', aliases: ['atlanta', 'georgia'] },
  { iataCode: 'DFW', name: 'Dallas/Fort Worth International Airport', city: 'Dallas', country: 'Estados Unidos', aliases: ['dallas', 'fort worth', 'texas'] },
  { iataCode: 'DEN', name: 'Denver International Airport', city: 'Denver', country: 'Estados Unidos', aliases: ['denver', 'colorado'] },
  { iataCode: 'SEA', name: 'Seattle-Tacoma International Airport', city: 'Seattle', country: 'Estados Unidos', aliases: ['seattle', 'tacoma', 'washington'] },
  { iataCode: 'LAS', name: 'Harry Reid International Airport', city: 'Las Vegas', country: 'Estados Unidos', aliases: ['las vegas', 'vegas', 'nevada'] },
  { iataCode: 'MCO', name: 'Orlando International Airport', city: 'Orlando', country: 'Estados Unidos', aliases: ['orlando', 'florida'] },
  { iataCode: 'BOS', name: 'Boston Logan International Airport', city: 'Boston', country: 'Estados Unidos', aliases: ['boston', 'logan', 'massachusetts'] },
  { iataCode: 'IAH', name: 'George Bush Intercontinental Airport', city: 'Houston', country: 'Estados Unidos', aliases: ['houston', 'texas', 'bush'] },
  { iataCode: 'EWR', name: 'Newark Liberty International Airport', city: 'Newark', country: 'Estados Unidos', aliases: ['newark', 'new jersey', 'nj', 'new york'] },
  { iataCode: 'LGA', name: 'LaGuardia Airport', city: 'New York', country: 'Estados Unidos', aliases: ['laguardia', 'new york', 'nyc'] },
  { iataCode: 'PHX', name: 'Phoenix Sky Harbor International Airport', city: 'Phoenix', country: 'Estados Unidos', aliases: ['phoenix', 'arizona'] },
  { iataCode: 'IAD', name: 'Washington Dulles International Airport', city: 'Washington', country: 'Estados Unidos', aliases: ['washington', 'dulles', 'dc'] },
  
  // EUROPA
  { iataCode: 'LHR', name: 'Heathrow Airport', city: 'Londres', country: 'Reino Unido', aliases: ['london', 'londres', 'heathrow', 'uk', 'inglaterra'] },
  { iataCode: 'LGW', name: 'Gatwick Airport', city: 'Londres', country: 'Reino Unido', aliases: ['london', 'londres', 'gatwick', 'uk'] },
  { iataCode: 'STN', name: 'Stansted Airport', city: 'Londres', country: 'Reino Unido', aliases: ['london', 'londres', 'stansted', 'uk'] },
  { iataCode: 'LTN', name: 'Luton Airport', city: 'Londres', country: 'Reino Unido', aliases: ['london', 'londres', 'luton', 'uk'] },
  { iataCode: 'CDG', name: 'Charles de Gaulle Airport', city: 'Paris', country: 'França', aliases: ['paris', 'cdg', 'charles de gaulle', 'franca', 'france'] },
  { iataCode: 'ORY', name: 'Orly Airport', city: 'Paris', country: 'França', aliases: ['paris', 'orly', 'franca'] },
  { iataCode: 'FRA', name: 'Frankfurt Airport', city: 'Frankfurt', country: 'Alemanha', aliases: ['frankfurt', 'alemanha', 'germany'] },
  { iataCode: 'AMS', name: 'Amsterdam Airport Schiphol', city: 'Amsterdã', country: 'Holanda', aliases: ['amsterdam', 'schiphol', 'holanda', 'netherlands'] },
  { iataCode: 'MAD', name: 'Madrid-Barajas Adolfo Suárez Airport', city: 'Madrid', country: 'Espanha', aliases: ['madrid', 'barajas', 'espanha', 'spain'] },
  { iataCode: 'BCN', name: 'Barcelona-El Prat Airport', city: 'Barcelona', country: 'Espanha', aliases: ['barcelona', 'prat', 'espanha', 'catalunha'] },
  { iataCode: 'FCO', name: 'Leonardo da Vinci-Fiumicino Airport', city: 'Roma', country: 'Itália', aliases: ['roma', 'rome', 'fiumicino', 'italia', 'italy'] },
  { iataCode: 'CIA', name: 'Ciampino Airport', city: 'Roma', country: 'Itália', aliases: ['roma', 'ciampino', 'italia'] },
  { iataCode: 'MXP', name: 'Milan Malpensa Airport', city: 'Milão', country: 'Itália', aliases: ['milao', 'milan', 'malpensa', 'italia'] },
  { iataCode: 'LIN', name: 'Milan Linate Airport', city: 'Milão', country: 'Itália', aliases: ['milao', 'milan', 'linate', 'italia'] },
  { iataCode: 'BGY', name: 'Milan Bergamo Airport', city: 'Milão', country: 'Itália', aliases: ['milao', 'bergamo', 'orio al serio', 'italia'] },
  { iataCode: 'VCE', name: 'Venice Marco Polo Airport', city: 'Veneza', country: 'Itália', aliases: ['veneza', 'venice', 'marco polo', 'italia'] },
  { iataCode: 'NAP', name: 'Naples International Airport', city: 'Nápoles', country: 'Itália', aliases: ['napoles', 'naples', 'italia'] },
  { iataCode: 'LIS', name: 'Lisbon Portela Airport', city: 'Lisboa', country: 'Portugal', aliases: ['lisboa', 'lisbon', 'portela', 'portugal'] },
  { iataCode: 'OPO', name: 'Porto Airport', city: 'Porto', country: 'Portugal', aliases: ['porto', 'portugal'] },
  { iataCode: 'FAO', name: 'Faro Airport', city: 'Faro', country: 'Portugal', aliases: ['faro', 'algarve', 'portugal'] },
  { iataCode: 'VIE', name: 'Vienna International Airport', city: 'Viena', country: 'Áustria', aliases: ['viena', 'vienna', 'austria'] },
  { iataCode: 'ZRH', name: 'Zurich Airport', city: 'Zurique', country: 'Suíça', aliases: ['zurich', 'zurique', 'suica', 'switzerland'] },
  { iataCode: 'GVA', name: 'Geneva Airport', city: 'Genebra', country: 'Suíça', aliases: ['geneva', 'genebra', 'suica'] },
  { iataCode: 'MUC', name: 'Munich Airport', city: 'Munique', country: 'Alemanha', aliases: ['munich', 'munique', 'alemanha'] },
  { iataCode: 'TXL', name: 'Berlin Tegel Airport', city: 'Berlim', country: 'Alemanha', aliases: ['berlin', 'berlim', 'alemanha'] },
  { iataCode: 'CPH', name: 'Copenhagen Airport', city: 'Copenhague', country: 'Dinamarca', aliases: ['copenhagen', 'copenhague', 'dinamarca', 'denmark'] },
  { iataCode: 'ARN', name: 'Stockholm Arlanda Airport', city: 'Estocolmo', country: 'Suécia', aliases: ['stockholm', 'estocolmo', 'arlanda', 'suecia', 'sweden'] },
  { iataCode: 'OSL', name: 'Oslo Airport', city: 'Oslo', country: 'Noruega', aliases: ['oslo', 'noruega', 'norway'] },
  { iataCode: 'HEL', name: 'Helsinki-Vantaa Airport', city: 'Helsinki', country: 'Finlândia', aliases: ['helsinki', 'finlandia', 'finland'] },
  { iataCode: 'ATH', name: 'Athens International Airport', city: 'Atenas', country: 'Grécia', aliases: ['athens', 'atenas', 'grecia', 'greece'] },
  { iataCode: 'IST', name: 'Istanbul Airport', city: 'Istambul', country: 'Turquia', aliases: ['istanbul', 'istambul', 'turquia', 'turkey'] },
  { iataCode: 'SAW', name: 'Sabiha Gökçen Airport', city: 'Istambul', country: 'Turquia', aliases: ['istanbul', 'sabiha', 'turquia'] },
  { iataCode: 'DUB', name: 'Dublin Airport', city: 'Dublin', country: 'Irlanda', aliases: ['dublin', 'irlanda', 'ireland'] },
  { iataCode: 'BRU', name: 'Brussels Airport', city: 'Bruxelas', country: 'Bélgica', aliases: ['brussels', 'bruxelas', 'belgica', 'belgium'] },
  { iataCode: 'PRG', name: 'Václav Havel Airport Prague', city: 'Praga', country: 'República Tcheca', aliases: ['prague', 'praga', 'tcheca', 'czech'] },
  { iataCode: 'WAW', name: 'Warsaw Chopin Airport', city: 'Varsóvia', country: 'Polônia', aliases: ['warsaw', 'varsovia', 'polonia', 'poland'] },
  { iataCode: 'BUD', name: 'Budapest Ferenc Liszt Airport', city: 'Budapeste', country: 'Hungria', aliases: ['budapest', 'hungria', 'hungary'] },
  
  // AMÉRICA LATINA
  { iataCode: 'EZE', name: 'Ministro Pistarini International Airport', city: 'Buenos Aires', country: 'Argentina', aliases: ['ezeiza', 'buenos aires', 'argentina'] },
  { iataCode: 'AEP', name: 'Aeroparque Jorge Newbery', city: 'Buenos Aires', country: 'Argentina', aliases: ['aeroparque', 'buenos aires', 'argentina'] },
  { iataCode: 'SCL', name: 'Arturo Merino Benítez International Airport', city: 'Santiago', country: 'Chile', aliases: ['santiago', 'chile'] },
  { iataCode: 'BOG', name: 'El Dorado International Airport', city: 'Bogotá', country: 'Colômbia', aliases: ['bogota', 'colombia'] },
  { iataCode: 'MEX', name: 'Mexico City International Airport', city: 'Cidade do México', country: 'México', aliases: ['mexico', 'cdmx', 'cidade do mexico'] },
  { iataCode: 'LIM', name: 'Jorge Chávez International Airport', city: 'Lima', country: 'Peru', aliases: ['lima', 'peru'] },
  { iataCode: 'UIO', name: 'Mariscal Sucre International Airport', city: 'Quito', country: 'Equador', aliases: ['quito', 'equador', 'ecuador'] },
  { iataCode: 'GUA', name: 'La Aurora International Airport', city: 'Cidade da Guatemala', country: 'Guatemala', aliases: ['guatemala'] },
  { iataCode: 'PTY', name: 'Tocumen International Airport', city: 'Cidade do Panamá', country: 'Panamá', aliases: ['panama', 'tocumen'] },
  { iataCode: 'CUN', name: 'Cancún International Airport', city: 'Cancún', country: 'México', aliases: ['cancun', 'mexico', 'riviera maya'] },
  { iataCode: 'MVD', name: 'Carrasco International Airport', city: 'Montevidéu', country: 'Uruguai', aliases: ['montevideo', 'uruguai', 'uruguay'] },
  { iataCode: 'ASU', name: 'Silvio Pettirossi International Airport', city: 'Assunção', country: 'Paraguai', aliases: ['asuncion', 'paraguai', 'paraguay'] },
  { iataCode: 'HAV', name: 'José Martí International Airport', city: 'Havana', country: 'Cuba', aliases: ['havana', 'cuba'] },
  
  // ÁSIA
  { iataCode: 'DXB', name: 'Dubai International Airport', city: 'Dubai', country: 'Emirados Árabes Unidos', aliases: ['dubai', 'emirados', 'uae'] },
  { iataCode: 'SIN', name: 'Singapore Changi Airport', city: 'Cingapura', country: 'Cingapura', aliases: ['singapore', 'singapura', 'changi'] },
  { iataCode: 'HKG', name: 'Hong Kong International Airport', city: 'Hong Kong', country: 'Hong Kong', aliases: ['hong kong', 'hk'] },
  { iataCode: 'NRT', name: 'Narita International Airport', city: 'Tóquio', country: 'Japão', aliases: ['tokyo', 'toquio', 'narita', 'japao', 'japan'] },
  { iataCode: 'HND', name: 'Tokyo Haneda Airport', city: 'Tóquio', country: 'Japão', aliases: ['tokyo', 'toquio', 'haneda', 'japao'] },
  { iataCode: 'ICN', name: 'Incheon International Airport', city: 'Seul', country: 'Coreia do Sul', aliases: ['seoul', 'seul', 'incheon', 'coreia', 'korea'] },
  { iataCode: 'PEK', name: 'Beijing Capital International Airport', city: 'Pequim', country: 'China', aliases: ['beijing', 'pequim', 'china'] },
  { iataCode: 'PVG', name: 'Shanghai Pudong International Airport', city: 'Xangai', country: 'China', aliases: ['shanghai', 'xangai', 'pudong', 'china'] },
  { iataCode: 'BKK', name: 'Suvarnabhumi Airport', city: 'Bangkok', country: 'Tailândia', aliases: ['bangkok', 'tailandia', 'thailand'] },
  { iataCode: 'KUL', name: 'Kuala Lumpur International Airport', city: 'Kuala Lumpur', country: 'Malásia', aliases: ['kuala lumpur', 'malasia', 'malaysia'] },
  { iataCode: 'DEL', name: 'Indira Gandhi International Airport', city: 'Nova Délhi', country: 'Índia', aliases: ['delhi', 'nova delhi', 'india'] },
  { iataCode: 'BOM', name: 'Chhatrapati Shivaji Maharaj International Airport', city: 'Mumbai', country: 'Índia', aliases: ['mumbai', 'bombay', 'india'] },
  { iataCode: 'CGK', name: 'Soekarno-Hatta International Airport', city: 'Jacarta', country: 'Indonésia', aliases: ['jakarta', 'jacarta', 'indonesia'] },
  { iataCode: 'MNL', name: 'Ninoy Aquino International Airport', city: 'Manila', country: 'Filipinas', aliases: ['manila', 'filipinas', 'philippines'] },
  { iataCode: 'DOH', name: 'Hamad International Airport', city: 'Doha', country: 'Catar', aliases: ['doha', 'catar', 'qatar'] },
  { iataCode: 'AUH', name: 'Abu Dhabi International Airport', city: 'Abu Dhabi', country: 'Emirados Árabes Unidos', aliases: ['abu dhabi', 'emirados', 'uae'] },
  
  // OCEANIA
  { iataCode: 'SYD', name: 'Sydney Kingsford Smith Airport', city: 'Sydney', country: 'Austrália', aliases: ['sydney', 'australia'] },
  { iataCode: 'MEL', name: 'Melbourne Airport', city: 'Melbourne', country: 'Austrália', aliases: ['melbourne', 'australia'] },
  { iataCode: 'BNE', name: 'Brisbane Airport', city: 'Brisbane', country: 'Austrália', aliases: ['brisbane', 'australia'] },
  { iataCode: 'AKL', name: 'Auckland Airport', city: 'Auckland', country: 'Nova Zelândia', aliases: ['auckland', 'nova zelandia', 'new zealand'] },
  { iataCode: 'PER', name: 'Perth Airport', city: 'Perth', country: 'Austrália', aliases: ['perth', 'australia'] },
  
  // ÁFRICA
  { iataCode: 'JNB', name: 'O.R. Tambo International Airport', city: 'Joanesburgo', country: 'África do Sul', aliases: ['johannesburg', 'joanesburgo', 'africa do sul', 'south africa'] },
  { iataCode: 'CPT', name: 'Cape Town International Airport', city: 'Cidade do Cabo', country: 'África do Sul', aliases: ['cape town', 'cidade do cabo', 'africa do sul'] },
  { iataCode: 'CAI', name: 'Cairo International Airport', city: 'Cairo', country: 'Egito', aliases: ['cairo', 'egito', 'egypt'] },
  { iataCode: 'ADD', name: 'Addis Ababa Bole International Airport', city: 'Adis Abeba', country: 'Etiópia', aliases: ['addis ababa', 'etiopia', 'ethiopia'] },
  { iataCode: 'LOS', name: 'Murtala Muhammed International Airport', city: 'Lagos', country: 'Nigéria', aliases: ['lagos', 'nigeria'] },
  { iataCode: 'NBO', name: 'Jomo Kenyatta International Airport', city: 'Nairóbi', country: 'Quênia', aliases: ['nairobi', 'quenia', 'kenya'] },
  { iataCode: 'CMN', name: 'Mohammed V International Airport', city: 'Casablanca', country: 'Marrocos', aliases: ['casablanca', 'marrocos', 'morocco'] },
  
  // CANADÁ
  { iataCode: 'YYZ', name: 'Toronto Pearson International Airport', city: 'Toronto', country: 'Canadá', aliases: ['toronto', 'canada', 'pearson'] },
  { iataCode: 'YVR', name: 'Vancouver International Airport', city: 'Vancouver', country: 'Canadá', aliases: ['vancouver', 'canada'] },
  { iataCode: 'YUL', name: 'Montréal-Pierre Elliott Trudeau International Airport', city: 'Montreal', country: 'Canadá', aliases: ['montreal', 'canada'] },
  { iataCode: 'YYC', name: 'Calgary International Airport', city: 'Calgary', country: 'Canadá', aliases: ['calgary', 'canada'] }
];

/**
 * Remove acentos de uma string para busca mais flexível
 */
function removeAccents(str) {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

/**
 * Busca aeroportos de forma inteligente
 * Suporta busca por: IATA code, cidade, país, nome do aeroporto, aliases
 */
export function searchAirports(keyword) {
  if (!keyword || keyword.length < 2) {
    return [];
  }

  const searchTerm = removeAccents(keyword.toLowerCase().trim());
  const results = [];

  airportsDatabase.forEach(airport => {
    let score = 0;
    let matchType = '';

    // Busca exata por IATA code (maior prioridade)
    if (airport.iataCode.toLowerCase() === searchTerm) {
      score = 1000;
      matchType = 'exact-iata';
    }
    // Começa com IATA code
    else if (airport.iataCode.toLowerCase().startsWith(searchTerm)) {
      score = 900;
      matchType = 'starts-iata';
    }
    // Contém no IATA code
    else if (airport.iataCode.toLowerCase().includes(searchTerm)) {
      score = 800;
      matchType = 'contains-iata';
    }
    // Busca exata na cidade (sem acentos)
    else if (removeAccents(airport.city.toLowerCase()) === searchTerm) {
      score = 700;
      matchType = 'exact-city';
    }
    // Começa com nome da cidade
    else if (removeAccents(airport.city.toLowerCase()).startsWith(searchTerm)) {
      score = 600;
      matchType = 'starts-city';
    }
    // Busca exata no país
    else if (removeAccents(airport.country.toLowerCase()) === searchTerm) {
      score = 500;
      matchType = 'exact-country';
    }
    // Começa com nome do país
    else if (removeAccents(airport.country.toLowerCase()).startsWith(searchTerm)) {
      score = 400;
      matchType = 'starts-country';
    }
    // Busca nos aliases
    else if (airport.aliases) {
      for (const alias of airport.aliases) {
        const normalizedAlias = removeAccents(alias.toLowerCase());
        if (normalizedAlias === searchTerm) {
          score = 550;
          matchType = 'exact-alias';
          break;
        } else if (normalizedAlias.startsWith(searchTerm)) {
          score = 450;
          matchType = 'starts-alias';
          break;
        } else if (normalizedAlias.includes(searchTerm)) {
          score = 350;
          matchType = 'contains-alias';
          break;
        }
      }
    }
    
    // Busca no nome do aeroporto (menor prioridade)
    if (score === 0) {
      const normalizedName = removeAccents(airport.name.toLowerCase());
      if (normalizedName.includes(searchTerm)) {
        score = 300;
        matchType = 'contains-name';
      }
    }
    
    // Busca parcial na cidade (menor prioridade ainda)
    if (score === 0) {
      const normalizedCity = removeAccents(airport.city.toLowerCase());
      if (normalizedCity.includes(searchTerm)) {
        score = 200;
        matchType = 'contains-city';
      }
    }
    
    // Busca parcial no país
    if (score === 0) {
      const normalizedCountry = removeAccents(airport.country.toLowerCase());
      if (normalizedCountry.includes(searchTerm)) {
        score = 100;
        matchType = 'contains-country';
      }
    }

    if (score > 0) {
      results.push({
        ...airport,
        score,
        matchType,
        label: `${airport.iataCode} - ${airport.name}, ${airport.city}`,
        searchLabel: `${airport.iataCode} - ${airport.city}, ${airport.country}`
      });
    }
  });

  // Ordena por score (maior primeiro) e depois alfabeticamente
  results.sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score;
    }
    return a.city.localeCompare(b.city);
  });

  // Retorna top 20 resultados
  return results.slice(0, 20);
}

/**
 * Busca aeroporto específico por código IATA
 */
export function getAirportByCode(iataCode) {
  return airportsDatabase.find(
    airport => airport.iataCode.toUpperCase() === iataCode.toUpperCase()
  );
}
