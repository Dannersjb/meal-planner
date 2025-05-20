# Database Design - Meal Planner App

This document describes the schema of the `mealPlanner.db` SQLite database used in the app.

---

## Table: `shopping_list`

| Column       | Type    | Constraints               | Description                     |
| ------------ | ------- | ------------------------- | ------------------------------- |
| `id`         | INTEGER | PRIMARY KEY AUTOINCREMENT | Unique ID for each item         |
| `item_name`  | TEXT    | NOT NULL                  | Name of the shopping item       |
| `item_order` | INTEGER | NOT NULL                  | Order in which item is listed   |
| `quantity`   | INTEGER | DEFAULT 1                 | Quantity of the item            |
| `is_checked` | BOOLEAN | DEFAULT 0                 | Whether item is marked complete |

---

## Table: `ingredients`

| Column | Type    | Constraints               | Description              |
| ------ | ------- | ------------------------- | ------------------------ |
| `id`   | INTEGER | PRIMARY KEY AUTOINCREMENT | Unique ID for ingredient |
| `name` | TEXT    | NOT NULL, UNIQUE          | Name of the ingredient   |

---

## Table: `recipes`

| Column         | Type    | Constraints               | Description                 |
| -------------- | ------- | ------------------------- | --------------------------- |
| `id`           | INTEGER | PRIMARY KEY AUTOINCREMENT | Unique ID for recipe        |
| `name`         | TEXT    | NOT NULL, UNIQUE          | Name of the recipe          |
| `instructions` | TEXT    |                           | Cooking instructions        |
| `created_at`   | TEXT    | DEFAULT CURRENT_TIMESTAMP | Time the recipe was created |

---

## Table: `recipe_ingredients`

| Column          | Type    | Constraints               | Description                            |
| --------------- | ------- | ------------------------- | -------------------------------------- |
| `id`            | INTEGER | PRIMARY KEY AUTOINCREMENT | Unique ID for this link                |
| `recipe_id`     | INTEGER | NOT NULL, FOREIGN KEY     | References `recipes(id)`               |
| `ingredient_id` | INTEGER | NOT NULL, FOREIGN KEY     | References `ingredients(id)`           |
| `quantity`      | REAL    |                           | Quantity of the ingredient             |
| `unit`          | TEXT    |                           | Unit of measurement (e.g. g, ml, cups) |

---

## Table: `meal_plan`

| Column           | Type    | Constraints               | Description                               |
| ---------------- | ------- | ------------------------- | ----------------------------------------- |
| `id`             | INTEGER | PRIMARY KEY AUTOINCREMENT | Unique ID for the scheduled meal          |
| `recipe_id`      | INTEGER | NOT NULL, FOREIGN KEY     | References `recipes(id)`                  |
| `scheduled_date` | TEXT    | NOT NULL                  | Date the meal is planned for (YYYY-MM-DD) |
| `meal_type`      | TEXT    |                           | Meal type: 'breakfast', 'lunch', 'dinner' |

---

## Relationships

- `recipe_ingredients.recipe_id` → `recipes.id`
- `recipe_ingredients.ingredient_id` → `ingredients.id`
- `meal_plan.recipe_id` → `recipes.id`

All foreign keys have `ON DELETE CASCADE` behavior to ensure relational integrity.

---
