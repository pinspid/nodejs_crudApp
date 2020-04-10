let asyncLib = require('async');
let models = require('../models');

module.exports = {
    index: (req, res) => {
        models.Entreprise.findAll().then(entreprises => {
            if(entreprises){
                res.render('entreprise/index', {entreprises: entreprises});
            }
        });
    },
    create: (req, res) => {
        res.render('entreprise/create');
    },
    store: (req, res) => {
        let name = req.body.name;

        let error = 0;

        console.log(error);

        if(name == null) {
            error = error + 1;
            req.flash('error', 'Entreprise name cannot have null value');
            res.redirect('/entreprise/create');
        }
        if(name.length <= 3){
            error = error + 1;
            req.flash('error', 'Entreprise name must be lentgh 3');
            res.redirect('/entreprise/create');
        }
        if(error === 0){
            asyncLib.waterfall([
                done => {
                    models.Entreprise.findOne({
                        where: {
                            name: req.body.name
                        }
                    }).then(entreprise => {
                        done(null,entreprise);
                    }).catch(err => {
                        res.json(err);
                    });
                },
                (entreprise, done) => {
                    if(!entreprise){
                        models.Entreprise.create({
                            name: req.body.name
                        }).then(newEntreprise => {
                            done(newEntreprise);
                        })
                        .catch(err => {
                            res.json(err);
                        });
                    }
                }
            ], newEntreprise => {
                if(newEntreprise){
                    req.flash('success', 'Entreprise save with success');
                    res.redirect('/entreprise');
                }else{
                    req.flash('error', 'saved failed');
                }
            });
        }
    },
    destroy: (req, res) => {
        id = req.params.id;
        asyncLib.waterfall([
            done => {
                models.Entreprise.findOne({
                    where: {
                        id: id
                    }
                }).then(entreprise => {
                    done(null, entreprise);
                }).catch(err => {
                     res.json(err);
                });
            },
            (entreprise, done) => {
                if (entreprise) {
                    entreprise.destroy().then(deleteOk => {
                        done(deleteOk);
                    }).catch(err => {
                        res.json(err);
                    });
                }else {
                    req.flash('error', 'not entreprise found in DB');
                }
            }
        ], deleteOk => {
            if(deleteOk){
                req.flash('success', 'Entreprise deleted with succes');
                res.redirect('/entreprise');
            }else{
                req.flash('error', 'deleted Failed');
                res.redirect('/entreprise');
            }
        });
    }
};