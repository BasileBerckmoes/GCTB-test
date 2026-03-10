export const themes = [
  'Voertuigen', 'Natuur', 'Gebouwen', 'Militair', 'Personen', 'Objecten'
] as const;

export type Theme = (typeof themes)[number];

export const nounPools: Record<Theme, string[]> = {
  Voertuigen: ['Helikopter', 'Tram', 'Veerboot', 'Truck', 'Trein', 'Jeep', 'Tank', 'Motorfiets', 'Ambulance', 'Brandweerwagen', 'Onderzeeër', 'Zweefvliegtuig'],
  Natuur: ['Berg', 'Bos', 'Meer', 'Rivier', 'Vallei', 'Heuvel', 'Zee', 'Woestijn', 'Oceaan', 'Kloof', 'Gletsjer', 'Eiland'],
  Gebouwen: ['Brug', 'Kerk', 'Boomhut', 'Toren', 'Fort', 'Kazerne', 'Bunker', 'Hangar', 'Magazijn', 'Gevangenis', 'Wachttoren', 'Arsenal'],
  Militair: ['Patrouille', 'Compagnie', 'Regiment', 'Bataljon', 'Peloton', 'Sectie', 'Brigade', 'Divisie', 'Detachement', 'Eskader', 'Vloot', 'Korps'],
  Personen: ['Politieman', 'Pompier', 'Piloot', 'Soldaat', 'Officier', 'Sergeant', 'Korporaal', 'Generaal', 'Luitenant', 'Kapitein', 'Majoor', 'Kolonel'],
  Objecten: ['Helm', 'Geweer', 'Bajonet', 'Rugzak', 'Kompas', 'Verrekijker', 'Granaat', 'Schild', 'Munitie', 'Veldkast', 'Pijlkoker', 'Zaklamp']
};
