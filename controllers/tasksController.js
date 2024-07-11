
const { db } = require('../firebase.js');

const validPriorities = ['Alta', 'Média', 'Baixa'];
const validStatuses = ['Backlog', 'Em Desenvolvimento', 'Finalizada'];

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
    const { name, description, priority, time, user, status, finalDate, fcmtoken } = req.body;

    if (!name || !description || !priority || !time || !user || !status || !finalDate || !fcmtoken) {
        return res.status(400).send('Nome, descrição, prioridade, tempo, usuário atribuído, status, data final e token FCM são requeridos.');
    }

    if (!validPriorities.includes(priority)) {
        return res.status(400).send(`Prioridade inválida. As opções válidas são: ${validPriorities.join(', ')}.`);
    }

    if (!validStatuses.includes(status)) {
        return res.status(400).send(`Status inválido. As opções válidas são: ${validStatuses.join(', ')}.`);
    }

    if (!Number.isInteger(time) || time < 0) {
        return res.status(400).send('Tempo estimado deve ser um número inteiro positivo.');
    }

    try {
        const tasksRef = db.collection('tasks');
        const newTaskRef = await tasksRef.add({
            name, description, priority, time, user, status, finalDate, fcmtoken
        });

        res.status(200).send({ id: newTaskRef.id, message: 'Tarefa adicionada com sucesso' });
    } catch (error) {
        console.error('Erro:', error);
        res.status(500).send('Erro interno');
    }
};

exports.changeTask = async (req, res) => {
    const { id, name, description, priority, time, user, status, finalDate, fcmtoken } = req.body;

    if (!id || !name || !description || !priority || !time || !user || !status || !finalDate || !fcmtoken) {
        return res.status(400).send('ID, nome, descrição, prioridade, tempo, usuário atribuído, status, data final e token FCM são requeridos.');
    }

    if (!validPriorities.includes(priority)) {
        return res.status(400).send(`Prioridade inválida. As opções válidas são: ${validPriorities.join(', ')}.`);
    }

    if (!validStatuses.includes(status)) {
        return res.status(400).send(`Status inválido. As opções válidas são: ${validStatuses.join(', ')}.`);
    }

    if (!Number.isInteger(time) || time < 0) {
        return res.status(400).send('Tempo estimado deve ser um número inteiro positivo.');
    }

    try {
        const taskRef = db.collection('tasks').doc(id);
        await taskRef.update({
            name, description, priority, time, user, status, finalDate
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
        const doc = await taskRef.get();

        if (!doc.exists) {
            return res.status(404).send('Tarefa não encontrada');
        }

        await taskRef.delete();
        res.status(200).send('Tarefa deletada com sucesso');
    } catch (error) {
        console.error('Erro:', error);
        res.status(500).send('Erro interno');
    }
};
