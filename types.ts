
export interface ItemState {
  usable: number;
  broken: number;
}

export const SECONDARY_ITEM_KEYS = [
    'chairs', 'desks', 'teacherDesks', 'teacherChairs', 'whiteboards', 'firstAidKits', 'cupboards', 'fans', 'plugTops', 'waterFilters', 'displayBoards', 'lightbulbsAndHolders'
] as const;

export const PRIMARY_ITEM_KEYS = [
    'childChairs', 'childDesks', 'teacherDesks', 'teacherChairs', 'whiteboards', 'blackboards', 'cupboards', 'fans', 'plugTops', 'waterFilters', 'sinks', 'firstAidKits', 'lightbulbsAndHolders', 'whiteCubicles', 'learningAidCupboards', 'bookshelves', 'workTables', 'displayBoards', 'mirrors', 'stage'
] as const;


// Master list of all keys to ensure a consistent data structure for the `Inventory` type
export const ITEM_KEYS = [
    // Unique to Secondary
    'chairs', 'desks', 
    // Unique to Primary
    'childChairs', 'childDesks', 'blackboards', 'sinks', 'whiteCubicles', 'learningAidCupboards', 'bookshelves', 'workTables', 'mirrors', 'stage',
    // Common
    'teacherDesks', 'teacherChairs', 'whiteboards', 'firstAidKits', 'cupboards', 'fans', 'plugTops', 'waterFilters', 'displayBoards', 'lightbulbsAndHolders'
] as const;


export type ItemKey = typeof ITEM_KEYS[number];

export type Inventory = Record<ItemKey, ItemState>;

export interface Classroom {
  id: string;
  name: string;
  items: Inventory;
}

export interface ComputerLab {
  id:string;
  name: string;
  items: Inventory & { computers: ItemState };
}

// Fix: Add InventoryItem interface used by InventoryGenerator components.
export interface InventoryItem {
  name: string;
  quantity: number;
}

export interface Resource {
  title: string;
  summary: string;
  category: string;
}
