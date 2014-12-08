var noble = require('noble');
var _     = require('lodash');

UUIDs = {
  service: "569a1101-b87f-490c-92cb-11ba5ea5167c".replace(/\-/g, ''),
  tx:      "569a2001-b87f-490c-92cb-11ba5ea5167c".replace(/\-/g, ''),
  rx:      "569a2000-b87f-490c-92cb-11ba5ea5167c".replace(/\-/g, ''),
};

noble.on('discover', function(peripheral){
  console.log("device found");
  peripheral.connect(function(){
    console.log("connected");
    
    peripheral.discoverServices([], function(err, services){

      var service = _.find( services, function(service){
       return service.uuid === UUIDs.service;
      });

      service.discoverCharacteristics([], function(err, chars){
        var tx = _.find(chars, function(char){
          return char.uuid === UUIDs.tx;
        });
        var rx = _.find(chars, function(char){
          return char.uuid === UUIDs.rx;
        });

        rx.on('read', function(data){
          var str = data.toString('utf-8');
          if(data){
            console.log( "温度 : " + str);
          }
        });
        rx.notify(true, function(err){
          console.error(err);
        });

        setInterval(function(){
          var msg = _.sample( ['hoge', 'aba', 'fefe', 'yeha'] );
          var buf =  new Buffer(msg, 'utf-8');

          tx.write( buf );
        }, 2000);


        var signals = ['SIGINT', 'SIGHUP', 'SIGTERM'];
        for(var i=0; i < signals.length ; i++){
          var signal = signals[ i ];
          process.on(signal,function(){ 
            peripheral.disconnect( function(){
              console.log("fefe");
              process.exit(1);
            });
          });
        }
      }); 

    });

  });
});

noble.startScanning()
