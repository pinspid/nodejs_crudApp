'use strict';
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

        let error = 0

        if(name == null || firstname== null || email == null || contact == null){
            error = error + 1;
            req.flash('error', 'missing parameters');
            res.redirect('/client/create');
        }


        if(!EMAIL_REGEX.test(email)){
            error = error + 1;
            req.flash('error', 'the email fields must  be a valid address email');
            res.redirect('/client/create');
        }

        if(error === 0){
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
                        req.flash('success', 'client save with succes');
                        res.redirect('/client');
                    }).catch(err => {
                        return res.status(500).json(err);
                    });
                }else{
                    return req.flash('error', 'Client already exist');
                }
            }).catch(err => {
                return res.status(500).json({'error': 'cannot find client'});
            });
        }
    },
    edit: (req, res) => {
        let id = req.params.id;
        if(id !== null) {

            models.Client.findOne({
                where:{
                    id: id
                },
                include: [{
                    model: models.Entreprise,
                    attributes: ['id','name']
                }]
            }).then(clientFound => {
                if(clientFound){
                    models.Entreprise.findAll({}).then((entreprises) => {
                        res.render('clients/edit', {data_client: clientFound,entreprises: entreprises, put:true});
                    }).catch(err => {
                        res.json(err);
                    });
                }
            }).catch(err => {
                console.log(err);
            });
        }
    },
    create: (req, res) => {
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

        let error = 0;
        
        if(name == null || firstname== null || email == null || contact == null){
            error++;
            return res.status(400).json({'error': 'missing parameters'});
        }


        if(!EMAIL_REGEX.test(email)){
            error++;
            return res.status(400).json({'error': 'the email fields must  be a valid address email'});
        }
        if(error === 0){
            models.Client.findOne({
                where:{
                    id:req.params.id
                }
            }).then(clientFound => {
                if(!clientFound){
                    return res.json({'error': 'client not exist in DB'});
                }else{
                    clientFound.update({
                        name: name,
                        firstname: firstname,
                        email: email,
                        contact: contact,
                        EntrepriseId: entrepriseId,
                        status: status
                    }).then(newClient => {
                        req.flash('success', 'Client updated with success');
                        res.redirect('/client/');
                    }).catch(err => {
                        return res.json(err);
                    });
                }
            }).catch(err => {
                return res.json(err);
            });
        }
    },
    destroy: (req, res) => {
        let id = req.params.id;
        asyncLib.waterfall([
            done => {
                models.Client.findOne({
                    where: {
                        id: id
                    }
                }).then(client => {
                    done(null,client);
                }).catch(err => {
                    res.json(err);
                });
            },
            (client, done) => {
                if(client) {
                    client.destroy().then(deleteOk => {
                        done(deleteOk);
                    }).catch(err => {
                        res.json(err);
                    });
                }
            }
        ],deleteOk => {
            if(deleteOk){
                req.flash('success', 'client delete succesefuly');
                res.redirect('/client/');
            }else {
                req.flash('error', 'failed to delete client');
                res.redirect('/client');
            }
        });
    }
};