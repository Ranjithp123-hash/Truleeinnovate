const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();
const port = 4000;

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '12345',
    database: 'Truleeinnovate',
    port: '3307'

});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err.stack);
        return;
    }
    console.log('Connected to the database');
});

app.use(express.json());
app.use(cors());


// adding candidates
app.post('/addcandidates', (req, res) => {
    const { name, phone, email, gender, experience, skills } = req.body;

    if (!name || !phone || !email || !gender || !experience || !skills) {
        return res.status(400).send('All fields are required');
    }
    

    const sql = 'INSERT INTO candidates (name, phone, email, gender, experience, skills) VALUES (?, ?, ?, ?, ?, ?)';
    connection.execute(sql, [name, phone, email, gender, experience, skills], (err, result) => {
        if (err) {
            console.error('Error inserting candidate:', err);
            return res.status(500).send('Error inserting candidate');
        }
        res.json({ status: 200, message: "Added User" });
    });
});

// updating candidates
app.put('/updatecandidate', (req, res) => {
    const { id, name, phone, email, gender, experience, skills } = req.body;
    if (!id) {
        return res.status(400).send('ID is required');
    }
    if (!name && !phone && !email && !gender && !experience && !skills) {
        return res.status(400).send('At least one field is required to update');
    }
    let sql = 'UPDATE candidates SET ';
    let values = [];
    if (name) {
        sql += 'name = ?, ';
        values.push(name);
    }
    if (phone) {
        sql += 'phone = ?, ';
        values.push(phone);
    }
    if (email) {
        sql += 'email = ?, ';
        values.push(email);
    }
    if (gender) {
        sql += 'gender = ?, ';
        values.push(gender);
    }
    if (experience) {
        sql += 'experience = ?, ';
        values.push(experience);
    }
    if (skills) {
        sql += 'skills = ?, ';
        values.push(skills);
    }
    sql = sql.slice(0, -2);
    sql += ' WHERE id = ?';
    values.push(id);
    connection.execute(sql, values, (err, result) => {
        if (err) {
            console.error('Error updating candidate:', err);
            return res.status(500).send('Error updating candidate');
        }
        if (result.affectedRows === 0) {
            return res.status(404).send('Candidate not found');
        }
        res.status(200).send(`Candidate with ID ${id} updated successfully`);
    });
});


// delete candidates
app.post('/deletecandidate', (req, res) => {
    const { id } = req.body;
    if (!id) {
        return res.status(400).send('id is required');
    }
    const sql = 'DELETE FROM candidates WHERE id = ?';
    connection.execute(sql, [id], (err, result) => {
        if (err) {
            console.error('Error deleting candidate:', err);
            return res.status(500).send('Error deleting candidate');
        }
        if (result.affectedRows === 0) {
            return res.status(404).send('Candidate not found');
        }
        res.status(200).send(`Candidate with ID ${id} deleted successfully`);
    });
});


//get candidates by Id
app.post('/getcandidatebyid', (req, res) => {
    const { id } = req.body;
    if (!id) {
        return res.status(400).send('id is required');
    }
    const sql = 'SELECT * FROM candidates WHERE id = ?';
    connection.execute(sql, [id], (err, result) => {
        if (err) {
            console.error('Error getting candidate:', err);
            return res.status(500).send('Error getting candidate');
        }
        if (result.affectedRows === 0) {
            return res.status(404).send('Candidate not found');
        }
        res.json(result);

    });
});

//get all candidates
app.get('/getcandidates', (req, res) => {
    const sql = 'SELECT * FROM candidates';
    connection.execute(sql, (err, result) => {
        if (err) {
            console.error('Error getting candidate:', err);
            return res.status(500).send('Error getting candidate');
        }
        res.json(result);
    });
});




// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
