const Sequelize = require('sequelize');
const model = require('../models/index')
const sequelize = model.sequelize
const axios =  require('axios')
const moment = require('moment-timezone')



class TransitController{

//   tester = async(req,res)=>{
//     //API KEY 

  getGeocode = async (address, storeConfig) => {
    const GEO_API_KEY = `{PLACE_GEO_API_KEY}`
  try {


    console.log("CAME INTO ;GOOGLE CONCATED ADDRESS", address);
    let url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      address
    )}&components=country:${storeConfig.countryName}&key=${GEO_API_KEY}`;

    

    const response = await axios.get(url, {
      headers: {},
    });

    console.log("RESPONSE", response.data);
    const { data } = response;

    if (response.status === 200 && data.status === "OK") {
      const addressData = data.results[0];

      let geo = {};
      geo["latitude"] = addressData.geometry.location.lat;
      geo["longitude"] = addressData.geometry.location.lng;
      geo["city"] = "";
      geo["state"] = "";

      for (const x of addressData.address_components) {
        if ("locality" == x.types[0] || "political" == x.types[0]) {
          geo["city"] = x.long_name;
        }
        if ("administrative_area_level_1" == x.types[0]) {
          geo["state"] = x.long_name;
        }
      }
      geo["geo_address_info"] = addressData;

      return geo;
    } else {
      return false;
    }
  } catch (error) {
    console.log("ERROR in getGeocode", error);
    return error;
  }
};

concatenateNonEmptyValues = (obj) => {
  const addressString = Object.entries(obj)
    .map(([key, value]) => typeof value === 'string' ? value.trim() : "")
    .filter((value) => value !== "")
    .join(", ");
  
  return addressString;
};



getLocation = async (addressData, storeConfig) => {
  try {
    console.log("addressData", addressData);
    //need improvisation-----------
      //ADDRESS DESINGED

      let geoAddress = this.concatenateNonEmptyValues(addressData);

      console.log('CONCATED ADDRESS', geoAddress);

      const response = await this.getGeocode(geoAddress, storeConfig);
      console.log("response", response);

      let fullAddressData = { ...addressData };

      if (response) {
        let geoData = {};
        geoData["latitude"] = response.latitude;
        geoData["longitude"] = response.longitude;
        geoData["state"] = response.state;
        geoData["city"] = response.city;

        fullAddressData = { ...fullAddressData, ...geoData };

        geoData["postcode"] = addressData.postCode || addressData.postalCode;
        geoData["address_line1"] = addressData.address_line1
          ? addressData.address_line1
          : "";

      }
      return fullAddressData;

  } catch (error) {
    console.log("ERROR in getLocation", error);
    return error;
  }
};


 calculateDistance =(origin, destination)=>{
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = this.deg2rad(destination.lat - origin.lat);
  const dLon = this.deg2rad(destination.long - origin.long);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(this.deg2rad(origin.lat)) * Math.cos(this.deg2rad(destination.lat)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in kilometers

  return distance;
}

 deg2rad =(deg)=> {
  return deg * (Math.PI / 180);
}

 getLatLong = async (address, storeConfig) => {
  let street = {};
  const geoAddress = await this.getLocation(address, storeConfig);

  if (geoAddress && geoAddress["latitude"] && geoAddress["longitude"]) {
    street["lat"] = geoAddress.latitude;
    street["long"] = geoAddress.longitude;
    street["state"] = geoAddress.state;
    street["city"] = geoAddress.city;
  }
  return street;
};

  calculateAndPrintDistance=(originAddress,destinationAddress)=>{
  try {
    // const origin = await getCoordinates(originAddress);
    // const destination = await getCoordinates(destinationAddress);

    const distance = this.calculateDistance(originAddress, destinationAddress);
    console.log(`Distance: ${distance.toFixed(2)}`);
    return Number(distance.toFixed(2))
  } catch (error) {
    console.error('Error:', error.message);
    return 0
  }
}

 getQuote = async (
  pickupAddress,
  shippingAddress,
  storeConfig,
  returnJson = true,
  order_value = 0,
  isHybridRequest = false
) => {
  // console.log("IN getQuote", {
  //   shippingAddress,
  //   storeConfig,
  //   deliveryData,
  //   countryData,
  //   regionData,
  //   deliveryPartner,
  //   returnJson,
  //   order_info_id,
  //   type,
  //   order_value,
  //   isHybridRequest,
  // });
  try {
    // const axios = require("axios");
    const headers = {
      "Accept": "application/json",
      "Content-Type": "application/json",
    };

    let requestLoad = {};
    let responsePayload = {};
    requestLoad["totalValue"] = order_value ? order_value : 1;
    requestLoad["source"] = [];
    requestLoad["destination"] = [];
    requestLoad["totalValue"] = order_value ? order_value : 1;


    const geoDataPickup = await this.getLatLong(pickupAddress, storeConfig);

    //ShippingAddress is OBJECT
    const geoDataDrop = await this.getLatLong(shippingAddress, storeConfig);


    responsePayload["pickup_lat_long"] = {
      'lat': geoDataPickup.lat || 0,
      'long': geoDataPickup.long || 0
    }

    responsePayload["drop_lat_long"] = {
      'lat': geoDataDrop.lat || 0,
      'long': geoDataDrop.long || 0
    }
  

    console.log("geoDataPickup in getQuote", geoDataPickup);


    console.log("geoDataDrop in getQuote", geoDataDrop);

  //   if (Boolean(environmentVariables["DELIVERY_PARTNER_DEBUG"]) && !storeConfig.phone) {
  //     console.error({
  //       "Nash phone null Issue in Nash service": storeConfig,
  //       "Destination address": shippingAddress,
  //     });
  //   }

    // requestLoad["strategyId"] = storeConfig.id;
    requestLoad["source"] = this.getPickUpPayload(
      pickupAddress,
      geoDataPickup,
      storeConfig
    );

  
    requestLoad["destination"] = this.getDropOffPayload(
      shippingAddress,
      geoDataDrop,
      storeConfig
    );
    // if (!isHybridRequest) {
    //   responsePayload = formResponsePayload(
    //     deliveryData,
    //     shippingAddress,
    //     storeConfig,
    //     geoData
    //   );
    // }



    // let getDistance = 

    let dropoffTime = moment.tz(storeConfig.timeZone).add('45', "minutes").toISOString();
    // let dropoffTime = "2024-04-26T17:40:08.215Z"


    let pickupTime = moment(dropoffTime).subtract(15, "minutes").toISOString();

    // let pickupTime = "2024-04-26T17:02:08.215Z"



    requestLoad["dropoffTime"] = dropoffTime;
    requestLoad["pickupTime"] = pickupTime;

    if (
      // Cache::tags("falcon_delivery")->has($cacheKey)
      false
    ) {
      let falconDeliveryCache = {};
      // $falconDeliveryCache                        = json_decode(Cache::tags('falcon_delivery')->get($cacheKey), true);
      responsePayload["quote_id"] = falconDeliveryCache["quote_id"];
      responsePayload["charge"] = falconDeliveryCache["delivery_charge"];
      if (!isHybridRequest) {
        responsePayload["minimum_order"] =
          falconDeliveryCache["minimum_order"] &&
          falconDeliveryCache["minimum_order"] >
            responsePayload["minimum_order"]
            ? falconDeliveryCache["minimum_order"]
            : responsePayload["minimum_order"];
      }
    } else {
      // Get the reseller id
      // if (Boolean(environmentVariables["RESELLER_FOR_DELIVERY"]) || false) {
      //   requestLoad["resellerId"] = await getResellerId(storeConfig);
      // }

      // Hits the falcon endpoint and returns the response
      let quoteDetails  = {};
      let response  = {};
      console.log('requestLoad',requestLoad)
      try {
        // console.log("IN TRY ", environmentVariables["FALCON_API_URL"]);
        response = await axios.post(
          `${
            "https://falcon-sit-direct.stage.t2sonline.com"
          }/delivery-service/quotes`,
          requestLoad,
          { headers }
        );
        // console.log("POST REQUEST");
        quoteDetails = response.data;
        console.log("falcon response quoteDetails", quoteDetails);
      } catch (error) {
        console.log("error", error);
        if (returnJson) {
          throw {
            status: 400,
            message: "Something went wrong! Please try again!",
          };
        } else {
          return {
            error: true,
          };
        }
      }

    //   console.log("response", response);

      if (response.status != 200) {
        throw {
          status: 400,
          message:
            "validation; Sorry, service is unavailable. Please try again later.",
        };
      }

      // Returning error message if quotes are empty
      if (quoteDetails.quotes.length == 0) {
        if (returnJson) {
          throw {
            status: 400,
            message: "validation:Delivery is not available for this address",
          };
        } else {
          return {
            error: true,
          };
        }
      }

      let deliveryCharge = 0;
      let quoteId = "";
      let serviceCharge = 0.0;

      // Showing the sum of customer + store price for hybrid request and for normal request, showing the customer price
      deliveryCharge = 
        (quoteDetails.quotes[0].price / 100 + serviceCharge).toFixed(2)
        // : (quoteDetails.quotes[0].customerPrice / 100 + serviceCharge).toFixed(
        //     2
        //   );
      console.log("deliveryCharge", deliveryCharge);
      quoteId = quoteDetails.quotes[0].quoteId;
      responsePayload["charge"] = deliveryCharge;
      responsePayload["quote_id"] = quoteId;


      console.log("responsePayload", responsePayload);

      // let [deliverySplitConfig] = await getQueryResults(delivery_split_config, [
      //   storeConfig.id,
      // ]);

      // console.log("deliverySplitConfig", deliverySplitConfig);

      // let qoute = quoteDetails.quotes[0];
      // if (
      //   storeConfig.deliveryCharge &&
      //   storeConfig.deliveryCharge == DeliveryConfig.DELIVERY_BY_ZONE &&
      //   !isHybridRequest &&
      //   qoute.storePrice &&
      //   qoute.storePrice / 100 > responsePayload["minimum_order"]
      // ) {
      //   responsePayload["minimum_order"] = qoute.storePrice / 100;
      // }

      // if (
      //   (Boolean(environmentVariables["DELIVERY_SPLIT_PARTNER"]) || false) &&
      //   deliverySplitConfig &&
      //   qoute?.merchantId &&
      //   order_info_id != 0 &&
      //   !isHybridRequest
      // ) {
      //   await storeDeliveryPaymentDetails(order_info_id, quoteDetails);
      // }

      // Storing quote details for offline order scenarios
      // if (
      //   (Boolean(environmentVariables["OFFLINE_DELIVERY_INTEGRATION"]) || false) &&
      //   returnJson &&
      //   shippingAddress["phone"] &&
      //   shippingAddress["phone"] &&
      //   !isHybridRequest
      // ) {
      //   await storeDeliveryQuoteDetails(quoteDetails, deliveryPartner);
      // }

      // If it is a hybrid request, storing the payment details into a new table
      // if (isHybridRequest) {
      //   var delPartner = deliveryPartner;

      //   delPartner["charge"] = deliveryCharge;
      //   delPartner["merchant_id"] =
      //     qoute.merchantId && qoute.merchantId ? qoute.merchantId : 0;
      //   delPartner["customer_price"] = qoute.customerPrice / 100;
      //   delPartner["store_price"] = qoute.storePrice / 100;
      //   await storeFoodhubDeliveryPaymentDetails(order, quoteId, delPartner, 1);
      // }


      return responsePayload;
    }
  } catch (error) {
    console.log("ERROR in getQuote", error);
    throw error;
  }
};

 getPickUpPayload = (address,geoData,config) => {
  return {
    phone: address["phone"] ?? "+12027514447",
    house_number: address["house_number"] ?? "",
    address1: address["address_line1"] ?? "",
    address2: address["address_line2"] ?? "",
    city: geoData.city ?? "",
    state:  geoData.state ?? "",
    postcode: address["postcode"],
    country: config.iso,
    latitude: geoData.lat ?? "",
    longitude: geoData.long ?? "",
    businessDomain: config.host,
    // businessName: config.name,
    // businessId: config.id,
  };
};

 getDropOffPayload = (address, geoData, config) => {
  let requestDestination = {};
  requestDestination["house_number"] = address["house_number"] ?? "";
  requestDestination["address1"] = address["address_line1"] ?? "";
  requestDestination["address2"] = address["address_line2"] ?? "";
  requestDestination["flat"] = address["flat"] ?? "";
  requestDestination["city"] = address.city ?? "";
  requestDestination["state"] = address.state ?? "";
  requestDestination["postcode"] = address["postcode"];
  requestDestination["country"] = config["iso"];
  if (!address["latitude"] && !address["longitude"]) {
    requestDestination["latitude"] = geoData.lat ?? "";
    requestDestination["longitude"] = geoData.long ?? "";
  } else {
    requestDestination["latitude"] = address["latitude"];
    requestDestination["longitude"] = address["longitude"];
  }
  requestDestination["firstName"] = address["firstname"] ?? "Food";
  requestDestination["lastName"] = address["lastname"] ?? "Hub";
  requestDestination["phone"] = address["phone"] ?? "+12027514447";
  // if (Boolean(environmentVariables["NASH_GOOGLE_ADDRESS_RESPECT"]) || false) {
  //   requestDestination["formattedAddress"] = address["formatted_address"] ?? "";
  // }
  return requestDestination;
}

  createTransit = async(req,res)=>{
    try{
        console.log("FEEDBACK CONTROLLER HIT")



        let data = {
            pickup_location:req.body.pickup_location,
            drop_location:req.body.drop_location,
          }

          let storeConfig = {
            'host':'transitDomain',
            'iso':'GB',
            'countryName':'United Kingdom',
          }

          const qouteDataAndlatlong = await this.getQuote(data.pickup_location,data.drop_location,storeConfig,true)

          const distance =  this.calculateAndPrintDistance(qouteDataAndlatlong.pickup_lat_long,qouteDataAndlatlong.drop_lat_long)

          const serviceCharge = 0.00

          let queryData = {
            'user_id': 1,
            'pickup_location':this.concatenateNonEmptyValues(req.body.pickup_location),
            'drop_location':this.concatenateNonEmptyValues(req.body.drop_location),
            'pick_lat_long':JSON.stringify(qouteDataAndlatlong.pickup_lat_long),
            'drop_lat_long':JSON.stringify(qouteDataAndlatlong.drop_lat_long),
            'distance':distance,
            'status':'PENDING',
            'total':(qouteDataAndlatlong.charge + serviceCharge) || 0.00,
            'qoute_id':qouteDataAndlatlong.quote_id
          }

          const total = qouteDataAndlatlong.charge + serviceCharge

          console.log('queryData',queryData)

          const [transitEntry] = await sequelize.query(`INSERT INTO transit (user_id,pickup_location,drop_location,pick_lat_long,drop_lat_long,distance,status,total,qoute_id) VALUES(:user_id,:pickup_location,:drop_location,:pick_lat_long,:drop_lat_long,:distance,:status,:total,:qoute_id)`,{
            type: Sequelize.QueryTypes.INSERT,
            replacements:queryData,
            raw:true
          })
      console.log("RESULT feedback",transitEntry)
      return res.json({
        outcome:'success',
        data:{id:transitEntry,latlong:{'pickup_lat_long':qouteDataAndlatlong.pickup_lat_long,'drop_lat_long':qouteDataAndlatlong.drop_lat_long},'distance':`${distance} Kms`,'charge':qouteDataAndlatlong.charge,'qoute_id':qouteDataAndlatlong.quote_id,'total':total}
      });
    } catch (error) {
      console.log("Error in feedback", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  getTransit = async(req,res)=>{
      try {
        console.log("FEEDBACK CONTROLLER HIT")
        let data = {
            id: req.params.id,
          }

          const transitRecord = await sequelize.query(`SELECT * FROM transit WHERE id =:id`,{
            type: Sequelize.QueryTypes.SELECT,
            replacements:data,
            raw:true
          })
      console.log("RESULT feedback",feedbackEntry)
      return res.json({
        outcome:'success',
        data:transitRecord
      });
        
      } catch (error) {
        console.log('ERROR in getTransit',error)
      }
  }

  purchaseQoute = async(req,res)=>{
    try {
      console.log("FEEDBACK CONTROLLER HIT")
      let data = {
          id: req.body.id,
        }

        const [transitRecord] = await sequelize.query(`SELECT * FROM transit WHERE id = :id`,{
          type: Sequelize.QueryTypes.SELECT,
          replacements:data,
          raw:true
        })

        const qoute = transitRecord.qoute_id




    console.log("RESULT feedback",feedbackEntry)
    return res.json({
      outcome:'success',
      data:transitRecord
    });
      
    } catch (error) {
      console.log('ERROR in getTransit',error)
    }
  }

  
}

module.exports = TransitController
