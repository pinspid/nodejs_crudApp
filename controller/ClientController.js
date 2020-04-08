let asyncLib = require('async');
let models = require('../models');

const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

module.exports = {
    store: (req, res) => {

        let name = req.body.name;
        let firstname = req.body.firstname;
        let email = req.body.email;
        let contact = req.body.contact;
        let entrepriseId = req.body.entrepriseId;
        let status = req.body.status;

        console.log(req.body);

        if(name == null || firstname== null || email == null || contact == null){
            return res.status(400).json({'error': 'missing parameters'});
        }


        if(!EMAIL_REGEX.test(email)){
            return res.status(400).json({'error': 'the email fields must  be a valid address email'});
        }


        models.Client.findOne({
            attributes: ['email'],
            where:{
                email:email
            }
        }).then(clientFound => {
            if(!clientFound){
                models.Client.create({
                    name: name,
                    firstname: firstname,
                    email: email,
                    contact: contact,
                    EntrepriseId: entrepriseId,
                    status: status
                }).then(newClient => {
                    res.redirect('/client', 200);
                }).catch(err => {
                    return res.status(500).json(err);
                });
            }else{
                return res.status(409).json({'error': 'Client already exist'});
            }
        }).catch(err => {
            return res.status(500).json({'error': 'cannot find client'});
        });
    },
    create: (req, res) => {

        // let id = req.params.id;

        // if(id !== null) {
        //     models.Client.findOne({
        //         where:{
        //             id: id
        //         }
        //     }).then(clientFound => {
        //         if(clientFound){
        //             res.render('clients/create', {client: clientFound});
        //         }
        //     }).catch(err => {
        //         console.log(err);
        //     });
        // }

        models.Entreprise.findAll({}).then((entreprises) => {
            res.render('clients/create', {entreprises: entreprises});
        }).catch(err => {
            res.json(err);
        });
    },
    index: (req, res) => {
        models.Client.findAll({
            include: [{
                model: models.Entreprise,
                attributes: ['name']
            }]
        }).then(clients => {
            if(clients){
                res.render('clients/index', {clients: clients});
            }else{
                res.status(404).json({'error': 'Not Client Found'});
            }
        }).catch(err => {
            res.status(500).json(err);
        });
    },
    update: (req, res) => {
        let name = req.body.name;
        let firstname = req.body.firstname;
        let email = req.body.email;
        let contact = req.body.contact;
        let entrepriseId = req.body.EntrepriseId;
        let status = req.body.status;
        
        if(name == null || firstname== null || email == null || contact == null){
            return res.status(400).json({'error': 'missing parameters'});
        }


        if(!EMAIL_REGEX.test(email)){
            return res.status(400).json({'error': 'the email fields must  be a valid address email'});
        }

        models.Client.findOne({
            where:{
                id:req.params.id
            }
        }).then(clientFound => {
            if(!clientFound){
                models.Client.update({
                    name: name,
                    firstname: firstname,
                    email: email,
                    contact: contact,
                    EntrepriseId: entrepriseId,
                    status: status
                }).then(newClient => {
                    return res.status(201).json({'success': 'Client add with success'});
                }).catch(err => {
                    return res.status(500).json(err);
                });
            }else{
                return res.status(200).json(clientFound);
            }
        }).catch(err => {
            return res.status(500).json({'error': 'cannot find client'});
        });
    },
    destroy: (req, res) => {
        let id = req.params.id;
        models.Client.findOne({
            where:{
                id: id
            }
        }).then(clientFound => {
            if(clientFound){
                clientFound.destroy();
                res.redirect('/client');
            }else{
                res.status(200).json({'error': 'Client not found'});
            }
        }).catch(err => {
            console.log(err);
        });
    }
};