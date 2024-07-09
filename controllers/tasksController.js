const { db } = require('../firebase.js');

exports.getTasks = async (req, res) => {
    try {
        const tasksRef = db.collection('tasks');
        const snapshot = await tasksRef.get();

        if (snapshot.empty) {
            return res.status(404).send('Nenhuma tarefa registrada');
        }

        let tasks = [];
        snapshot.forEach(doc => {
            tasks.push({ id: doc.id, ...doc.data() });
        });

        res.status(200).send(tasks);
    } catch (error) {
        console.error('Erro:', error);
        res.status(500).send('Erro interno');
    }
};

exports.getTaskById = async (req, res) => {
    const { id } = req.params;

    try {
        const taskRef = db.collection('tasks').doc(id);
        const doc = await taskRef.get();

        if (!doc.exists) {
            return res.status(404).send('Tarefa não encontrada');
        }

        res.status(200).send({ id: doc.id, ...doc.data() });
    } catch (error) {
        console.error('Erro:', error);
        res.status(500).send('Erro interno');
    }
};

exports.addTask = async (req, res) => {
    const { name, description, priority, time, user, status } = req.body;

    if (!name || !description || !priority || !time || !user || !status) {
        return res.status(400).send('Nome, descrição, prioridade, tempo e usuário atribuído são requeridos.');
    }

    try {
        const tasksRef = db.collection('tasks');
        const newUserRef = await tasksRef.add({
            name, description, priority, time, user, status
        });

        res.status(200).send({ id: newUserRef.id, message: 'Tarefa adicionada com sucesso' });
    } catch (error) {
        console.error('Erro:', error);
        res.status(500).send('Erro interno');
    }
};

exports.changeTask = async (req, res) => {
    const { id,  name, description, priority, time, user, status } = req.body;

    if (!id || !name || !description || !priority || !time || !user || !status) {
        return res.status(400).send('ID, nome, descrição, prioridade, tempo e usuário atribuído são requeridos.');
    }

    try {
        const taskRef = db.collection('tasks').doc(id);
        await taskRef.update({
            name, description, priority, time, user, status
        });

        res.status(200).send('Tarefa atualizada com sucesso');
    } catch (error) {
        console.error('Erro:', error);
        res.status(500).send('Erro interno');
    }
};

exports.deleteTask = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).send('ID é necessário');
    }

    try {
        const taskRef = db.collection('tasks').doc(id);
        await taskRef.delete();

        res.status(200).send('Tarefa deletada com sucesso');
    } catch (error) {
        console.error('Erro:', error);
        res.status(500).send('Erro interno');
    }
};
