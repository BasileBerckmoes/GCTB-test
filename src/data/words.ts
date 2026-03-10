// 11 categories with at least 15 words each in Dutch
export const categories = [
  'Werktuig', 'Boom', 'Vloeistof', 'Kleren', 'Transport',
  'Insect', 'Vis', 'Land', 'Gebouw', 'Vogel', 'Metaal'
] as const;

export type Category = (typeof categories)[number];

export const wordBank: Record<Category, string[]> = {
  Werktuig: ['Nijptang', 'Moersleutel', 'Hamer', 'Zaag', 'Tang', 'Schroevendraaier', 'Beitel', 'Boor', 'Vijl', 'Dissel', 'Koevoet', 'Schaaf', 'Boormachine', 'Slijptol', 'Kettingzaag', 'Schop'],
  Boom: ['Eik', 'Berk', 'Den', 'Beuk', 'Linde', 'Wilg', 'Esdoorn', 'Populier', 'Kastanje', 'Lariks', 'Spar', 'Plataan', 'Es', 'Iep', 'Kerselaar', 'Hazelaar'],
  Vloeistof: ['Water', 'Diesel', 'Melk', 'Olie', 'Sap', 'Benzine', 'Azijn', 'Siroop', 'Bloed', 'Inkt', 'Limonade', 'Thee', 'Koffie', 'Bier', 'Wijn', 'Zweet'],
  Kleren: ['Sok', 'Jas', 'Handschoen', 'Broek', 'Hemd', 'Sjaal', 'Muts', 'Rok', 'Vest', 'Jurk', 'Trui', 'T-shirt', 'Onderbroek', 'Beha', 'Riempje', 'Pyjama', 'Pantalon'],
  Transport: ['Fiets', 'Koets', 'Tram', 'Bus', 'Trein', 'Auto', 'Vliegtuig', 'Boot', 'Taxi', 'Metro', 'Step', 'Scooter', 'Motorfiets', 'Helikopter', 'Veerboot', 'Vrachtwagen'],
  Insect: ['Kever', 'Mug', 'Vlieg', 'Bij', 'Wesp', 'Mier', 'Krekel', 'Sprinkhaan', 'Libel', 'Mot', 'Vlinder', 'Lieveheersbeestje', 'Oorkruiper', 'Wants', 'Pissebed', 'Bidsprinkhaan'],
  Vis: ['Heilbot', 'Sardine', 'Forel', 'Zalm', 'Kabeljauw', 'Haring', 'Tonijn', 'Makreel', 'Snoek', 'Karper', 'Paling', 'Zeebaars', 'Schelvis', 'Ansjovis', 'Goudvis', 'Haai'],
  Land: ['België', 'India', 'Engeland', 'Japan', 'Brazilië', 'Noorwegen', 'Peru', 'Egypte', 'Canada', 'Australië', 'Frankrijk', 'Duitsland', 'Italië', 'Spanje', 'Zweden', 'China'],
  Gebouw: ['Kerk', 'School', 'Fabriek', 'Ziekenhuis', 'Brug', 'Toren', 'Kasteel', 'Schuur', 'Station', 'Museum', 'Zwembad', 'Gevangenis', 'Stadion', 'Moskee', 'Flat', 'Paleis'],
  Vogel: ['Meeuw', 'Arend', 'Duif', 'Uil', 'Raaf', 'Specht', 'Zwaluw', 'Ekster', 'Valk', 'Pelikaan', 'Kraai', 'Merel', 'Mus', 'Pinguïn', 'Struisvogel', 'Zwaan'],
  Metaal: ['Brons', 'Goud', 'Zilver', 'Koper', 'IJzer', 'Staal', 'Tin', 'Lood', 'Platina', 'Aluminium', 'Zink', 'Messing', 'Titaan', 'Kwik', 'Nikkel', 'Kobalt']
};
