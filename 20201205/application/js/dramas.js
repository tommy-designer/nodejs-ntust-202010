$(function(){
  
    $("#drama-select-btn").click(function(){


        console.log('Trigger!!!');

        var type = $("#categories-select").val();

        // createTable();

        // Ajax
        // query_string 
        $.ajax({
            url  : "/dramas/list?type="+type,
            headers : {
                token : "APTX4869123465"
            },
            // url  : "/dramas/list?type="+type+"&token=APTX4869",
           
            type : "GET",
            timeout: 10000 // 10 sec
        })
        .then(function(response){
            console.log(response);

            createTable(response["result"]);
        })
        .catch(function(error){
            // alert("失敗!");
            alert(error.responseText);
            console.log(error);
        });


    });

    $("#drama-insert-btn").click(function(){
        insertNewRecord();
    });

});

let createTable = (data)=>{
    data = data || [
        { category : "犯罪" , name : "絕命毒師" , score : 10 },
        { category : "殭屍" , name : "屍戰朝鮮" , score : 9 },
        { category : "愛情" , name : "想見你"   , score : 8.5 },
    ];
 

    let tableBody = data.map((ele,i)=>`
        <tr>
            <th scope="row">${ele.dramaId}</th>
            <td>${ele.category}</td>
            <td>${ele.name}</td>
            <td>${ele.score} / 10</td>
        </tr>
    `).join("");
    

    $("#drama-select-table tbody").html(tableBody);
};



let insertNewRecord = ()=> {
    let category  = $("#categories-insert option:selected").val(); 
    let name      = $("#name-insert").val();
    let score     = $("#score-insert").val();


    if(!name || name.length === 0){
        alert("請輸入劇名！");
        return;
    };

    if(!score || score.legnth === 0){
        alert("請輸入評價！");
        return;
    };


    $.ajax({
        // url  : "/createNewDramaData",    #1
        url  : "/dramas/data",


        type : "POST",
        data : {
            category,
            name,
            score
        },
        headers : {
            token : "APTX4869aaa"
        }

        // data : JSON.stringify({
        //     category,
        //     name,
        //     score
        // }),
        // contentType: "application/json",
    })
    .then(r=>{
        if(r.message === "ok."){
            alert("更新完成！");
            // location.reload();    #2
        };
        
    })
    .catch(err=>{
        console.log(err);

        if(err.status === 404){
            alert("找不到該 API !");
            return;
        };
        
        alert("系統有誤 , 請稍後再試！");
    });
};
