let express = require('express');
let appRouter = express.Router();
let ClientCtrl = require('../controller/ClientController');

exports.router = (() => {
    
    appRouter.route('/client/').get(ClientCtrl.index);
    appRouter.route('/client/create/').get(ClientCtrl.create);
    appRouter.route('/client/').post(ClientCtrl.store);
    appRouter.route('/client/:id/').put(ClientCtrl.update);
    appRouter.route('/client/:id/').get(ClientCtrl.create);
    appRouter.route('/client/:id/').delete(ClientCtrl.destroy);
    
    return appRouter;

})();

module.exports = appRouter;