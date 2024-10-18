require('dotenv').config()

const mysql = require('mysql2/promise')

const pool = mysql.createPool({
    host: process.env.HOST_URL,
    user: process.env.USER,
    password: process.env.PASSWORD,
    // timeout: 15,
    multipleStatements: true,
    connectionLimit: 10,
    database: 'mydb'
})

pool.getConnection((err,connection)=> {
    if(err)
    throw err;
    console.log('Database connected successfully');
    connection.release();
  });
  

createSchemaQuery = `
    DROP SCHEMA IF EXISTS \`mydb\`;
    CREATE SCHEMA IF NOT EXISTS \`mydb\` DEFAULT CHARACTER SET utf8 ;
    USE \`mydb\`;
`

createUserTableQuery = `
    DROP TABLE IF EXISTS User;

    CREATE TABLE User (
        \`user_firebase_id\` VARCHAR(128) NOT NULL,
        \`name\` VARCHAR(45) DEFAULT '',
        \`pronouns\` VARCHAR(12) DEFAULT '',
        \`email\` VARCHAR(45) DEFAULT '',
        \`phone_number\` VARCHAR(12) DEFAULT '',
        \`profile_img_url\` VARCHAR(255) DEFAULT '',
        PRIMARY KEY (\`user_firebase_id\`)
    );
`

createPostTableQuery = `
    DROP TABLE IF EXISTS Post;

    CREATE TABLE Post (
    \`post_id\` INT NOT NULL AUTO_INCREMENT,
    \`user_firebase_id\` VARCHAR(128) NOT NULL,
    \`image_url\` VARCHAR(255) DEFAULT '',
    \`title\` VARCHAR(100) NOT NULL,
    \`description\` VARCHAR(500) DEFAULT '',
    \`color\` VARCHAR(30) DEFAULT '',
    \`attributes\` JSON DEFAULT NULL,
    \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (\`post_id\`),
    CONSTRAINT \`post_user_constraint\`
        FOREIGN KEY (\`user_firebase_id\`)
        REFERENCES \`User\` (\`user_firebase_id\`)
        ON DELETE CASCADE,
    INDEX idx_title (\`title\`),
    INDEX idx_color (\`color\`)
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
            console.log(result)
        });
    });
}

const createFakeUser = async () => {
    try {
        // Insert a new user into the User table
        // const insertQuery = `INSERT INTO User (user_firebase_id) VALUES (?)`;
        // const [insertResult] = await pool.execute(insertQuery, ['2']); // Use execute for better predictability
        // console.log('User inserted with ID:', insertResult.insertId);

        // Select all users from the User table
        const [users] = await pool.execute('SELECT * FROM User');
        console.log('All users:', users);

    } catch (err) {
        console.log('Error:', err);
    }
};

module.exports = pool;