
/**
 * All Modules
 */
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var router = express.Router();
/**
 * Configurations
 */
var port = process.env.PORT || 8080;

/**
 * App - Module Usage apply
 */
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/api', router);
app.use('/', function(req, res) {
    res.json({
    	message: 'Default response for root - send /api/listall - to see all the api url-s' 
    });   
});

/**
 * Routers
 */
router.get('/listall', function(req, res) {
    res.json({
    	apis: [{
    		url: '/api/one/one',
    		description: 'One Summa'
    	}, {
    		url: '/api/two/two',
    		description: 'two Summa'
    	}, {
    		url: '/api/three/three',
    		description: 'Three Summa'
    	}]
    });   
});



//app.use(express.static(__dirname + "/public"));


/**
 * Start Server
 */
app.listen(port);
console.log('Server Started and Listening in port 3000');