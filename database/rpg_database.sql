DROP TABLE IF EXISTS user_accounts CASCADE;
DROP TABLE IF EXISTS modules CASCADE;
DROP TABLE IF EXISTS user_orders CASCADE;
DROP TABLE IF EXISTS character_races CASCADE;
DROP TABLE IF EXISTS character_classes CASCADE;
DROP TABLE IF EXISTS character_abilities CASCADE;
DROP TABLE IF EXISTS character_spells CASCADE;
DROP TABLE IF EXISTS items CASCADE;
DROP TABLE IF EXISTS games CASCADE;
DROP TABLE IF EXISTS party CASCADE;
DROP TABLE IF EXISTS character_backgrounds CASCADE;
DROP TABLE IF EXISTS player_characters;
DROP TABLE IF EXISTS party_members;

CREATE TABLE user_accounts (
    user_account_id     SERIAL     CONSTRAINT user_accounts_pk PRIMARY KEY   NOT NULL,
    username    VARCHAR             CONSTRAINT user_accounts_uc1 UNIQUE        NOT NULL,
    password    VARCHAR     NOT NULL,
    email       VARCHAR              CONSTRAINT user_accounts_uc2 UNIQUE,
    first_name  VARCHAR,
    last_name   VARCHAR,
    created_by  INTEGER,
    created_date DATE,
    last_updated_by INTEGER,
    last_updated_date DATE
);

INSERT INTO user_accounts (username,    password,               email,                   first_name, last_name, created_by, created_date, last_updated_by, last_updated_date) 
VALUES                    ('admin',     'badSecurityPractice' , 'login@johnbatty.me' ,  'John',     'Batty',    1,          CURRENT_DATE, 1,              CURRENT_DATE ),
                          ('9fingers',  'weakpassword',         'dawson5252@gmail.com', 'Dawson',   'Norton',   1,          CURRENT_DATE, 1,              CURRENT_DATE ),
                          ('LoogLoogas','strongpassword',       'luke@ducimus.digital', 'Luke',     'Batty',    1,          CURRENT_DATE, 1,              CURRENT_DATE );

CREATE TABLE modules (
    module_id      SERIAL        CONSTRAINT modules_pk PRIMARY KEY   NOT NULL,
    module_name    VARCHAR(30)                                         NOT NULL,
    short_description   VARCHAR(255),
    long_description VARCHAR(2000),
    price FLOAT                                                        NOT NULL,
    created_by  INTEGER,
    created_date DATE,
    last_updated_by INTEGER,
    last_updated_date DATE
);

INSERT INTO modules (module_name, short_description, long_description, price, created_by, created_date, last_updated_by, last_updated_date)
VALUES              ('Basic Rule Set', 'This is a short description lorem ipsum set dolor', 'this is a long description lorem ipsum set dolor', 19.99, 1,          CURRENT_DATE, 1,              CURRENT_DATE ),
                    ('Game Masters Guide', 'This is a short description lorem ipsum set dolor', 'this is a long description lorem ipsum set dolor', 14.99, 1,          CURRENT_DATE, 1,              CURRENT_DATE ),
                    ('Advanced Rule Set', 'This is a short description lorem ipsum set dolor', 'this is a long description lorem ipsum set dolor', 29.99, 1,          CURRENT_DATE, 1,              CURRENT_DATE ),
                    ('Lore and History Pack', 'This is a short description lorem ipsum set dolor', 'this is a long description lorem ipsum set dolor', 5.99, 1,          CURRENT_DATE, 1,              CURRENT_DATE ),
                    ('Magic Item Compendium', 'This is a short description lorem ipsum set dolor', 'this is a long description lorem ipsum set dolor', 9.95, 1,          CURRENT_DATE, 1,              CURRENT_DATE ),
                    ('Advanced Magic and Spells', 'This is a short description lorem ipsum set dolor', 'this is a long description lorem ipsum set dolor', 24.01, 1,          CURRENT_DATE, 1,              CURRENT_DATE ),
                    ('Manual of Advanced Maneuvers', 'This is a short description lorem ipsum set dolor', 'this is a long description lorem ipsum set dolor', 23.99, 1,          CURRENT_DATE, 1,              CURRENT_DATE ),
                    ('Dungeon Devlers Debreif', 'This is a short description lorem ipsum set dolor', 'this is a long description lorem ipsum set dolor', 39.95, 1,          CURRENT_DATE, 1,              CURRENT_DATE );


CREATE TABLE user_orders (
    user_orders_id       SERIAL    CONSTRAINT user_orders_pk PRIMARY KEY    NOT NULL,
    user_account_id     INTEGER     CONSTRAINT user_orders_fk_1 REFERENCES user_accounts(user_account_id) NOT NULL,
    module_id           INTEGER     CONSTRAINT user_orders_fk_2 REFERENCES modules(module_id)         NOT NULL,
    time                DATE                                                    NOT NULL,
    created_by  INTEGER,
    created_date DATE,
    last_updated_by INTEGER,
    last_updated_date DATE
);

/*
INSERT INTO user_orders (user_account_id, module_id, time,          created_by, created_date, last_updated_by, last_updated_date) VALUES
                        (2,                1,        CURRENT_DATE,  1,          CURRENT_DATE, 1,              CURRENT_DATE      ),
                        (1,                3,        CURRENT_DATE,  1,          CURRENT_DATE, 1,              CURRENT_DATE      ),
                        (2,                5,        CURRENT_DATE,  1,          CURRENT_DATE, 1,              CURRENT_DATE      ),
                        (1,                1,        CURRENT_DATE,  1,          CURRENT_DATE, 1,              CURRENT_DATE      ),
                        (2,                1,        CURRENT_DATE,  1,          CURRENT_DATE, 1,              CURRENT_DATE      );
*/
CREATE TABLE character_backgrounds (
    character_backgrounds_id    SERIAL      NOT NULL   CONSTRAINT character_backgrounds_pk PRIMARY KEY,
    module_id                   INTEGER     NOT NULL   CONSTRAINT character_backgrounds_fk REFERENCES modules(module_id),
    name                        VARCHAR(30) NOT NULL,
    description                 TEXT        NOT NULL,
    feature_title               VARCHAR(30) NOT NULL,
    feature_description         TEXT        NOT NULL,
    last_stand_title            VARCHAR(30) NOT NULL,
    last_stand_description      TEXT        NOT NULL,
    created_by  INTEGER,
    created_date DATE,
    last_updated_by INTEGER,
    last_updated_date DATE
);

INSERT INTO character_backgrounds  (module_id, name,       description, feature_title, feature_description, last_stand_title, last_stand_description, created_by, created_date, last_updated_by, last_updated_date) 
VALUES                        (1,         'Slave'   ,      'Your time in captivity...','Strength of Will' ,'Passive bonus to all willpower checks', 'Indominable', 'During your last stand you cannot be restrained or held against your will',   1, CURRENT_DATE, 1, CURRENT_DATE),
                              (2,         'Half-Giant',    'One parent a giant, the other parent of the chosen race','Giant Strength','Occasional feats str','Ancestoral Might','Draw on the full strength of the giants during last stand', 1, CURRENT_DATE, 1, CURRENT_DATE),
                              (3,         'Zealot',        'You have dedicated a significant portion of your life to the service of a deity or patron','Power of Prayer','Occassional "luck" boost or re-roll?','Unbreakable', 'Can not be influanced by any mind altering or fear effects', 1, CURRENT_DATE, 1, CURRENT_DATE),
                              (4,         'Scholar',       'You have dedicated much of your life to study or research','Fount of Knowledge','Often know obscure, but usefull information','Eye for Weakness','Automatically targets enemies weakest points. All attacks crit automatically during last stand', 1, CURRENT_DATE, 1, CURRENT_DATE),
                              (5,         'Bodyguard',     'You spent some amount of time dedicating yourself to the defense of a significant person','Danger Sense','Passive bonus to detecting danger or bad situations','Sacrifice',' Prevent another from taking any damage for one turn by taking the damage upon yourself. Damage taken is delayed until end of turn and cannot put player below -5.', 1, CURRENT_DATE, 1, CURRENT_DATE),
                              (6,         'Urchin',        'You were raised in poverty, and resorted to petty crimes to provide for your basic needs.','Example Title','This is a really nice description that is for testing things.','Example Title','This is a really nice description that is for testing things.', 1, CURRENT_DATE, 1, CURRENT_DATE),
                              (7,         'Traitor',       'You willfully betrayed a person, cause, or idea that was once of great importance to you.','Example Title','This is a really nice description that is for testing things.','Example Title','This is a really nice description that is for testing things.', 1, CURRENT_DATE, 1, CURRENT_DATE),
                              (8,         'Greiving',      'The tragic loss of a loved one has permanently altered your character','Example Title','This is a really nice description that is for testing things.','Example Title','This is a really nice description that is for testing things.', 1, CURRENT_DATE, 1, CURRENT_DATE);


CREATE TABLE character_spells (
    character_spells_id    SERIAL      CONSTRAINT character_spells_pk PRIMARY KEY  NOT NULL,
    module_id        INTEGER            CONSTRAINT character_spells_fk REFERENCES modules(module_id) NOT NULL,
    name                VARCHAR(30) NOT NULL,
    xp_cost   INTEGER NOT NULL,
    description TEXT,
    created_by  INTEGER,
    created_date DATE,
    last_updated_by INTEGER,
    last_updated_date DATE
);


/*spell prereqs**/

INSERT INTO character_spells  (module_id, name,             xp_cost, description,  created_by, created_date, last_updated_by, last_updated_date) 
VALUES                        (1,         'Fireball',       100,     'You throw a ball of firey death at your opponenets dealing 3d3 + your spellcasting ability damage', 1, CURRENT_DATE, 1, CURRENT_DATE),
                              (2,         'Healing Burst',  150,     'You emit a burst of healing energy causing creatures within 10 feet of you to recover health equal to 1d10 + your spellcasting ability', 1, CURRENT_DATE, 1, CURRENT_DATE),
                              (3,         'Ice Wall',       275,     'You conjure a wall of solid ice that is 1 foot thick and 10 feet tall in the space in front of you', 1, CURRENT_DATE, 1, CURRENT_DATE),
                              (4,         'Sheild Self',    300,     'You conjure a sheild of magical energy which increases your armor and magical resistance by 2', 1, CURRENT_DATE, 1, CURRENT_DATE),
                              (5,         'Charged Shot',   125,     'You charge your weapon with negative energy and strike your opponent, causing ligning effects agasint them to be more effective', 1, CURRENT_DATE, 1, CURRENT_DATE),
                              (6,         'Holy Smite',     100,     'You call down the wrath of heaven upon your foe dealing 3d3 + your spellcasting ability damage', 1, CURRENT_DATE, 1, CURRENT_DATE),
                              (7,         'Cure Poison',    50,      'You render the poison in a persons bloodstream ineffective and harmless', 1, CURRENT_DATE, 1, CURRENT_DATE),
                              (8,         'Blackflame',     10000,   'You conjure a black flame in your hand that burns your enemies with intense pain, dealing damage to both you and your opponent equal to 6d6 + your spellcasting ability', 1, CURRENT_DATE, 1, CURRENT_DATE);

CREATE TABLE character_classes (
    character_classes_id        SERIAL    CONSTRAINT character_classes_pk PRIMARY KEY,
    module_id                   INTEGER     CONSTRAINT character_classes_fk REFERENCES modules(module_id) NOT NULL,
    name                VARCHAR(30) NOT NULL,
    xp_cost   INTEGER NOT NULL,
    description TEXT,
    created_by  INTEGER,
    created_date DATE,
    last_updated_by INTEGER,
    last_updated_date DATE
);

INSERT INTO character_classes (module_id, name, xp_cost, description, created_by, created_date, last_updated_by, last_updated_date) 
VALUES                       (1,         'Warrior', 1000, 'You have learned to fight people with weapons and with other fighty things...', 1, CURRENT_DATE, 1, CURRENT_DATE),
                             (2,         'Wizard', 1000, 'You have learned to weaponize magic and use it to do your bidding...', 1, CURRENT_DATE, 1, CURRENT_DATE),
                             (3,         'Ranger', 1000, 'You are comfortable in the wilderness and capable of remarkable things with a bow...', 1, CURRENT_DATE, 1, CURRENT_DATE),
                             (4,         'Rouge', 1000, 'Larceny has become a way of life for you both in and out of combat...', 1, CURRENT_DATE, 1, CURRENT_DATE),
                             (5,         'Bard', 1000, 'Your voice or musical talaent has become a potent force to effect others and the world around you...', 1, CURRENT_DATE, 1, CURRENT_DATE),
                             (6,         'Cleric', 1000, 'You have learned to harness divine might to control the world around you...', 1, CURRENT_DATE, 1, CURRENT_DATE),
                             (7,         'Guardian', 1000, 'You have learned to protect and defend your comrades at all costs...', 1, CURRENT_DATE, 1, CURRENT_DATE),
                             (8,         'Paladin', 1000, 'You have devoted yourself to the cause of a diety and inspire others to assist your cause...', 1, CURRENT_DATE, 1, CURRENT_DATE),
                             (3,         'Ryn-Ky', 1000, 'You have become a master at mixing advanced martial arts with powerful combat magic...', 1, CURRENT_DATE, 1, CURRENT_DATE);

/*class prereqs */

/*class abilities*/

CREATE TABLE character_abilities (
    character_abilities_id        SERIAL     CONSTRAINT character_abilities_pk PRIMARY KEY,
    module_id                   INTEGER     CONSTRAINT character_abilities_fk REFERENCES modules(module_id) NOT NULL,
    name                VARCHAR(30) NOT NULL,
    xp_cost   INTEGER NOT NULL,
    description TEXT,
    created_by  INTEGER,
    created_date DATE,
    last_updated_by INTEGER,
    last_updated_date DATE

);

/*SELECT * FROM character_abilities;*/

INSERT INTO character_abilities (module_id, name,                   xp_cost,    description, created_by, created_date, last_updated_by, last_updated_date) 
    VALUES                      (1,         'Charge',               150,        'You rush at your enemy, and may attack without expending an action point if you advance more than 30 feet in a straight line to reach your opponent', 1, CURRENT_DATE, 1, CURRENT_DATE),
                                (2,         'Arcane Magic I',       150,        'You gain the ability to learn and cast basic arcane magic', 1, CURRENT_DATE, 1, CURRENT_DATE),
                                (3,         'Disengage',            150,        'You may expend an action point to carefully slip away from your opponent without giving them an opportunity to attack you', 1, CURRENT_DATE, 1, CURRENT_DATE),
                                (4,         'Sneak Attack',         150,        'When you attack an opponent with no remaining action points, your attacks deal 1d8 extra damage.', 1, CURRENT_DATE, 1, CURRENT_DATE),
                                (5,         'Bardic Casting I',     150,        'You gain the ability to cast spells using your voice or a musical instrument as a focus', 1, CURRENT_DATE, 1, CURRENT_DATE),
                                (6,         'Divine Magic I',       150,        'You gain the ability to learn and cast basic divine magic', 1, CURRENT_DATE, 1, CURRENT_DATE),
                                (7,         'Defend',               150,        'When an ally within 5 feet of you is attacked, you may expend an action to defend in their behalf', 1, CURRENT_DATE, 1, CURRENT_DATE),
                                (8,         'Lay On of Hands',      150,        'You use divine power to minister to the needs of an ally, restoring health equal to 1d8 + your spellcasting ability or removing one poison or disease effect', 1, CURRENT_DATE, 1, CURRENT_DATE),
                                (1,         'Martial Casting I',    150,        'You gain the ability to cast spells in close range combat using your own limbs and strikes as a focus.', 1, CURRENT_DATE, 1, CURRENT_DATE),
                                (2,         'Adaptation',           150,        'Impairments that reduce skill and ability scores are half as effective against you', 1, CURRENT_DATE, 1, CURRENT_DATE),
                                (3,         'Dwarven Endurance',    150,        'You lose 1 few action points when below half health', 1, CURRENT_DATE, 1, CURRENT_DATE),
                                (4,         'Orcish Resilience',    150,        'Poisons and diseases are half as likely to infect you', 1, CURRENT_DATE, 1, CURRENT_DATE),
                                (5,         'Dragonborne Hide',     150,        'You have a permanent +2 to your armor score', 1, CURRENT_DATE, 1, CURRENT_DATE),
                                (6,         'Elven Sight',          150,        'You suffer no disadvantages in low light settings', 1, CURRENT_DATE, 1, CURRENT_DATE),
                                (7,         'Minotaur Hide',        150,        'Your thick hide gives you immunity to natural cold', 1, CURRENT_DATE, 1, CURRENT_DATE),
                                (8,         'Drask Regeneration',   150,        'You regain 1 hp per turn', 1, CURRENT_DATE, 1, CURRENT_DATE),
                                (1,         'Gnomish Intellect',    150,        'You may reroll any knowledge check once', 1, CURRENT_DATE, 1, CURRENT_DATE);

/*ability prereqs*/

/*SELECT * FROM character_abilities;*/

CREATE TABLE character_races (
    character_races_id          SERIAL     CONSTRAINT character_races_pk PRIMARY KEY  NOT NULL,
    module_id                   INTEGER         CONSTRAINT character_races_fk_1 REFERENCES modules(module_id) NOT NULL,
    race_ability                INTEGER         CONSTRAINT character_races_fk_2 REFERENCES character_abilities(character_abilities_id),
    description                 VARCHAR(2000),
    name                        VARCHAR(30),
    strength_cost_adjust        INTEGER,
    dexterity_cost_adjust       INTEGER,
    constitution_cost_adjust    INTEGER,
    speed_cost_adjust           INTEGER,
    wit_cost_adjust             INTEGER,
    intelligence_cost_adjust    INTEGER,
    wisdom_cost_adjust          INTEGER,
    charisma_cost_adjust        INTEGER,
    created_by                  INTEGER,
    created_date                DATE,
    last_updated_by             INTEGER,
    last_updated_date           DATE
);



INSERT INTO character_races (module_id, race_ability, name, description, strength_cost_adjust, dexterity_cost_adjust, constitution_cost_adjust, speed_cost_adjust, wit_cost_adjust, intelligence_cost_adjust, wisdom_cost_adjust, charisma_cost_adjust, created_by, created_date, last_updated_by, last_updated_date)
VALUES  (1, 10, 'Human','This is a description test', 10, 10, 10, 10, 10, 10, 10, 10, 1, CURRENT_DATE, 1, CURRENT_DATE),
        (2, 11, 'Dwarf','This is a description test', 10, 10, 10, 10, 10, 10, 10, 10, 1, CURRENT_DATE, 1, CURRENT_DATE),
        (3, 12, 'Orc','This is a description test', 10, 10, 10, 10, 10, 10, 10, 10, 1, CURRENT_DATE, 1, CURRENT_DATE),
        (4, 13, 'Dragonborn','This is a description test', 10, 10, 10, 10, 10, 10, 10, 10, 1, CURRENT_DATE, 1, CURRENT_DATE),
        (5, 14,'Elf','This is a description test', 10, 10, 10, 10, 10, 10, 10, 10, 1, CURRENT_DATE, 1, CURRENT_DATE),
        (6, 15,'Minotaur','This is a description test', 10, 10, 10, 10, 10, 10, 10, 10, 1, CURRENT_DATE, 1, CURRENT_DATE),
        (7, 16,'Drask','This is a description test', 10, 10, 10, 10, 10, 10, 10, 10, 1, CURRENT_DATE, 1, CURRENT_DATE),
        (8, 17,'Gnome','This is a description test', 10, 10, 10, 10, 10, 10, 10, 10, 1, CURRENT_DATE, 1, CURRENT_DATE);

CREATE TABLE items (
    item_id            SERIAL      CONSTRAINT items_pk PRIMARY KEY,
    module_id           INTEGER     CONSTRAINT items_fk REFERENCES modules(module_id) NOT NULL,
    name                VARCHAR(30) NOT NULL,
    gold_value          INTEGER,
    description         TEXT,
    created_by          INTEGER     NOT NULL,
    created_date        DATE        NOT NULL,
    last_updated_by     INTEGER     NOT NULL,
    last_updated_date   DATE        NOT NULL

);

INSERT INTO items   (module_id, name,             gold_value, description, created_by, created_date, last_updated_by, last_updated_date) 
VALUES              (1,         'Healing Potion', 100,        'If you drink this, you will probably regrow a limb or something', 1, CURRENT_DATE, 1, CURRENT_DATE),
                    (1,         'Leather Armor',  50,         'A basic for m of protection. Armor +2 while you are wearing it', 1, CURRENT_DATE, 1, CURRENT_DATE),
                    (1,         'Chain Mail',     150,        'A strong yet flexible armor. Armor +4 while you are wearing it', 1, CURRENT_DATE, 1, CURRENT_DATE),
                    (1,         'Plate Mail',     350,        'The strongest set of armor available. Armor +5 while you are wearing it.', 1, CURRENT_DATE, 1, CURRENT_DATE),
                    (1,         'Ruby',           1000,       'Very valuable, but not very useful', 1, CURRENT_DATE, 1, CURRENT_DATE),
                    (1,         'Magic Ring',     2000,       'Who knows what it does, but it is definetely magic', 1, CURRENT_DATE, 1, CURRENT_DATE),
                    (1,         'Short Sword',    200,        'Used for fighting and cutting people. Attack with 1d6. ', 1, CURRENT_DATE, 1, CURRENT_DATE);


CREATE TABLE games (
    game_id SERIAL CONSTRAINT games_pk PRIMARY KEY,
    owner_id INTEGER CONSTRAINT games_fk1 REFERENCES user_accounts(user_account_id),
    name                VARCHAR(30) NOT NULL,
    created_by  INTEGER     NOT NULL,
    created_date DATE       NOT NULL,
    last_updated_by INTEGER NOT NULL,
    last_updated_date DATE  NOT NULL
 
);
INSERT INTO games (owner_id, name, created_by, created_date, last_updated_by, last_updated_date)
VALUES          (1,        'Adventures in Sogored', 1, CURRENT_DATE, 1, CURRENT_DATE),
                (2,         'Dawnforge',            1,  CURRENT_DATE, 1, CURRENT_DATE),
                (3,         'Spectria',             1,  CURRENT_DATE, 1, CURRENT_DATE);

CREATE TABLE party (
    party_id    SERIAL  CONSTRAINT party_pk PRIMARY KEY NOT NULL,
    game_id  INTEGER CONSTRAINT party_fk1 REFERENCES games(game_id),
    created_by  INTEGER     NOT NULL,
    created_date DATE       NOT NULL,
    last_updated_by INTEGER NOT NULL,
    last_updated_date DATE  NOT NULL 
);


INSERT INTO party (game_id, created_by, created_date, last_updated_by, last_updated_date)
VALUES  (1,  1, CURRENT_DATE, 1, CURRENT_DATE),
        (2,  1, CURRENT_DATE, 1, CURRENT_DATE),
        (2,  1, CURRENT_DATE, 1, CURRENT_DATE),
        (3,  1, CURRENT_DATE, 1, CURRENT_DATE);

CREATE TABLE party_members (
    party_id  INTEGER CONSTRAINT party_member_fk1 REFERENCES party(party_id),
    player_id INTEGER CONSTRAINT party_member_fk2 REFERENCES user_accounts(user_account_id),
    created_by  INTEGER     NOT NULL,
    created_date DATE       NOT NULL,
    last_updated_by INTEGER NOT NULL,
    last_updated_date DATE  NOT NULL,
    PRIMARY KEY (party_id, player_id)
);

INSERT INTO party_members (party_id, player_id, created_by, created_date, last_updated_by, last_updated_date)
VALUES      (1,  1, 1, CURRENT_DATE, 1, CURRENT_DATE),
            (2,  1, 1, CURRENT_DATE, 1, CURRENT_DATE),
            (3,  1, 1, CURRENT_DATE, 1, CURRENT_DATE),
            (1,  2, 1, CURRENT_DATE, 1, CURRENT_DATE),
            (1,  3, 1, CURRENT_DATE, 1, CURRENT_DATE);


CREATE TABLE player_characters(
    player_character_id         SERIAL      NOT NULL   CONSTRAINT player_character_pk PRIMARY KEY,
    owner_id                    INTEGER     NOT NULL   CONSTRAINT player_character_fk1 REFERENCES user_accounts(user_account_id),
    party_id                    INTEGER     NOT NULL   CONSTRAINT player_character_fk2 REFERENCES party(party_id),
    race                        INTEGER     NOT NULL   CONSTRAINT player_character_fk3 REFERENCES character_races(character_races_id),
    class                       INTEGER     NOT NULL   CONSTRAINT player_character_fk4 REFERENCES character_classes(character_classes_id),
    major_background            INTEGER     NOT NULL   CONSTRAINT player_character_fk5 REFERENCES character_backgrounds(character_backgrounds_id),
    minor_background            INTEGER     NOT NULL   CONSTRAINT player_character_fk6 REFERENCES character_backgrounds(character_backgrounds_id),
    name                        VARCHAR(30) NOT NULL,
    hair                        VARCHAR(30),
    skin                        VARCHAR(30),
    eyes                        VARCHAR(30),
    height                      VARCHAR(30) NOT NULL,
    weight                      INTEGER     NOT NULL,
    strength                    INTEGER,
    dexterity                   INTEGER,
    constitution                INTEGER,
    speed                       INTEGER,
    wit                         INTEGER,
    intelligence                INTEGER,
    wisdom                      INTEGER,
    charisma                    INTEGER,
    created_by                  INTEGER,
    created_date                DATE,
    last_updated_by             INTEGER,
    last_updated_date           DATE
);

INSERT INTO player_characters (owner_id, party_id, race, class, major_background, minor_background, name, hair, skin, eyes, height, weight, strength, dexterity, constitution, speed, wit, intelligence, wisdom, charisma, created_by, created_date, last_updated_by, last_updated_date)
VALUES      (1, 1, 1, 1, 1, 2, 'Thren',     'black',   'dark'   ,   'brown'  , '6.9',  185  ,    10, 10, 10, 10, 10, 10, 10, 10, 1, CURRENT_DATE, 1, CURRENT_DATE),
            (2, 1, 2, 2, 2, 3, 'Dwarfy',    'red',     'grey'   ,   'brown'  , '4.10', 165  ,    10, 10, 10, 10, 10, 10, 10, 10, 1, CURRENT_DATE, 1, CURRENT_DATE),
            (1, 2, 3, 3, 3, 4,'Wyvrn',      'bald',    'green'  ,   'blue' ,   '5.9',  170 ,    10, 10, 10, 10, 10, 10, 10, 10, 1, CURRENT_DATE, 1, CURRENT_DATE),
            (2, 2, 4, 4, 4, 5,'Scortch',    'none',    'copper' ,   'red' ,    '7.4' , 280  ,    10, 10, 10, 10, 10, 10, 10, 10, 1, CURRENT_DATE, 1, CURRENT_DATE),
            (1, 1, 5, 5, 5, 6,'Vaelynth',   'blonde',  'olive'  ,   'green' ,  '5.7' , 125  ,    10, 10, 10, 10, 10, 10, 10, 10, 1, CURRENT_DATE, 1, CURRENT_DATE),
            (2, 1, 6, 6, 6, 7,'Griffhorn',  'black',   'tan fur',   'brown',   '7.10', 380  ,    10, 10, 10, 10, 10, 10, 10, 10, 1, CURRENT_DATE, 1, CURRENT_DATE),
            (1, 2, 7, 7, 7, 8,'Lizreal',    'none',    'green'  ,   'yellow' , '6.5',  128 ,    10, 10, 10, 10, 10, 10, 10, 10, 1, CURRENT_DATE, 1, CURRENT_DATE),
            (2, 2, 8, 8, 8, 1,'Irendrel',   'white',   'white'  ,   'silver',  '4.4' , 85  ,    10, 10, 10, 10, 10, 10, 10, 10, 1, CURRENT_DATE, 1, CURRENT_DATE);
/* SOME INFO TO INSERT */ 


/*Alter User First_Name */
UPDATE user_accounts
SET first_name = 'Jhon'
WHERE user_account_id = 2;

/* Select Races Included in Owned Modules */
SELECT c.character_races_id FROM character_races c INNER JOIN user_orders orders ON c.module_id = orders.module_id WHERE orders.user_account_id = 2;

SELECT * FROM user_orders;
SELECT * FROM modules;
SELECT * FROM modules m LEFT JOIN user_orders orders ON m.module_id = orders.module_id WHERE orders.module_id = NULL;
SELECT * FROM modules m LEFT JOIN user_orders orders ON m.module_id = orders.module_id;

/* Select Modules that the User hasn't purchased yet */
SELECT
*
FROM
    modules m
LEFT JOIN (SELECT * FROM user_orders WHERE user_account_id = 3) orders ON m.module_id = orders.module_id
WHERE orders.module_id IS NULL;

SELECT name, player_character_id, pc.owner_id, pc.party_id FROM player_characters pc INNER JOIN party_members pm on pc.owner_id = pm.player_id WHERE pc.party_id = 1 AND  pm.party_id = 1;