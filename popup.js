const link_backend = 'https://server-noi-tu-online.onrender.com'

let ipTuBatDau = document.getElementById('tuBatDau');
let txtResult = document.getElementById('ketQua');
let btnTimKiem = document.getElementById('btnTim');


btnTimKiem.onclick = async (event) => {
    let tuBatDau = ipTuBatDau.value;
    if (!tuBatDau) return
    let response = await fetch(link_backend + '/list-tu-ket-thuc?tuBatDau=' + tuBatDau)
    let data = await response.json();
    if (data.errCode === 0) {
        let strResult = ''
        for (let tuKT of data.data) {
            strResult += `${tuBatDau} ${tuKT.label}\n`
        }
        console.log(strResult);
        txtResult.value = strResult
    }
}
