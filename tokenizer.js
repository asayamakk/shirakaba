var DIC_URL = "bower_components/kuromoji/dist/dict/";

var tokenizer = null;


var vm = new Vue({
    el: "#demo",
    data: {
        inputText: "",
        tokens: [],
        isLoading: true,
        message: "Loading dictionaries ...",
        svgStyle: "hidden"
    },
    methods: {
        tokenize: function () {
            if (vm.inputText == "" || tokenizer == null) {
                vm.tokens = [];
                // lattice = null;
                return;
            }
            try {
                // lattice = tokenizer.getLattice(vm.inputText);
                vm.tokens = tokenizer.tokenize(vm.inputText);
            } catch (e) {
                console.log(e);
                // lattice = null;
                vm.tokens = [];
            }
        }
    }
});


// フォームの内容が変化したらtokenizeする
vm.$watch("inputText", function (value) {
    vm.svgStyle = "hidden";
    vm.tokenize();
});


// Load and prepare tokenizer
kuromoji.builder({ dicPath: DIC_URL }).build(function (error, _tokenizer) {
    if (error != null) {
        console.log(error);
    }
    tokenizer = _tokenizer;

    vm.message = "Ready";

    vm.inputText = "すもももももももものうち";
    vm.isLoading = false;
    document.getElementById('export_csv').className = "btn btn-default"
});

var button = document.getElementById('export_csv');
button.onclick = function() {
  var content = build_csv();
  var blob = new Blob([ content ], { type: "text/csv;charset=utf-16;" });
  this.href = window.URL.createObjectURL(blob);
  this.download = vm.tokens[0].surface_form + "_tokens.csv";
}


function build_csv() {
  var csv_string = "";

  var header = ['表層形','品詞','品詞細分類1','品詞細分類2','品詞細分類3','活用型','活用形','基本形','読み','発音']

  csv_string += header;
  csv_string += '\r\n';

  for(var i = 0; i < vm.tokens.length; i++) {
    var token = vm.tokens[i];
    csv_string += ([token.surface_form, token.pos, token.pos_detail_1, token.pos_detail_2, token.pos_detail_3, token.conjugated_type, token.conjugated_form, token.basic_form, token.reading, token.pronunciation])
    csv_string += '\r\n';
  }

  // BOM追加
  csv_string = "\ufffe" + csv_string;

  // if (isLittleEndian()) {

  //   //実行環境のエンディアンがLEならTypedArrayを利用
  //   var array = [];
  //   for (var i=0; i<csv_string.length; i++){
  //       array.push(csv_string.charCodeAt(i));
  //   }
  //   var csv_contents = new Uint16Array(array);

  // } else {

  //   //LEでない場合はDataViewでUTF-16LEのArrayBufferを作成
  //   var array_buffer = new ArrayBuffer(csv_string.length * 2);
  //   var data_view = new DataView(array_buffer);
  //   for (var i=0,j=0; i<csv_string.length; i++,j=i*2) {
  //       data_view.setUint16( j, csv_string.charCodeAt(i), true ); //第3引数にtrueを渡すとLEになる
  //   }
  //   var csv_contents = array_buffer
  // }

  return csv_string;
}

function isLittleEndian(){
    if ((new Uint8Array((new Uint16Array([0x00ff])).buffer))[0]) return true;
    return false;
}
