import {getDistance} from "geolib";

export async function listSchool(req,res,connection) {
    const userLongitude=req.query?.longitude;
    const userLatitude=req.query?.latitude;

    const lat = parseFloat(userLatitude);
    const lng = parseFloat(userLongitude);
    if(isNaN(lat) || isNaN(lng)){
        return res.status(403).json(
            {
                "error":"invalid data types of coordinates"
            }
        )
    }
    if (userLatitude < -90 || userLatitude > 90) {
        return res.status(403).json({
            "error": "latitude must be between -90 and 90 degrees"
        });
    }

    if (userLongitude < -180 || userLongitude > 180) {
        return res.status(403).json({
            "error": "longitude must be between -180 and 180 degrees"
        });
    }

    try{
        const query='SELECT * FROM Schools'
        const [rows,fields]=await connection.execute(query,null)
        rows.sort(function(schoolA,schoolB){
            let distA=getDistance(
                {latitude:userLatitude,longitude:userLongitude},
                {latitude:schoolA.latitude,longitude:schoolA.longitude}
            )
            let distB=getDistance(
                {latitude:userLatitude,longitude:userLongitude},
                {latitude:schoolB.latitude,longitude:schoolB.longitude}
            )
            return distA-distB
        })
        res.status(200).json(rows)
    }
    catch(err){
        console.log(err)
        res.status(500)
    }    
}