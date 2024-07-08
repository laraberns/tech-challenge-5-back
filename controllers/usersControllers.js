const { db } = require('../firebase.js');

exports.getUsers = async (req, res) => {
    try {
        const usersRef = db.collection('users');
        const snapshot = await usersRef.get();
        
        if (snapshot.empty) {
            return res.status(404).send('Nenhum usuário registrado');
        }

        let users = [];
        snapshot.forEach(doc => {
            users.push({ id: doc.id, ...doc.data() });
        });

        res.status(200).send(users);
    } catch (error) {
        console.error('Erro:', error);
        res.status(500).send('Erro interno');
    }
};

exports.getUserById = async (req, res) => {
    const { id } = req.params;

    try {
        const userRef = db.collection('users').doc(id);
        const doc = await userRef.get();

        if (!doc.exists) {
            return res.status(404).send('Usuário não encontrado');
        }

        res.status(200).send({ id: doc.id, ...doc.data() });
    } catch (error) {
        console.error('Erro:', error);
        res.status(500).send('Erro interno');
    }
};

exports.addUser = async (req, res) => {
    const { name, email, role } = req.body;

    if (!name || !email || !role) {
        return res.status(400).send('Nome, e-mail e cargo são requeridos.');
    }

    try {
        const usersRef = db.collection('users');
        const newUserRef = await usersRef.add({
            name,
            email,
            role
        });

        res.status(200).send({ id: newUserRef.id, message: 'Usuário adicionado com sucesso' });
    } catch (error) {
        res.status(500).send('Erro interno');
    }
};

exports.changeUser = async (req, res) => {
    const { id, name, email, role } = req.body;

    if (!id || !name || !email || !role) {
        return res.status(400).send('ID, nome, email, e cargo são necessários');
    }

    try {
        const userRef = db.collection('users').doc(id);
        await userRef.update({
            name,
            email,
            role
        });

        res.status(200).send('Usuário atualizado com sucesso');
    } catch (error) {
        console.error('Erro:', error);
        res.status(500).send('Erro interno');
    }
};

exports.deleteUser = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).send('ID é necessário');
    }

    try {
        const userRef = db.collection('users').doc(id);
        await userRef.delete();

        res.status(200).send('Usuário deletado com suceso');
    } catch (error) {
        console.error('Erro:', error);
        res.status(500).send('Erro interno');
    }
};