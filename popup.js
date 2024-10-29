const link_backend = 'https://server-noi-tu-online.onrender.com'

let ipTuBatDau = document.getElementById('tuBatDau');
let txtResult = document.getElementById('ketQua');
let btnTimKiem = document.getElementById('btnTim');


ipTuBatDau.focus()

ipTuBatDau.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        // Thực hiện hành động khi nhấn Enter
        handleTimKiem()
    }
});

btnTimKiem.onclick =  (event) => {
    handleTimKiem()
}

const handleTimKiem = async () => {
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
    ipTuBatDau.value = ""
}
