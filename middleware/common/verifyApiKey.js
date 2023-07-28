import { ObjectId } from "mongodb";

export const verifyApiKeyUser = async (req, res, next) => {
  const api = req?.params?.api_key;
  const phone = req.headers['phone'];
  const collection = req.db.collection('user_list');
  const result = await collection.findOne({ phone: phone });
  if (result && result?.status && result?.api_key) {
    if (result?.api_key === api) {
      next(); 
    const objectId = new ObjectId(result?._id);
    const filter = { _id: objectId };
    const update = { $inc: { totalApiCount: 1 } };
    await collection.updateOne(filter, update);
    } else {
      res.status(404).send({
        status: false,
        msg: 'Your API key do not match',
      });
    } 
  } else if (result && result?.status === false) {
    res.status(404).send({
      status: false,
      msg: 'Your not a active user',
    });
  } else {
    res.status(404).send({
      status: false,
      msg: 'Your API key does not exist',
    });
  }
};
