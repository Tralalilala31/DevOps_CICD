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
    return false;
  }
  data.items.push(item);
  writeJsonFile(data);
  return item;
}

export function deleteItem(id: number) {
  const data = readJsonFile();
  const updatedItems = data.items.filter(item => item.id !== id);
  if (updatedItems.length === data.items.length) {
    return false;
  }
  data.items = updatedItems;
  writeJsonFile(data);
  return true;
}

export function listItems(): Item[] {
  const data = readJsonFile();
  return data.items;
}

export function updateItem(id: number, updatedFields: Partial<Omit<Item, 'id'>>) {
  const data = readJsonFile();
  const index = data.items.findIndex(item => item.id === id);

  if (index === -1) {
    return false;
  }

  data.items[index] = { ...data.items[index]!, ...updatedFields };

  writeJsonFile(data);
  return true;
}
