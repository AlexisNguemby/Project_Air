-- Créer l'utilisateur et les permissions
CREATE USER IF NOT EXISTS 'project_air_user'@'%' IDENTIFIED BY 'project_air_password_change_me';
GRANT ALL PRIVILEGES ON project_air.* TO 'project_air_user'@'%';
FLUSH PRIVILEGES;

CREATE TABLE IF NOT EXISTS Role (
  role_id INT AUTO_INCREMENT PRIMARY KEY,
  role_name VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS Class (
  class_id INT AUTO_INCREMENT PRIMARY KEY,
  class_name VARCHAR(255) UNIQUE NOT NULL,
  battling BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS Animation (
  animation_id INT AUTO_INCREMENT PRIMARY KEY,
  animation_name VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS Account (
  account_id INT AUTO_INCREMENT PRIMARY KEY,
  account_name VARCHAR(255) UNIQUE NOT NULL,
  mail VARCHAR(255) UNIQUE NOT NULL,
  power INT DEFAULT 0,
  level INT DEFAULT 1,
  avatar VARCHAR(255),
  experience INT DEFAULT 0,
  xp_max INT DEFAULT 100,
  role_id INT NOT NULL,
  class_id INT NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (role_id) REFERENCES Role(role_id) ON DELETE RESTRICT,
  FOREIGN KEY (class_id) REFERENCES Class(class_id) ON DELETE RESTRICT,
  INDEX (role_id),
  INDEX (class_id)
);

CREATE TABLE IF NOT EXISTS Faction (
  faction_id INT AUTO_INCREMENT PRIMARY KEY,
  faction_name VARCHAR(255) UNIQUE NOT NULL,
  image_placeholder VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS Card (
  card_id INT AUTO_INCREMENT PRIMARY KEY,
  card_name VARCHAR(255) UNIQUE NOT NULL,
  card_place VARCHAR(255),
  power INT NOT NULL,
  attack INT NOT NULL,
  card_img VARCHAR(255),
  faction_id INT NOT NULL,
  FOREIGN KEY (faction_id) REFERENCES Faction(faction_id) ON DELETE RESTRICT,
  INDEX (faction_id)
);

CREATE TABLE IF NOT EXISTS Collection (
  collection_id INT AUTO_INCREMENT PRIMARY KEY,
  account_id INT NOT NULL,
  FOREIGN KEY (account_id) REFERENCES Account(account_id) ON DELETE CASCADE,
  INDEX (account_id)
);

CREATE TABLE IF NOT EXISTS CollectionEntry (
  collection_id INT NOT NULL,
  card_id INT NOT NULL,
  quantity INT DEFAULT 1,
  PRIMARY KEY (collection_id, card_id),
  FOREIGN KEY (collection_id) REFERENCES Collection(collection_id) ON DELETE CASCADE,
  FOREIGN KEY (card_id) REFERENCES Card(card_id) ON DELETE CASCADE,
  INDEX (card_id)
);

CREATE TABLE IF NOT EXISTS CustomDeck (
  category_id INT AUTO_INCREMENT PRIMARY KEY,
  category VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS Deck (
  deck_id INT AUTO_INCREMENT PRIMARY KEY,
  deck_name VARCHAR(255) NOT NULL,
  attack INT DEFAULT 0,
  power INT DEFAULT 0,
  card_img VARCHAR(255),
  account_id INT NOT NULL,
  category_id INT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (account_id) REFERENCES Account(account_id) ON DELETE CASCADE,
  FOREIGN KEY (category_id) REFERENCES CustomDeck(category_id) ON DELETE SET NULL,
  INDEX (account_id),
  INDEX (category_id)
);

CREATE TABLE IF NOT EXISTS DeckCard (
  deck_id INT NOT NULL,
  card_id INT NOT NULL,
  position INT DEFAULT 0,
  PRIMARY KEY (deck_id, card_id, position),
  FOREIGN KEY (deck_id) REFERENCES Deck(deck_id) ON DELETE CASCADE,
  FOREIGN KEY (card_id) REFERENCES Card(card_id) ON DELETE CASCADE,
  INDEX (card_id)
);

CREATE TABLE IF NOT EXISTS Building (
  building_id INT AUTO_INCREMENT PRIMARY KEY,
  building_name VARCHAR(255) UNIQUE NOT NULL,
  description TEXT
);

CREATE TABLE IF NOT EXISTS Battling (
  battling_id INT AUTO_INCREMENT PRIMARY KEY
);

CREATE TABLE IF NOT EXISTS Related (
  related_id INT AUTO_INCREMENT PRIMARY KEY
);
