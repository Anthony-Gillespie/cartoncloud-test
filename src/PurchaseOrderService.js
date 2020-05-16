const axios = require('axios');

const byWeight = p => {
  const quan = parseFloat(p.unit_quantity_initial);
  const weight = parseFloat(p.Product.weight);
  return quan * weight;
}

const byVolume = p => {
  const quan = parseFloat(p.unit_quantity_initial);
  const volume = parseFloat(p.Product.volume);
  return quan * volume;
}

const methodMap = [0, 1, 2, 1]




class PurchaseOrderService {
  async calculateTotals(ids) {
    try {
      const res = await Promise.all(ids.map(id => {
        return axios.get(`https://api.cartoncloud.com.au/CartonCloud_Demo/PurchaseOrders/${id}?version=5&associated=true`, {
          auth: {
            username: 'interview-test@cartoncloud.com.au',
            password: 'test123456'
          }
        })
      }))
      let products = [];
      res.forEach(e => products = [...products, ...e.data.data.PurchaseOrderProduct]);
      let result = [];
      products.forEach(e => {
        const pid = parseInt(e.product_type_id);
        if (!result[pid - 1]) result[pid - 1] = { product_type_id: pid, total: 0 };
        switch (methodMap[pid]) {
          case 1:
            result[pid - 1].total += byWeight(e);
            break;

          case 2:
            result[pid - 1].total += byVolume(e);
          default:
            break;
        }
      })
      return result;
    } catch (e) {
      throw e;
    }
  }
}


module.exports = PurchaseOrderService;
