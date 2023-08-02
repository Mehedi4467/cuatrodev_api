import { ObjectId } from 'mongodb';
// import { skybuyScrap } from '../../../ExranalApi/skyBuyScrap.js';
// API endpoint to get product data
export const getProductV3 = async (req, res) => {
  const search = req?.query?.search?.toLowerCase();
  const pages = req?.query?.page || 1;
  const phone = req.headers['phone'];
  if (search) {
    const collection = req.db.collection('product_list_1688');
    try {
      const query = {
        $and: [{ $text: { $search: `\"${search}\"` } }, { page: pages }],
      };
      const result = await collection.findOne(query);
      if (result) {
        res.status(200).send(result);
        const objectId = new ObjectId(result?._id);
        const filter = { _id: objectId };
        const update = { $inc: { count: 1 } };
        await collection.updateOne(filter, update);
      } else {
        const Secondquery = {
          $and: [{ $text: { $search: search } }, { page: pages }],
        };
        const result = await collection.findOne(Secondquery);
        res.status(200).send(result);
        const objectId = new ObjectId(result?._id);
        const filter = { _id: objectId };
        const update = { $inc: { count: 1 } };
        await collection.updateOne(filter, update);
        const updatecollection = req.db.collection('update_data_1688');

        const getquery = {
          $and: [{ search: search }, { page: pages }],
        };
        const getresult = await updatecollection.findOne(getquery);
        if (!getresult) {
          const skb = {
            search: search?.trim(),
            page: pages,
          };
          const waitingUpdate = await updatecollection.insertOne(skb);
        }
        // const skb = await skybuyScrap(pages, search);
        // res.status(200).send(skb);
      }
    } catch (err) {
      console.log(err);
      res.status(500).send({
        status: false,
        msg: 'Internal APi Fetch Faild',
      });
      const filter = { phone: phone };
      const update = { $inc: { apiFailCount: 1 } };
      await collection.updateOne(filter, update);
    }
  } else {
    res.status(404).send({
      status: false,
      msg: 'Enter something for search',
    });
    const filter = { phone: phone };
    const update = { $inc: { apiFailCount: 1 } };
    await collection.updateOne(filter, update);
  }
};
