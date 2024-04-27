// alert("hello noi tu")
const link_backend = 'http://localhost:4000'

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
btnIconThemTuDie.onclick = async () => {
    let arrTextCurrent = currentWord.innerText.split(' ')
    let data = {
        tuBatDau: arrTextCurrent[0],
        tuKetThuc: arrTextCurrent[1]
    }
    console.log('them tu die');

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

    ipBatDau_themTuDie.value = ""
    ipKetThuc_themTuDie.value = ""

}
document.getElementsByClassName("jtextfill")[0].appendChild(btnIconThemTuDie)




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
                console.log(data);

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
                fetch(link_backend + '/tim-tu-goi-y?tuBatDau=' + spanHead.innerText)
                    .then(response => {
                        return response.json();
                    }).then(data => {
                        if (data.errCode === 0) {
                            inputText.value = data.data

                            if (data.type === 'normal') {
                                inputText.style.backgroundColor = "green"
                            }
                            else if (data.type === 'warning') {
                                inputText.style.backgroundColor = "yellow"
                            }
                            else {
                                inputText.style.backgroundColor = "red"
                            }

                            inputText.focus();
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


//btn goi y
let btnGoiY = document.createElement('button')
btnGoiY.classList.add("btnGoiY")
btnGoiY.innerText = 'Gợi ý'
btnGoiY.onclick = async () => {
    // console.log('click', inputText);

    fetch(link_backend + '/tim-tu-goi-y?tuBatDau=' + spanHead.innerText)
        .then(response => {
            return response.json();
        }).then(data => {
            if (data.errCode === 0) {
                inputText.value = data.data
                inputText.focus();
            }
        })

}
modeNoiTuContainer.appendChild(btnGoiY)


//title them tu die
let titleThemTuDie = document.createElement('div')
titleThemTuDie.classList.add("titleThemTuDie")
titleThemTuDie.innerText = "Thêm từ die"

//wrap them tu die
let wrapThemTuDie = document.createElement('div')
wrapThemTuDie.classList.add("wrapThemTuDie")

let ipBatDau_themTuDie = document.createElement('input')
ipBatDau_themTuDie.classList.add("ipBatDau_themTuDie")
ipBatDau_themTuDie.placeholder = "Từ bắt đầu"

let ipKetThuc_themTuDie = document.createElement('input')
ipKetThuc_themTuDie.classList.add("ipKetThuc_themTuDie")
ipKetThuc_themTuDie.placeholder = "Từ kết thúc"

let btnThemTuDie = document.createElement('button')
btnThemTuDie.classList.add("btnThemTuDie")
btnThemTuDie.innerText = "Nhập"

btnThemTuDie.onclick = async () => {
    let data = {
        tuBatDau: ipBatDau_themTuDie.value,
        tuKetThuc: ipKetThuc_themTuDie.value
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

    ipBatDau_themTuDie.value = ""
    ipKetThuc_themTuDie.value = ""

}

wrapThemTuDie.appendChild(ipBatDau_themTuDie);
wrapThemTuDie.appendChild(ipKetThuc_themTuDie);
wrapThemTuDie.appendChild(btnThemTuDie);

//title them tu tra loi
let titleThemTuTraLoi = document.createElement('div')
titleThemTuTraLoi.classList.add("titleThemTuTraLoi")
titleThemTuTraLoi.innerText = "Thêm từ trả lời"

//wrap them tu tra loi
let wrapThemTuTraLoi = document.createElement('div')
wrapThemTuTraLoi.classList.add("wrapThemTuTraLoi")

let ipBatDau_themTuTraLoi = document.createElement('input')
ipBatDau_themTuTraLoi.classList.add("ipBatDau_themTuTraLoi")
ipBatDau_themTuTraLoi.placeholder = "Từ bắt đầu"

let ipKetThuc_themTuTraLoi = document.createElement('input')
ipKetThuc_themTuTraLoi.classList.add("ipKetThuc_themTuTraLoi")
ipKetThuc_themTuTraLoi.placeholder = "Từ kết thúc"

let btnThemTuTraLoi = document.createElement('button')
btnThemTuTraLoi.classList.add("btnThemTuTraLoi")
btnThemTuTraLoi.innerText = "Nhập"
const handleNhapTraLoi = async () => {

    inputText.focus()
    inputText.value = ipKetThuc_themTuTraLoi.value

    let data = {
        tuBatDau: ipBatDau_themTuTraLoi.value || spanHead.innerText,
        tuKetThuc: ipKetThuc_themTuTraLoi.value
    }

    ipKetThuc_themTuTraLoi.value = ''

    setTimeout(async () => {
        let wrapKetThuc = document.querySelector('.swal-overlay.swal-overlay--show-modal')
        if (wrapKetThuc) return;

        console.log('Them tra loi');

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


        ipBatDau_themTuTraLoi.value = ""
        ipKetThuc_themTuTraLoi.value = ""

    }, 1000);



}
btnThemTuTraLoi.onclick = handleNhapTraLoi
ipKetThuc_themTuTraLoi.onkeydown = (event) => {
    // console.log('keydown: ', event.key);
    if (event.key === 'Enter' && ipKetThuc_themTuTraLoi.value) {
        handleNhapTraLoi()
    }

}


wrapThemTuTraLoi.appendChild(ipBatDau_themTuTraLoi);
wrapThemTuTraLoi.appendChild(ipKetThuc_themTuTraLoi);
wrapThemTuTraLoi.appendChild(btnThemTuTraLoi);


//add to mode container
modeNoiTuContainer.appendChild(titleThemTuTraLoi);
modeNoiTuContainer.appendChild(wrapThemTuTraLoi);
modeNoiTuContainer.appendChild(titleThemTuDie);
modeNoiTuContainer.appendChild(wrapThemTuDie);


//add to container
container.appendChild(modeNoiTuContainer);


