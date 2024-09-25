require('dotenv').config()

const mysql = require('mysql')

const conn = mysql.createConnection({
    host: process.env.HOST_URL,
    user: process.env.USER,
    password: process.env.PASSWORD,
    timeout: 15,
    multipleStatements: true
})

createSchemaQuery = `
    DROP SCHEMA IF EXISTS \`mydb\`;
    CREATE SCHEMA IF NOT EXISTS \`mydb\` DEFAULT CHARACTER SET utf8 ;
    USE \`mydb\`;
`

createUserTableQuery = `
    DROP TABLE IF EXISTS User;

    CREATE TABLE User (
        \`user_id\` INT NOT NULL,
        \`name\` VARCHAR(45) DEFAULT '',
        \`pronouns\` VARCHAR(12) DEFAULT '',
        \`email\` VARCHAR(45) DEFAULT '',
        \`phone_number\` VARCHAR(12) DEFAULT '',
        \`profile_img_url\` VARCHAR(255) DEFAULT '',
        PRIMARY KEY (\`user_id\`)
    );
`

createPostTableQuery = `
    DROP TABLE IF EXISTS Post;

    CREATE TABLE Post (
        \`user_id\` INT NOT NULL,
        \`post_id\` INT NOT NULL,
        \`image_url\` VARCHAR(255) DEFAULT '',
        \`title\` VARCHAR(20) DEFAULT '',
        \`description\` VARCHAR(255) DEFAULT '',
        \`color\` VARCHAR(20) DEFAULT '',
        \`attributes\` VARCHAR(255) DEFAULT '',
        CONSTRAINT \`post_user_constraint\`
            FOREIGN KEY (\`user_id\`)
            REFERENCES \`User\` (\`user_id\`)
            ON DELETE CASCADE
    );
`

const createTables = () => {
    conn.connect(function(err) {
        if (err) throw err;
        console.log("Connected! Creating tables...");

        conn.query(createSchemaQuery, function (err, result) {
            if (err) throw err;
            console.log("Schema created");
        });

        conn.query(createUserTableQuery, function (err, result) {
            if (err) throw err;
            console.log("User table created");
        });

        conn.query(createPostTableQuery, function (err, result) {
            if (err) throw err;
            console.log("Post table created");
        });
    });
}

// createTables();