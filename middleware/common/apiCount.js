export const totalApiCaount = async(req,res,next) => {
    const apiKey = req?.params?.api_key;
    const phone = req.headers['phone'];
     
    try {
        const collection = req.db.collection('user_list');
        const filter = {
            $and: [{ phone: phone }, { api_key: apiKey },{status:true}],
        };
        const update = { $inc: { totalApiCount: 1 } };
        const result = await collection.updateOne(filter, update);
     
        if (result?.modifiedCount > 0 && result?.matchedCount > 0) {
            next();
        } else {
            res.status(404).send({
                status: false,
                search: '',
                timestamp:'',
                page:'',
                data: [],
                lastPage:'',
                response_type: '',
                msg:'Something Want Wring Please contact ITC'
                
            });
        }
    } catch (err) {
        res.status(500).send({
            status: false,
            search: '',
            timestamp:'',
            page:'',
            data: [],
            lastPage:'',
            response_type: '',
            msg:'Something Want Wring Please contact ITC'
            
        });
    }
}