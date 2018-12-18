let Hapi = require('hapi')
let mongoose = require('mongoose')
let proj4 = require('proj4')

async function api () {
  try {

    let server = Hapi.Server({
      port: 8080,
      routes: {
        // validate: {
        //   failAction: async (request, h, err) => {
        //     RestHapi.logger.error(err);
        //     throw err;
        //   }
        // }
      }
    })

    server.route({
      method: 'GET',
      path: '/point/nad83moeastfipsft/wgs84/{x}/{y}',
      handler: function(request, h) {
        payload = {y: parseFloat(request.params.y), x: parseFloat(request.params.x)};
        proj4.defs('NAD83MOEASTFIPSFT', '+proj=tmerc +lat_0=35.83333333333334 +lon_0=-90.5 +k=0.9999333333333333 +x_0=250000 +y_0=0 +ellps=GRS80 +datum=NAD83 +to_meter=0.3048006096012192 +no_defs')
        proj4.defs('WGS84', "+title=WGS 84 (long/lat) +proj=longlat +ellps=WGS84 +datum=WGS84 +units=degrees");

        return proj4('NAD83MOEASTFIPSFT', 'WGS84', payload);
      }
    })

    server.route({
      method: 'POST',
      path: '/point/nad83moeastfipsft/wgs84',
      handler: function(request, h) {
        payload = JSON.parse(request.payload);

        proj4.defs('NAD83MOEASTFIPSFT', '+proj=tmerc +lat_0=35.83333333333334 +lon_0=-90.5 +k=0.9999333333333333 +x_0=250000 +y_0=0 +ellps=GRS80 +datum=NAD83 +to_meter=0.3048006096012192 +no_defs')
        proj4.defs('WGS84', "+title=WGS 84 (long/lat) +proj=longlat +ellps=WGS84 +datum=WGS84 +units=degrees");

        return proj4('NAD83MOEASTFIPSFT', 'WGS84', payload);
      }
    })

    // let config = {
    //   appTitle: 'rest-hapi-demo',
    //   enableTextSearch: true,
    //   logRoutes: true,
    //   docExpansion: 'list',
    //   swaggerHost: 'localhost:8080',
    //   mongo: {
    //     URI: 'mongodb://localhost:27017/rest_hapi',
    //   },
    // }

    await server.start()

    // RestHapi.logUtil.logActionComplete(RestHapi.logger, 'Server Initialized', server.info)

    return server
  } catch (err) {
    console.log('Error starting server:', err)
  }

}

module.exports = api()
