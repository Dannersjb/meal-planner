import React, { createContext, useContext, useEffect } from "react";
import { openDatabaseSync, SQLiteDatabase } from "expo-sqlite";

const DatabaseContext = createContext<SQLiteDatabase | null>(null);

const db = openDatabaseSync("mealPlanner.db");

// create sql tables if they don't already exist
const initializeDatabase = () => {
  try {
    db.execSync(`
        CREATE TABLE IF NOT EXISTS shopping_list (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          item_name TEXT NOT NULL,
          item_order INTEGER NOT NULL,
          quantity INTEGER DEFAULT 1,
          is_checked BOOLEAN DEFAULT 0
        );
        CREATE TABLE IF NOT EXISTS ingredients (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL UNIQUE
        );
        CREATE TABLE IF NOT EXISTS recipes (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL UNIQUE,
          duration INTEGER,
          created_at TEXT DEFAULT CURRENT_TIMESTAMP
        );
        CREATE TABLE IF NOT EXISTS recipe_ingredients (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          recipe_id INTEGER NOT NULL,
          ingredient_id INTEGER NOT NULL,
          quantity REAL,
          unit TEXT,
          FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE,
          FOREIGN KEY (ingredient_id) REFERENCES ingredients(id) ON DELETE CASCADE
        );
        CREATE TABLE IF NOT EXISTS recipe_instructions (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          recipe_id INTEGER NOT NULL,
          description TEXT NOT NULL,
          item_order INTEGER NOT NULL,
          FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE
        );
        CREATE TABLE IF NOT EXISTS meal_plan (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          recipe_id INTEGER NOT NULL,
          scheduled_date TEXT NOT NULL,
          meal_type TEXT,
          FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE
        )
      `);
    console.log("Database initialized successfully.");
  } catch (error) {
    console.error("Error initializing the database:", error);
  }
};

// DatabaseProvider component that wraps the children with the Database context
export const DatabaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useEffect(() => {
    // Initialize the database schema when the component mounts
    initializeDatabase();
  }, []);

  return <DatabaseContext.Provider value={db}>{children}</DatabaseContext.Provider>;
};

// Custom hook to use the Database context around the app
export const useDatabase = () => {
  const context = useContext(DatabaseContext);
  if (!context) {
    throw new Error("useDatabase must be used within a DatabaseProvider");
  }
  return context;
};
