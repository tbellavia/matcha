CREATE TABLE UserLogin (
    id serial PRIMARY KEY NOT NULL, 
    email VARCHAR(255),
    passw VARCHAR(255),
    active BOOLEAN,
    id_user_profile INT
);

CREATE TABLE UserProfile (
    id serial PRIMARY KEY NOT NULL, 
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    genre INT,
    preference INT,
    biograpy TEXT,
    tags INT,
    loc CHAR(1000),
    rating INT,
    photo1 TEXT, 
    photo2 TEXT,
    photo3 TEXT,
    photo4 TEXT,
    photo5 TEXT
);

CREATE TABLE Tag (
    id serial PRIMARY KEY NOT NULL,
    tag VARCHAR(100)
);

CREATE TABLE LikeTable (
    id serial PRIMARY KEY NOT NULL,
    user1 INT,
    user2 INT,
    user1Like BOOLEAN,
    user2Like BOOLEAN
);

CREATE TABLE Blocked (
    id serial PRIMARY KEY NOT NULL,
    user1 INT,
    user2 INT
);


CREATE TABLE Ban (
    id serial PRIMARY KEY NOT NULL,
    mail VARCHAR(100)
);

CREATE TABLE Chat (
    id serial PRIMARY KEY NOT NULL,
    id_user1 INT,
    id_user2 INT
);

CREATE TABLE Message (
    id serial PRIMARY KEY NOT NULL,
    id_chat INT,
    date_envoi timestamp,
    mess TEXT,
    userWrite BOOLEAN
);

INSERT INTO UserLogin
(
   email,
    passw,
    active,
    id_user_profile
)
VALUES ('admin@admin','pwd',TRUE,1),
('test1@test1','pwd',TRUE,2),
('test2@test2','pwd',FALSE,NULL),
('test3@test3','pwd',TRUE,NULL),
('test4@test4','pwd',TRUE,NULL)