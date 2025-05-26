import { randomUUID } from "crypto"

const MAX_NAME_LEN=100
const MAX_ADD_LEN=200

export async function addSchoolHandler(req,res,connection) {
    const name=req.body?.name
    const address=req.body?.address
    const latitude=req.body?.latitude
    const longitude=req.body?.longitude

    if(typeof name !=='string'){
        return res.status(403).json(
            {
                "error":"school name is not string"
            }
        )      
    }
    if(name.length>MAX_NAME_LEN){
        return res.status(403).json(
            {
                "error":"school name is too long"
            }
        )
    }

    if(typeof address !=='string'){
        return res.status(403).json(
            {
                "error":"school address is not string"
            }
        )      
    }
    if(address.length>MAX_ADD_LEN){
        return res.status(403).json(
            {
                "error":"school address is too long"
            }
        )
    }

    if (typeof latitude !== 'number' || typeof longitude !== 'number') {
        return res.status(403).json({
            "error": "latitude and longitude must be numbers"
        });
    }

    if (latitude < -90 || latitude > 90) {
        return res.status(403).json({
            "error": "latitude must be between -90 and 90 degrees"
        });
    }

    if (longitude < -180 || longitude > 180) {
        return res.status(403).json({
            "error": "longitude must be between -180 and 180 degrees"
        });
    }

    try{
        const id=randomUUID()
        const query='INSERT INTO Schools(id,name,address,latitude,longitude) VALUES(?,?,?,?,?)'
        const values=[id,name,address,latitude,longitude]
        const [results,fields]=await connection.execute(query,values)
    }
    catch(err){
        if(err.code === 'ER_DUP_ENTRY'){
            res.status(403).send('duplicate values ');
        }
        res.status(500).send(`db error ${err.code}`)
    }
    res.status(200).send('ok')
    
} 