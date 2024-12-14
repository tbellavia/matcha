CREATE TABLE UserLogin (
    id serial PRIMARY KEY NOT NULL, 
    email VARCHAR(255),
    passw VARCHAR(255),
    active BOOLEAN,
    id_user_profile INT,
    mailvalidation CHAR(125)
);

CREATE TABLE UserProfile (
    id serial PRIMARY KEY NOT NULL, 
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    birth DATE,
    genre INT,
    preference INT,
    biography TEXT,
    tags TEXT,
    latitude FLOAT,
    longitude FLOAT,
    rating INT,
    photo1 TEXT, 
    photo2 TEXT,
    photo3 TEXT,
    photo4 TEXT,
    photo5 TEXT,
    agemin INT DEFAULT 18,
    agemax INT DEFAULT 150,
    distmax INT DEFAULT 1000,
    minRating FLOAT DEFAULT 0,
    filtertags TEXT DEFAULT '',
    notifsviews TEXT DEFAULT '{}',
    notifslikes TEXT DEFAULT '{}',
    notifsmessages TEXT DEFAULT '{}',
    tri INT DEFAULT 0,
    lastConnection DATE
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
    userWrite INT
);

CREATE TABLE views (
    id serial PRIMARY KEY NOT NULL,
    id_user1 INT,
    id_user2 INT
);

INSERT INTO UserLogin(
    email,
    passw,
    active,
    id_user_profile
)
VALUES ('test1@test1.com','pwd',TRUE,1),
('test2@test2.com','pwd',TRUE,2),
('test3@test3.com','pwd',TRUE,3),
('test4@test4.com','pwd',TRUE,4),
('test5@test5.com','pwd',TRUE,5),
('test6@test6.com','pwd',TRUE,6),
('test7@test7.com','pwd',TRUE,7),
('test8@test8.com','pwd',TRUE,8),
('test9@test9.com','pwd',TRUE,9),
('test10@test10.com','pwd',TRUE,10);

INSERT INTO UserProfile(
    first_name,
    last_name,
    birth,
    genre,
    preference,
    biography,
    latitude,
    longitude
)
VALUES ('test1','test1','2002-08-15',1,7,'salut', 48.866667, 2.333333),
('test2','test2','2000-08-15',2,6,'salut', 48.882212427373794, 2.350155814941397),
('test3','test3','1990-08-15',4,2,'salut', 48.83879594998506, 2.3206300581054595),
('test4','test4','1999-08-15',2,3,'salut', 48.811170795677846, 2.3769349897460845),
('test5','test5','1966-08-15',1,4,'salut', 48.886579517447906, 2.2093934858398345),
('test6','test6','2000-08-15',4,1,'salut', 48.8765960288886, 2.296597465332022),
('test7','test7','1956-08-15',2,2,'salut', 48.983910926215025, 2.2286195600585845),
('test8','test8','1995-08-15',1,7,'salut', 48.824388411236626, 2.3357362592773345),
('test9','test9','2000-08-15',4,1,'salut', 47.898596931384624, 1.8990297163085845),
('test10','test10','1970-08-15',4,3,'salut', 47.901308656132755, 2.0267457807617095);

INSERT INTO liketable(
    user1,
    user2,
    user1like,
    user2like
)
VALUES (1,4,TRUE,FALSE),
(1,6,TRUE,TRUE),
(1,8,TRUE,NULL),
(1,10,FALSE,NULL),
(2,10,TRUE,NULL),
(2,4,TRUE,TRUE),
(2,3,FALSE,NULL),
(4,5,TRUE,NULL),
(5,10,TRUE,TRUE),
(5,9,TRUE,TRUE),
(5,6,FALSE,FALSE),
(7,10,TRUE,NULL),
(7,8,NULL,TRUE);

INSERT INTO views(
    id_user1,
    id_user2
)
VALUES (1,4),
(1,6),
(1,8),
(1,10),
(2,10),
(2,4),
(2,3),
(4,5),
(5,10),
(5,9),
(5,6),
(7,10),
(7,8),
(4,1),
(6,1),
(8,1),
(10,1),
(10,2),
(4,2),
(3,2),
(5,4),
(10,5),
(9,5),
(6,5),
(10,7),
(8,7);

INSERT INTO chat(
    id_user1,
    id_user2
)
VALUES (1,6),
(2,4),
(5,10),
(5,9);