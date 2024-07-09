const { db } = require('../firebase.js');

const teamOptions = [
    'Recursos Humanos (RH)',
    'Vendas',
    'Marketing',
    'Desenvolvimento de Produto',
    'Suporte ao Cliente',
    'TI (Tecnologia da Informação)',
    'Finanças',
    'Jurídico e Compliance'
];

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
    const { name, email, role, team } = req.body;

    if (!name || !email || !role || !team) {
        return res.status(400).send('Nome, e-mail, cargo e equipe são requeridos.');
    }

    if (!teamOptions.includes(team)) {
        return res.status(400).send('Equipe inválida. As opções válidas são: ' + teamOptions.join(', '));
    }

    try {
        const usersRef = db.collection('users');
        const querySnapshot = await usersRef.where('email', '==', email).get();

        if (!querySnapshot.empty) {
            return res.status(400).send('E-mail já está em uso.');
        }

        const newUserRef = await usersRef.add({
            name,
            email,
            role,
            team
        });

        res.status(200).send({ id: newUserRef.id, message: 'Usuário adicionado com sucesso' });
    } catch (error) {
        console.error('Erro:', error);
        res.status(500).send('Erro interno');
    }
};

exports.changeUser = async (req, res) => {
    const { id, name, email, role, team } = req.body;

    if (!id || !name || !email || !role || !team) {
        return res.status(400).send('ID, nome, e-mail, cargo e equipe são necessários.');
    }

    if (!teamOptions.includes(team)) {
        return res.status(400).send('Equipe inválida. As opções válidas são: ' + teamOptions.join(', '));
    }

    try {
        const userRef = db.collection('users').doc(id);
        const doc = await userRef.get();
        if (!doc.exists) {
            return res.status(404).send('Usuário não encontrado');
        }

        const existingEmailSnapshot = await db.collection('users').where('email', '==', email).get()

        if (!existingEmailSnapshot.empty && existingEmailSnapshot.docs[0].id !== id) {
            return res.status(400).send('E-mail já está em uso.');
        }

        await userRef.update({
            name,
            email,
            role,
            team
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
        const doc = await userRef.get();

        if (!doc.exists) {
            return res.status(404).send('Usuário não encontrado');
        }

        await userRef.delete();
        res.status(200).send('Usuário deletado com sucesso');
    } catch (error) {
        console.error('Erro:', error);
        res.status(500).send('Erro interno');
    }
};
