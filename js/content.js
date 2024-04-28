// alert("hello noi tu")
const link_backend = 'https://server-noi-tu.onrender.com'
// const link_backend = 'http://localhost:4000'
let listWord = []

let spanRef = document.getElementById('currentWord')

let container = document.getElementsByClassName("container")[0]
container?.classList?.add('newclass');

let groupText = document.getElementById('group-text')
let inputText = document.getElementById('text')
let spanHead = document.getElementById('head')
let currentWord = document.getElementById('currentWord')

let btnIconThemTuDie = document.createElement('div')
btnIconThemTuDie.innerText = "+ thêm từ die"
btnIconThemTuDie.classList.add('btnIconThemTuDie')

const handleThemTuDie = async (tuBatDau, tuKetThuc) => {
    let data = {
        tuBatDau,
        tuKetThuc
    }

    let response = await fetch(link_backend + '/them-tu-die', {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        headers: {
            "Content-Type": "application/json",
        },
        redirect: "follow",
        referrerPolicy: "no-referrer",
        body: JSON.stringify(data),
    });

    response = await response.json()

}

let idTimeout
const handleNhapTraLoi = async (tuBatDau, tuKetThuc) => {

    let data = {
        tuBatDau,
        tuKetThuc
    }
    if (idTimeout)
        clearTimeout(idTimeout)
    idTimeout = setTimeout(async () => {
        let wrapKetThuc = document.querySelector('.swal-overlay.swal-overlay--show-modal')
        if (wrapKetThuc) return;

        console.log('Thêm: ', tuBatDau, tuKetThuc);

        let response = await fetch(link_backend + '/them-tra-loi', {
            method: "POST",
            mode: "cors",
            cache: "no-cache",
            credentials: "same-origin",
            headers: {
                "Content-Type": "application/json",
            },
            redirect: "follow",
            referrerPolicy: "no-referrer",
            body: JSON.stringify(data),
        });

        response = await response.json()

    }, 1300);



}

setInterval(() => {
    let btnChoiLai = document.querySelector('button.swal-button.swal-button--confirm')
    if (!btnChoiLai) return

    btnChoiLai.addEventListener('click', () => {
        console.log('Từ cuối: ', listWord[listWord.length - 1]);
        listWord = []
    })

}, 1000);

let data_tl = null

inputText.onkeydown = (event) => {
    if (event.key === 'Enter') {
        listWord.push({
            tuBatDau: currentWord.innerText.split(' ')[0],
            tuKetThuc: currentWord.innerText.split(' ')[1]
        })
        if (data_tl !== null) {
            handleNhapTraLoi(data_tl.tuBatDau, data_tl.tuKetThuc)
            data_tl = null
        }

    }
}



btnIconThemTuDie.onclick = async () => {
    let arrTextCurrent = currentWord.innerText.split(' ')
    handleThemTuDie(arrTextCurrent[0], arrTextCurrent[1])
    currentWord.style.color = 'red'

    setTimeout(() => {
        currentWord.style.color = '#fff'
    }, 1000);


}
document.getElementsByClassName("jtextfill")[0].appendChild(btnIconThemTuDie)

let btnIconThemTutraloi = document.createElement('div')
btnIconThemTutraloi.innerText = "+ thêm từ mới"
btnIconThemTutraloi.classList.add('btnIconThemTutraloi')
btnIconThemTutraloi.onclick = async () => {
    let arrvalue = currentWord.innerText.split(' ')

    let data = {
        tuBatDau: arrvalue[0],
        tuKetThuc: arrvalue[1]
    }

    handleNhapTraLoi(data.tuBatDau, data.tuKetThuc)
    currentWord.style.color = 'green'

    setTimeout(() => {
        currentWord.style.color = '#fff'
    }, 1000);
}

document.getElementsByClassName("jtextfill")[0].appendChild(btnIconThemTutraloi)



const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        if (mutation.type === 'childList' && mutation.target === spanHead) {
            if (groupText.style.display !== 'none') {
                //thêm từ thường
                let arrTextCurrent = currentWord.innerText.split(' ')

                let data = {
                    tuBatDau: arrTextCurrent[0],
                    tuKetThuc: arrTextCurrent[1]
                }

                fetch(link_backend + '/them-tu-thuong', {
                    method: "POST",
                    mode: "cors",
                    cache: "no-cache",
                    credentials: "same-origin",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    redirect: "follow",
                    referrerPolicy: "no-referrer",
                    body: JSON.stringify(data),
                }).then(response => {
                    return response.json();
                })
                    .then(data => {
                        // console.log('KQ them: ', data.mess);
                    })

                // headTextOld = spanHead.innerText

                //tìm
                listWord.push({
                    tuBatDau: currentWord.innerText.split(' ')[0],
                    tuKetThuc: currentWord.innerText.split(' ')[1]
                })
                let newListWord = listWord.filter(item => item.tuBatDau === spanHead.innerText)
                    .map(item => item.tuKetThuc)
                fetch(link_backend + '/tim-tu-goi-y?tuBatDau=' + spanHead.innerText + '&listWord=' + newListWord)
                    .then(response => {
                        return response.json();
                    }).then(data => {
                        if (data.errCode === 0) {
                            inputText.value = data.data
                            inputText.focus();

                            if (data.type === 'normal') {
                                inputText.style.backgroundColor = "green"
                            }
                            else if (data.type === 'warning') {
                                inputText.style.backgroundColor = "yellow"
                                if (data.dataTuDien) {
                                    ipKetThuc_themTuTraLoi.focus()
                                    ipKetThuc_themTuTraLoi.value = data.dataTuDien
                                }
                            }
                            else {
                                inputText.style.backgroundColor = "red"
                                handleThemTuDie(spanHead.innerText, data.data)
                            }


                        }
                        else if (data.errCode === 1 && data?.type === "tuDien") {
                            ipKetThuc_themTuTraLoi.focus()
                            ipKetThuc_themTuTraLoi.value = data.data
                            inputText.style.backgroundColor = "#fff"
                        }
                        else {
                            ipKetThuc_themTuTraLoi.focus()
                            inputText.style.backgroundColor = "#fff"
                        }
                    })
            }
        }
    });
});

observer.observe(spanHead, { childList: true });


let modeNoiTuContainer = document.createElement('div')
modeNoiTuContainer.classList.add("modeNoiTuContainer")


//title them tu tra loi
let titleThemTuTraLoi = document.createElement('div')
titleThemTuTraLoi.classList.add("titleThemTuTraLoi")
titleThemTuTraLoi.innerText = "Thêm từ trả lời"

//wrap them tu tra loi
let wrapThemTuTraLoi = document.createElement('div')
wrapThemTuTraLoi.classList.add("wrapThemTuTraLoi")

let ipKetThuc_themTuTraLoi = document.createElement('input')
ipKetThuc_themTuTraLoi.classList.add("ipKetThuc_themTuTraLoi")
ipKetThuc_themTuTraLoi.placeholder = "Từ kết thúc"

ipKetThuc_themTuTraLoi.onkeydown = (event) => {
    if (event.key === 'Enter' && ipKetThuc_themTuTraLoi.value) {
        let tuBatDau = spanHead.innerText
        inputText.value = ipKetThuc_themTuTraLoi.value

        inputText.focus()

        data_tl = {
            tuBatDau,
            tuKetThuc: ipKetThuc_themTuTraLoi.value
        }

        ipKetThuc_themTuTraLoi.value = ''

    }

}
wrapThemTuTraLoi.appendChild(ipKetThuc_themTuTraLoi);


//add to mode container
modeNoiTuContainer.appendChild(titleThemTuTraLoi);
modeNoiTuContainer.appendChild(wrapThemTuTraLoi);

//add to container
container.appendChild(modeNoiTuContainer);


