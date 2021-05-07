clearInterval(trxPoolInterval);

function alert() {
    var audio = new Audio('https://soundbible.com/grab.php?id=1446&type=mp3');
    audio.play();
    navigator.vibrate(3000);
}

grecaptcha.execute('6LeZYqgUAAAAADMr4ditTHwCC6oMMwcDfuoI2Kva', { action: 'login' }).then(function (token) {
    $("#g-recaptcha-response").val(token);
});

var banks = ["garanti", "yapikredi", "akbank", "isbank", "ziraat"];
function addordelete(bank) {
    var i = banks.findIndex(x => x == bank);
    if (i == -1)
        banks.push(bank)
    else
        banks.splice(i, 1)
    console.log(banks);
}

var impelm = document.querySelector("#agent-main-content > section > div > div > header");
banks.forEach(element => {
    $("#agent-main-content > section > div > div > header").append('<label style="padding: 5px;"><input type="checkbox" onclick="addordelete(\'' + element + '\');" checked>' + element + '</label>');
});

var itnbutton = document.createElement("button");
itnbutton.id = "start";
itnbutton.classList = "btn btn-sm btn-success pull-right";
itnbutton.style = "width: 45%;";
itnbutton.textContent = "Başlat"
impelm.append(itnbutton);
$("#start").click(function () {
    startinter();
});


var pool_inp = 0;
function trxPool() {
    if (pool_inp == 0) {

        pool_inp = 1;
        Http.Call("application/gateway/agent/service/trx.pool.php", "POST", $("#trx-pool-form").serialize(), null, function (rsp) {
            $("#start").text(new Date().toISOString().slice(11, 19))
            var rsp = JSON.parse(rsp);

            if (rsp.length > 0) {
                clearInterval(inter);
                $("#start").text("Yeniden Başlat");
                $("#start").attr("disabled", false);
                //New Itens
                var newItems = [];
                $.each(rsp, function (n, t) { newItems.push(t.i); });

                $('#trx-pool-table > tbody  > tr').each(function () {
                    var id = $(this).attr("id");
                    if (newItems.indexOf(id) == -1) {
                        $(this).remove();
                    }
                });
                alert();

                $.each(rsp, function (n, t) {
                    var ti = t.i;
                    var tb = t.b;
                    var ta = t.a;
                    console.log(tb);
                    var content = "<tr id=\"" + ti + "\">" +
                        "<td>" + tb + "</td>" +
                        "<td>" + ta + ".00</td>";

                    if (banks.findIndex(x => x == tb) == -1) {
                        content += "<td><button class=\"btn-sm btn-warning start-pool-item\" style=\"padding:3px 5px; font-size:11px; border:1x solid #ccc;\">banka pasif</button></td>";
                    } else {
                        content += "<td><button onclick=\"GoTrxItem('" + ti + "','" + tb + "','" + ta + "')\" class=\"btn-sm btn-success start-pool-item\" style=\"padding:3px 5px; font-size:11px; border:1x solid #ccc;\">başlat</button></td>";
                        GoTrxItem(ti, tb, ta)
                        setTimeout(function () {
                            document.querySelector("#atm-list-nearest > div:nth-child(1)").click();
                            setTimeout(function () {
                                document.querySelector("#atmModal > div > div > div.modal-footer > button.btn.btn-success.trxModalBtnCnt").click();
                            }, 1000);
                        }, 1000);

                    }
                    content += "</tr>";
                    if (!$("#" + ti).length) {
                        $("#trx-pool-tbody").append(content);
                    }
                });
            } else {
                var content = '<tr id="0"><td colspan="3">işlem bulunamadı.</td></tr>';
                $("#trx-pool-tbody").html(content);
            }

            pool_inp = 0;
        });



    } else {
        console.log("wr");
    }
}

var inter = null;
function startinter() {
    $("#start").attr("disabled", true);
    inter = setInterval(function () { trxPool(); }, 500);
}