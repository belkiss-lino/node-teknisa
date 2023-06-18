const express = require('express');
const bodyParser = require('body-parser');
const programmer = require('./database/tables/programmers');


const app = express();
const port = 8080;

app.use(bodyParser.json());

app.listen(port, () =>{
    console.log(`Listen port ${port}`);
});

app.get('/syncDatabase', async (req, res) =>{
    const database = require('./database/tables/programmers.js/db');

    try    {
        await database.sync();
    } catch(error)    {
        res.send(error);
    }
});

app.post('/createProgrammer', async (req, res) =>{
    try{
        const params = req.body;
        const properties = ['name', 'python', 'java', 'javascript'];

        const check = properties.every((property) =>        {
            return property in params;
        });

        if(!check)        {
            const propStr = properties.join(', ');
            res.send(`All params needed to create a programmer must been send: ${propStr}`);
            return;
        }

        const newProgrammer = await programmer.create({
            name: params.name,
            python: params.python,
            javascript: params.javascript,
            java: params.java
        });

        res.send(newProgrammer);

    } catch(error){
        res.send(error);
    }

}
);

app.get('/retrieverProgrammer', async (req, res) => {
    try {
        const params = req.body;
        if ('id' in params) {
            const record = await programmer.findByPk(params.id);

            if (record) {
                res.send(record);
            } else {
                res.send('No programmer found using received ID');
            }

            return;
        }

        const records = await programmer.findAll();
        res.send(records);

    } catch (error) {
        res.send(error);
    }
});

app.put('/updateProgrammer', async(req, res) =>{
    try {
        const params = req.body;

        if (!('id' in params)) {
            res.send('Missing "id" in request body. ')
            return;
        }

        const record = await programmer.findByPk(params.id);

        if(!record){
            res.send(`Programmer id not found.`);
            return;
        }

        const properties = ['name','python','java','javascript'];

        const check = properties.some((property) => {
            return property in params;
        });

        record.name = params.name || record.name;
        record.python = params.python || record.python;
        record.java = params.java || record.java;
        record.javascript = params.javascript;

        await record.save;

        res.send(`${record.id} ${record.name} - Updated successfully`);

    } catch (error) {
        res.send(error);
    }
});

app.delete('/deleteProgrammer', async(req, res) => {
    try {
        const params = req.body;
if (!('id' in params)) {
    req.send('Missing "id" in request body.');
    return;
}

    await record.destroy();

    res.send(`${record.id} ${record.name} - Deleted successfully.`);

    } catch (error) {
        res.send(error);
    }
})