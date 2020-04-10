let express = require('express');
let appRouter = express.Router();
let ClientCtrl = require('../controller/ClientController');
let EntrepriseCtrl = require('../controller/EntrepriseController');

exports.router = (() => {
    
    //Client Routes
    appRouter.route('/client/').get(ClientCtrl.index);
    appRouter.route('/client/create/').get(ClientCtrl.create);
    appRouter.route('/client/').post(ClientCtrl.store);
    appRouter.route('/client/:id/').put(ClientCtrl.update);
    appRouter.route('/client/:id/edit').get(ClientCtrl.edit);
    appRouter.route('/client/:id/').delete(ClientCtrl.destroy);
    
    //Entreprise Route;

    appRouter.route('/entreprise/').get(EntrepriseCtrl.index);
    appRouter.route('/entreprise/create').get(EntrepriseCtrl.create);
    appRouter.route('/entreprise/').post(EntrepriseCtrl.store);
    appRouter.route('/entreprise/:id/').delete(EntrepriseCtrl.destroy);

    return appRouter;

})();

module.exports = appRouter;