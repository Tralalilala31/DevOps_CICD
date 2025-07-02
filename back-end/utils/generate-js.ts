import * as fs from 'fs';
import * as path from 'path';

// Types
interface Item {
  id: number;
  description: string;
  categorie: string;
}

interface Data {
  items: Item[];
}

const filePath = path.join(__dirname, 'data.json');

function initializeJsonFile() {
  if (!fs.existsSync(filePath)) {
    const initialData: Data = { items: [] };
    fs.writeFileSync(filePath, JSON.stringify(initialData, null, 2), 'utf8');
    console.log('Fichier JSON créé.');
  }
}

function readJsonFile(): Data {
  const raw = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(raw);
}

function writeJsonFile(data: Data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
}

function addItem(item: Item) {
  const data = readJsonFile();
  if (data.items.find(i => i.id === item.id)) {
    console.log(`L'élément avec l'id ${item.id} existe déjà.`);
    return;
  }
  data.items.push(item);
  writeJsonFile(data);
  console.log(`Item ajouté avec succès (id: ${item.id}).`);
}

function deleteItem(id: number) {
  const data = readJsonFile();
  const updatedItems = data.items.filter(item => item.id !== id);
  if (updatedItems.length === data.items.length) {
    console.log(`Aucun item trouvé avec l'id ${id}.`);
    return;
  }
  data.items = updatedItems;
  writeJsonFile(data);
  console.log(`Item supprimé (id: ${id}).`);
}

initializeJsonFile();
addItem({ id: 1, description: 'Ordinateur portable performant', categorie: 'Informatique' });
addItem({ id: 2, description: 'Roman de science-fiction', categorie: 'Livre' });
deleteItem(1);
