
// 温度センサをセットアップ
var ow = new OneWire(A1);
var sensor = require("DS18B20").connect(ow);

// A9をtx:送信 /A10をrx:受信 としてシリアル通信をセットアップ
Serial1.setup(9600,{ tx: A9, rx: A10  });

var writewrite = function(){
  console.log( sensor.getTemp() );
  Serial1.println( sensor.getTemp() );  
};

// １秒毎に実行
setInterval( writewrite, 1000);
