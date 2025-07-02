import * as fs from 'fs';
import * as path from 'path';

interface Item {
  id: number;
  description: string;
  categorie: string;
}

interface Data {
  items: Item[];
}

const filePath = path.join(__dirname, 'data.json');

export function initializeJsonFile() {
  if (!fs.existsSync(filePath)) {
    const initialData: Data = { items: [] };
    fs.writeFileSync(filePath, JSON.stringify(initialData, null, 2), 'utf8');
  }
}

function readJsonFile(): Data {
  const raw = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(raw);
}

function writeJsonFile(data: Data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
}

export function addItem(item: Item) {
  const data = readJsonFile();
  if (data.items.find(i => i.id === item.id)) {
    return;
  }
  data.items.push(item);
  writeJsonFile(data);
}

export function deleteItem(id: number) {
  const data = readJsonFile();
  const updatedItems = data.items.filter(item => item.id !== id);
  if (updatedItems.length === data.items.length) {
    return;
  }
  data.items = updatedItems;
  writeJsonFile(data);
}

export function listItems(): Item[] {
  const data = readJsonFile();
  return data.items;
}