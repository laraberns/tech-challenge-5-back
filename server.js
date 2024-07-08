const express = require('express');
const app = express();
const port = 8383;
const { db } = require('./firebase.js');
const { FieldValue } = require('firebase-admin/firestore');
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(express.json());

app.get('/friends', async (req, res) => {
    try {
        const peopleRef = db.collection('test').doc('associates');
        const doc = await peopleRef.get();
        
        if (!doc.exists) {
            return res.sendStatus(400);
        }

        res.status(200).send(doc.data());
    } catch (error) {
        console.error('Error fetching friends:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/friends/:name', async (req, res) => {
    const { name } = req.params;

    try {
        const peopleRef = db.collection('test').doc('associates');
        const doc = await peopleRef.get();

        if (!doc.exists || !doc.data()[name]) {
            return res.status(404).send('Friend not found');
        }

        res.status(200).send({ [name]: doc.data()[name] });
    } catch (error) {
        console.error('Error fetching friend:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.post('/addfriend', async (req, res) => {
    const { name, status } = req.body;

    if (!name || !status) {
        return res.status(400).send('Name and status are required');
    }

    try {
        const peopleRef = db.collection('test').doc('associates');
        await peopleRef.set({
            [name]: status
        }, { merge: true });

        res.status(200).send('Friend added successfully');
    } catch (error) {
        console.error('Error adding friend:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.patch('/changestatus', async (req, res) => {
    const { name, newStatus } = req.body;

    if (!name || !newStatus) {
        return res.status(400).send('Name and new status are required');
    }

    try {
        const peopleRef = db.collection('test').doc('associates');
        await peopleRef.set({
            [name]: newStatus
        }, { merge: true });

        res.status(200).send('Status changed successfully');
    } catch (error) {
        console.error('Error changing status:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.delete('/friends', async (req, res) => {
    const { name } = req.body;

    if (!name) {
        return res.status(400).send('Name is required');
    }

    try {
        const peopleRef = db.collection('test').doc('associates');
        await peopleRef.update({
            [name]: FieldValue.delete()
        });

        res.status(200).send('Friend deleted successfully');
    } catch (error) {
        console.error('Error deleting friend:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.listen(port, () => console.log(`Server has started on port: ${port}`));
