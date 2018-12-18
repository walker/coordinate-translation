let Hapi = require('hapi')
let mongoose = require('mongoose')
let proj4 = require('proj4')
let _ = require('lodash')

async function api () {
  try {

    let server = Hapi.Server({
      port: process.env.PORT || 8080
    });

    await server.register({
      plugin: require('hapi-require-https'),
      options: {}
    });

    server.route({
      method: 'GET',
      path: '/point/{from}/{to}/{x}/{y}',
      handler: function(request, h) {
        var payload = {y: parseFloat(request.params.y), x: parseFloat(request.params.x)};
        proj4.defs('nad83moeastfipsft', '+proj=tmerc +lat_0=35.83333333333334 +lon_0=-90.5 +k=0.9999333333333333 +x_0=250000 +y_0=0 +ellps=GRS80 +datum=NAD83 +to_meter=0.3048006096012192 +no_defs');
        proj4.defs('wgs84', "+title=WGS 84 (long/lat) +proj=longlat +ellps=WGS84 +datum=WGS84 +units=degrees");
        var to = 'wgs84';
        var from = 'nad83moeastfipsft';

        switch(request.params.from) {
          case 'nad83moeastfipsft':
            break;
          case 'wgs84':
            from = 'wgs84';
            break;
        }
        switch(request.params.to) {
          case 'nad83moeastfipsft':
            to = 'nad83moeastfipsft';
            break;
          case 'wgs84':
            break;
        }

        return proj4(from, to, payload);
      }
    });

    server.route({
      method: 'POST',
      path: '/point',
      handler: function(request, h) {
        var payload = JSON.parse(request.payload);
        var xy = {x: request.payload.x, y: request.payload.y};
        proj4.defs('nad83moeastfipsft', '+proj=tmerc +lat_0=35.83333333333334 +lon_0=-90.5 +k=0.9999333333333333 +x_0=250000 +y_0=0 +ellps=GRS80 +datum=NAD83 +to_meter=0.3048006096012192 +no_defs');
        proj4.defs('wgs84', "+title=WGS 84 (long/lat) +proj=longlat +ellps=WGS84 +datum=WGS84 +units=degrees");
        var to = 'wgs84';
        var from = 'NAD83MOEASTFIPSFT';

        switch(request.payload.from) {
          case 'nad83moeastfipsft':
            break;
          case 'wgs84':
            from = 'wgs84';
            break;
        }
        switch(request.payload.to) {
          case 'nad83moeastfipsft':
            to = 'nad83moeastfipsft';
            break;
          case 'wgs84':
            break;
        }

        return proj4(from, to, payload);
      }
    });

    server.route({
      method: 'POST',
      path: '/point-batch',
      handler: function(request, h) {
        var payload = JSON.parse(request.payload);
        var translated_collection = [];
        var xy_collection = request.payload.collection;
        var to = 'wgs84';
        var from = 'nad83moeastfipsft';
        var count = 0;

        proj4.defs('nad83moeastfipsft', '+proj=tmerc +lat_0=35.83333333333334 +lon_0=-90.5 +k=0.9999333333333333 +x_0=250000 +y_0=0 +ellps=GRS80 +datum=NAD83 +to_meter=0.3048006096012192 +no_defs');
        proj4.defs('wgs84', "+title=WGS 84 (long/lat) +proj=longlat +ellps=WGS84 +datum=WGS84 +units=degrees");


        switch(request.payload.from) {
          case 'nad83moeastfipsft':
            break;
          case 'wgs84':
            from = 'wgs84';
            break;
        }
        switch(request.payload.to) {
          case 'nad83moeastfipsft':
            to = 'nad83moeastfipsft';
            break;
          case 'wgs84':
            break;
        }

        if(_.isArray(payload.collection) && _.isObject(payload.collection)) {
          _.each(payload.collection, function(v) {
            translated_collection[count] = proj4(from, to, v);
            count++;
          });
        } else if(_.isObject(payload.collection)) {
          translated_collection = {};
          _.each(payload.collection, function(v, k) {
            translated_collection[k] = proj4(from, to, v);
          });
        }


        payload.collection = translated_collection;
        return payload;
      }
    });

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

    await server.start();

    // RestHapi.logUtil.logActionComplete(RestHapi.logger, 'Server Initialized', server.info)

    return server;
  } catch (err) {
    console.log('Error starting server:', err);
  }

}

module.exports = api();
