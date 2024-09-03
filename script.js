addEventListener("load", async () => {
    await sleep(1500);
    document.getElementById("main").innerHTML = document.getElementById("content").innerHTML;
    document.getElementById("point").addEventListener("click", () => {
        document.getElementById("one").style.display = "block";
        document.getElementById("two").style.display = "none";
        permission("point");
    });

    document.getElementById("random").addEventListener("click", () => {
        document.getElementById("one").style.display = "none";
        document.getElementById("two").style.display = "block";
        permission("random");
    });

    document.getElementById("analysis").addEventListener("click", async () => {
        if (bool) {
            btnanime(document.getElementById("analysis"));
            document.getElementById("progress").innerText = `取得エラー: 計算中`;
            let val = await analysis();
            document.getElementById("progress").innerText = `取得エラー: ${urls.length? val - urls.length + "件": "不明"}`;
        } else {
            alert(`${type == "point"? "URL又はID": "生成個数"}を入力してください。`);
        }
    });
});

let type = "point", bool = false;
let urls = [], cash = 0;
const sleep = t => {
    return new Promise(res => setTimeout(res, t));
};

const btnanime = async btn => {
    btn.style.border = "2px solid #aaa";
    await sleep(300);
    btn.style.border = "2px solid #000";
}

const permission = t => {
    let txt = document.getElementById(t == "point"? "url": "val").value;
    bool = Boolean(t == "point"? txt.match(/http/): Number(txt));
    type = t;
    let btn = document.getElementById("analysis").style;
    btn.background = `linear-gradient(45deg, ${bool? "#000, #666": "#666, #ddd"})`;
    btn.border = `2px solid #${bool? "000": "aaa"}`;
}

const dlzip = async (url, zip = new JSZip()) => {  
    for (let i = 0; i < url.length; i++) {
        let res = await axios.get(url[i], {responseType: "arraybuffer"});
        let imgfile = res.data;
        zip.file(`image${i}.jpg`, imgfile, {binary: true});
    }
    zip.generateAsync({type: "blob"}).then(content => {
        saveAs(content, "images.zip");
    });
}

const fetchImage = async imgurl => {
    try {
        let response = await fetch(imgurl);
        if (response.ok) {
            let img = document.createElement("img");
            img.src = urls[urls.length] = imgurl;
            img.width = "70";
            document.getElementById("imgs").appendChild(img);
        } 
    } catch(e) {
        console.log(`画像取得中にエラーが発生しました: \n${e}`);
    };
}

const analysis = async(t = type, val) => {
    val = document.getElementById(t == "point"? "url": "val").value;
    document.getElementById("imgview").style.display = "block";
    for (let name of ["view", "download"]) {
        if (cash >= 2) break;
        let btn = document.getElementById(name);
        btn.style.background = "linear-gradient(45deg, #000, #666)";
        btn.style.border = "2px solid #000";
        btn.addEventListener("click", async () => {
            btnanime(btn);
            if (name == "view") {
                let imgs = document.getElementById("imgview").style;
                imgs.background = "#cff";
                await sleep(1000);
                imgs.background = "#fff";
            } else {
                dlzip(urls);
            }
        });
        cash++;
    }

    urls = [];
    if (t == "point") {
        //データ解析、表示
        alert("この機能は開発中です(完成未定)");

    } else {
            document.getElementById("imgs").innerText = "";
            for (let i = 1; i <= val; i++) {
                let rand = Math.floor(Math.random()*650000000);
                let imgurl = `https://stickershop.line-scdn.net/stickershop/v1/sticker/${rand}/android/sticker.png`;
                fetchImage(imgurl);
            }
        }
    return val;
}