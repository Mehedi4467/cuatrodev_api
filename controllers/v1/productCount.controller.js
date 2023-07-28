export const getProductCount = async (req, res) => {
  const collection = req.db.collection('product_list_1688');
  // const query = {
  //   $and: [{ response_type: '1688' }, { page: pages }],
  // };
  const query = {
    $and: [{ response_type: 'skb' }],
  };

  const result = await collection.find(query).toArray();
  res.send({ count: result.length });
};
