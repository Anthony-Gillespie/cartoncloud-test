const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const PurchaseOrderService = require('./PurchaseOrderService.js');
const poService = new PurchaseOrderService();
const server = express();

// Constant predefined username and password
const username = "demo";
const password = "pwd1234";

// Middleware to precheck auth on all incoming requests
server.use((req, res, next) => {
  if (req && req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Basic') {
    const [user, pass] = Buffer.from(req.headers.authorization.split(' ')[1], 'base64').toString().split(':');
    if (user === username && pass === password) return next();
    else res.sendStatus(401);
  } else res.sendStatus(403);
})

// Add body parser to handle json
server.use(bodyParser.json());

// The actual testing endpoint
server.post('/test', async (req, res) => {
  if (req && req.body && req.body.purchase_order_ids) {
    const result = { result: [] };
    try {
      result.result = await poService.calculateTotals(req.body.purchase_order_ids);
      res.send(result)
    } catch (e) {
      res.sendStatus(503)
    }

  }
})

// Boot the server up on port 3333
server.listen(3333, () => console.log("Server listening on localhost port 3333."))
