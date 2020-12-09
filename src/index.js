const { request, response } = require('express');
const express = require ('express');
const { uuid, isUuid } = require ('uuidv4');

const app = express ();

app.use(express.json());

const projects = [];

function validateId(request, response, next){
    const {id} = request.params;

    if (!isUuid(id)) {
        return response.status(400).json({ error:"Invalid Product ID." });    
    }
    return next();
}

function checkDados(request, response, next){
    if (projects.length === 0) {
        return response.status(200).json({error:"There are no registered projects"});
    }
    return next();
}

app.get('/projects', checkDados, (request, response) => {
    const {title} = request.query;

    const results = title
        ? projects.filter(project => project.title.includes(title))
        : projects;
    
    return response.json(results);
}); 

app.post('/projects', (request, response) => {
    const {title, owner} = request.body;

    const project = {id: uuid(), title, owner};

    projects.push(project);

    return response.json(project);
});

app.put('/projects/:id', validateId, (request, response) => {
    const { id } = request.params;
    const {title, owner} = request.body;

    const projectIndex = projects.findIndex(project => project.id === id);

    const project = {
        id,
        title,
        owner,
    };

    projects[projectIndex] = project;

    return response.json(project);
});

app.delete('/projects/:id', validateId, (request, response) => {
    const { id } = request.params;

    const projectIndex = projects.findIndex(project => project.id === id);

    projects.splice(projectIndex, 1);

    return response.status(204).send();
})

app.listen(3334, () => {
    console.log('🚀Exercicio Back-end!');
});
