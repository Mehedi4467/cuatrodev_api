import { createApiKey } from '../../helperFunction/generateApiKey.js';

export const postUserData = async (req, res) => {
  const phone = req?.body?.phone;
  const userInfo = req?.body;
  const apiKey = createApiKey();
  const currentTime = new Date();
  try {
    const collection = req.db.collection('user_list');

    const query = {
      $or: [{ phone: phone }, { api_key: apiKey }],
    };
    const result = await collection.findOne(query);
    if (result) {
      if (result?.user?.phone !== phone && result?.api_key === apiKey) {
        const newapiKey = createApiKey();
        const userData = {
          status: false,
          createAccount: currentTime.toLocaleDateString('en-US'),
          user: userInfo,
          phone: phone,
          totalApiCount: 0,
          apiFailCount: 0,
          api_key: newapiKey,
        };
        await collection.insertOne(userData);
        res.status(201).send({
          msg: 'The request succeeded, and a new user was created',
        });
      } else {
        res.status(202).send({
          msg: 'The user already exists',
        });
      }
    } else {
      const userData = {
        status: false,
        createAccount: currentTime.toLocaleDateString('en-US'),
        user: userInfo,
        totalApiCount: 0,
        apiFailCount: 0,
        phone: phone,
        api_key: apiKey,
      };
      await collection.insertOne(userData);
      res.status(201).send({
        msg: 'The request succeeded, and a new user was created',
      });
    }
  } catch (err) {
    res.status(500).send({
      msg: 'Something want wrong.Please contact itCommerce',
    });
  }
};
