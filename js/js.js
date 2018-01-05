// js

if(!window.File && !window.FileReader)
    window.alert('このWebブラウザでは使えません。');

var last = new Date(document.lastModified);
var Y = last.getFullYear();
var M = ('00' + last.getMonth()+1).slice(-2);
var D = ('00' + last.getDate()).slice(-2);

$(function(){
  // 読み込み完了時
  });

function fileR(e){
    var pc = 0;
    var file = e.target.files;
    var name = file[0].name;
    var reader = new FileReader();
    reader.readAsText(file[0]);
    
    $('#result, #result2').html('');
    
    if(name.match(/.*txt/)){
        // 読み込み中
        reader.onloadstart = function(){
            $('#disp').text('読み込み中。');
            $('table').html('');
        }
        
        // 読み込み失敗
        reader.onerror = function(){
            $('#disp').text('読み込み失敗。');
        }
        
        // 読み込み成功
        reader.onload = function(){
            var str = '';
            var len;
            var temp = nameList = [];
            var text = reader.result;
            nameList = text.match(/\t(.+?)\t/g);
            
            // PCだった場合
            if(nameList == null){
                nameList = text.match(/\d{2}[ ](.+?)[ ]/g);
                pc = 1;
                str = 'PC版LINE(読み込みがうまくいかないことがあります)<br>';
            }else{
                var tolkName = text.match(/[ ].+?のトーク履歴/);
                tolkName = tolkName[0].replace(/[ ](.+?)(と|)のトーク履歴/, '$1');
                str += 'トーク名：' + tolkName;
            }
            
            try{
                // 全体数
                len = nameList.length;
                
                for(var i=0;i<len;i++){
                    if(!pc)
                        nameList[i] = nameList[i].replace(/\t(.+?)\t/g, '$1');
                    else
                        nameList[i] = nameList[i].replace(/\d{2}[ ](.+?)[ ]/g, '$1');
                }
                
                // 発言した人の名前をリスト化
                for(var i=0;i<len;i++)
                    pushAry(temp, nameList[i]);
                
                str += '<br>発言総数：' + len + '回<br>発言人数：' + temp.length + '人';
                str += '<br>保存日：' + text.match(/\d{4}\/\d{2}\/\d{2}/);
                $('#disp').html(str);
                
                // カウント
                var counT = new Array(temp.length);
                for(var i=0;i<counT.length;i++) counT[i] = 0;
                
                for(var i=0;i<len;i++){
                    for(var j=0;j<temp.length;j++){
                        if(nameList[i] == temp[j]) counT[j]++;
                    }
                }
                
                // 多い順位ならべる
                var temp2 = [];
                for(var i=0;i<counT.length;i++){
                    temp2.push([temp[i],counT[i]]);
                }
                temp2.sort(sortFnc);
            
                // 表示
                str = '<thead><th>名前</th><th>回数</th><th>割合</th></thead><tbody>';
                for(var i=0;i<temp.length;i++){
                    str += '<tr><th>';
                    str += temp2[i][0] + '</th><td>' + temp2[i][1] + '</td>';
                    str += '<td>' + Math.round(temp2[i][1]/len*1000)/10 + '%</td></tr>';
                }
                str += '</tbody>';
                $('#result').html(str);
                
                str = '<tr><th width="50%">スタンプ数</th><th width="50%">画像数</th></tr><tr><td>';
                try{
                    str += (text.match(/\[スタンプ\]/g)).length;
                }catch(e){
                    str += 0;
                }finally{
                    str += '</td><td>';
                }
                
                try{
                    str += (text.match(/\[画像\]/g)).length;
                }catch(e){
                    str += 0;
                }
                
                str += '</td></tr>';
                $('#result2').html(str);
            }catch(e){
                $('#disp').html('読み込み失敗。<br>LINEの履歴ではない可能性があります。<br>');
                console.error(e);
            }
        }
    }else
        $('#disp').html('txtタイプのファイルを選択してください。');
}

// 重複しているかどうか確認
function reAry(ary, val){
    var len = ary.length;
    for(var i=0;i<len;i++) if(val == ary[i]) return true;
    
    return false;
}
// 重複していない時は追加
function pushAry(ary, val){
    if(!reAry(ary, val)) ary.push(val);
}

// ソート関数
function sortFnc(a,b){
    return b[1] - a[1];
}
