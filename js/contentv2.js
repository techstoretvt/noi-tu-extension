//redirect
//"default_popup": "hello.html",

let url = window.location.hostname;
console.log(url);
if (url === 'shopee.vn') {
    window.location.href = "https://noitu.pro/solo";
}


let container = document.getElementsByClassName("container")[0]
let inputText = document.getElementById('text')
let spanHead = document.getElementById('head')
let currentWord = document.getElementById('currentWord')
let groupText = document.getElementById('group-text')
let wrapListMoreTuVung = document.createElement('div')
let btnMode
let formReplay
const eventKeyBoard = new KeyboardEvent('keydown', {
    key: 'Enter',
    keyCode: 13,
    char: '\n'
});
let listWord = []
const link_backend = 'https://server-noi-tu-online.onrender.com'
let typeWord = ''
let waitingTraLoi = false
let soLanThua = 0
let soLanChơi = 0
let idTimeoutReset
let currentTypeTuVung = 'normal'


// inputText.classList.add('error')

//get form replay
const getFormReplay = () => {
    // Kiểm tra mỗi giây một lần
    let intervalId = setInterval(function () {
        formReplay = document.querySelector('.swal-overlay');
        if (formReplay) {
            clearInterval(intervalId);
        }
    }, 1000); // Kiểm tra mỗi giây

}
getFormReplay();

//add btn mode
const addBtnMode = () => {
    document.querySelector('a.float').style.display = 'none'
    document.querySelector('h6.score').style.fontSize = '20px'
    document.querySelector('body').style.backgroundColor = '#000'
    document.querySelector('body').style.backgroundImage = 'none'


    btnMode = document.createElement('button')
    btnMode.innerText = window.localStorage.getItem('thoaiMode') === 'on' ? "Tắt tự động" : 'Bật tự động'
    btnMode.style.scale = '0.5'
    btnMode.style.marginLeft = '-50px'

    btnMode.onclick = () => {
        console.log('click');
        let mode = window.localStorage.getItem('thoaiMode')
        window.localStorage.setItem('thoaiMode', mode === 'on' ? 'off' : 'on')

        btnMode.innerText = window.localStorage.getItem('thoaiMode') === 'off' ? "Bật tự động" : 'Tắt tự động'

    }

    let inputTgTraLoi = document.createElement('input')
    inputTgTraLoi.placeholder = "Thời gian trả lời..."
    inputTgTraLoi.defaultValue = '0'
    inputTgTraLoi.min = '0'
    inputTgTraLoi.max = '9'
    inputTgTraLoi.type = 'number'
    inputTgTraLoi.style.color = '#ccc'
    inputTgTraLoi.style.backgroundColor = '#333'

    inputTgTraLoi.onkeydown = (event) => {
        if (event.key === 'Enter' && inputTgTraLoi.value) {
            window.localStorage.setItem('ThoaiTime', +inputTgTraLoi.value * 1000)
        }
    }


    // more tu vung
    let wrapInput = document.querySelector('div.input-group.mb-3')

    let detailTag = document.createElement('div')
    detailTag.style.maxHeight = '200px'
    detailTag.style.overflow = 'auto'

    let sumaryTag = document.createElement('div')
    sumaryTag.innerText = "More"
    sumaryTag.style.backgroundColor = "rgb(38 60 229)"
    sumaryTag.style.padding = "10px"
    sumaryTag.style.borderRadius = "6px"
    sumaryTag.style.height = "66px"
    sumaryTag.style.display = "flex"
    sumaryTag.style.width = "100px"
    sumaryTag.style.alignItems = "center"
    sumaryTag.style.justifyContent = "center"

    sumaryTag.onclick = async () => {
        let arrTextCurrent = currentWord.innerText.split(' ')
        let newListWord = listWord.filter(item => item.tuBatDau === arrTextCurrent[1])
            .map(item => item.tuKetThuc)

        sumaryTag.innerText = "Loading..."
        let res = await funcHandle.getListTuKetThuc(currentWord.innerText.split(' ')[1], newListWord)
        wrapListMoreTuVung.innerHTML = ''
        if (res.errCode === 0) {
            for (let tuKT of res.data) {
                let item1 = document.createElement('div')
                item1.style.backgroundColor = tuKT.type === 'die' ? 'red' : tuKT.type === 'warning' ? 'orange' : '#000'
                item1.style.textAlign = 'center'
                item1.style.maxWidth = '100px'
                item1.style.cursor = 'pointer'
                item1.innerText = tuKT.label
                item1.classList.add("itemMoreTuVung")
                item1.onclick = () => {
                    inputText.value = tuKT.label
                    inputText.dispatchEvent(eventKeyBoard)
                    wrapListMoreTuVung.innerHTML = ''
                }
                wrapListMoreTuVung.appendChild(item1)
            }
            sumaryTag.innerText = "More"
        }
        else {
            sumaryTag.innerText = "More"
        }
    }


    detailTag.appendChild(sumaryTag)
    detailTag.appendChild(wrapListMoreTuVung)

    wrapInput.appendChild(detailTag)


    container.querySelector('.row>.col-4').appendChild(btnMode)
    container.querySelector('.row>.col-4').appendChild(inputTgTraLoi)

}
addBtnMode();

//auto click replay
const autoReplay = () => {
    setInterval(() => {
        //check gap tool
        let nameNguoiChoi = document.querySelector('.score')
        if (nameNguoiChoi?.innerText.includes('Tool Tự Động vs Tool Tự Động')) {
            window.location.reload()
        }


        // console.log('end game: ', funcHandle.checkEndGame());
        let mode = window.localStorage.getItem('thoaiMode')
        if (mode === 'on' && funcHandle.checkEndGame()) {

            //swal-button swal-button--confirm
            let btnReplay = formReplay?.querySelector('button.swal-button.swal-button--confirm')
            if (!btnReplay) return
            currentTypeTuVung = 'normal'
            btnReplay.click()
            listWord = []
            waitingTraLoi = false
            document.title = document.querySelector('h6.score>span.elo')?.innerText

        }
    }, 1000);
}
autoReplay();



const config = { childList: true, subtree: true, characterData: true };
const callback = async function (mutationsList, observer) {
    for (let mutation of mutationsList) {
        if (mutation.type === 'childList') {
            console.log('change: ', currentWord.innerText, ' - ', currentTypeTuVung);
            let arrTextCurrent = currentWord.innerText.split(' ')
            listWord.push({
                tuBatDau: arrTextCurrent[0],
                tuKetThuc: arrTextCurrent[1]
            })
            if (currentTypeTuVung === 'die') {
                currentWord.style.color = 'red'
            }
            else if (currentTypeTuVung === 'warning') {
                currentWord.style.color = 'orange'
            }
            else {
                currentWord.style.color = '#fff'
            }

        }
    }
};


// Tạo một observer instance liên kết với callback function
const observer = new MutationObserver(callback);
observer.observe(currentWord, config);

//auto tra loi
const autoTraLoi = () => {
    const observer = new MutationObserver((mutations) => {
        mutations.forEach(async (mutation) => {
            if (mutation.type !== 'childList' || mutation.target !== spanHead) {
                return
            }

            if (groupText.style.display === 'none') {
                return
            }

            let arrTextCurrent = currentWord.innerText.split(' ')


            wrapListMoreTuVung.innerHTML = ''

            //kiem tra tu co ton tai
            let checkTuExit = await funcHandle.kiemTraTuTonTai(arrTextCurrent[0], arrTextCurrent[1])
            if (!checkTuExit) {
                console.log('không ton tai');
                funcHandle.handleNhapTraLoi(arrTextCurrent[0], arrTextCurrent[1])
            }


            //get goi y
            let newListWord = listWord.filter(item => item.tuBatDau === arrTextCurrent[1])
                .map(item => item.tuKetThuc)
            let data = await funcHandle.getGoiY(arrTextCurrent[1], newListWord)
            typeWord = data.type

            //ko tim thay
            if (data.errCode === 1 && data?.mess === "not found" || data.errCode === -1) {

                let listTuMoi = window.localStorage.getItem('TuMoi') ? JSON.parse(window.localStorage.getItem('TuMoi')) : []
                listTuMoi.push(arrTextCurrent[0] + ' ' + arrTextCurrent[1])
                localStorage.setItem("TuMoi", JSON.stringify(listTuMoi))

                console.log("Tim tu tren online");
                const response = await fetch(`https://noitu.pro/answer?word==${arrTextCurrent[0]} ${arrTextCurrent[1]}`);
                if (response.ok) {
                    const data = await response.json();
                    if (data.success && data.nextWord.head === arrTextCurrent[1]) {
                        inputText.value = data.nextWord.tail
                        funcHandle.handleNhapTraLoi(data.nextWord.head, data.nextWord.tail)
                        let mode = window.localStorage.getItem('thoaiMode')
                        if (mode === 'on') {
                            let timeTl = window.localStorage.getItem('ThoaiTime') ?? 0;
                            setTimeout(() => {
                                inputText.dispatchEvent(eventKeyBoard);
                            }, timeTl);
                        }
                    }
                    else {
                        inputText.classList.add('error')
                    }
                }
                else {
                    inputText.classList.add('error')
                }

                return;

            }

            //tim thay
            inputText.value = data.dataTuDien && data.dataTuDien !== 'undefined' ? data.dataTuDien : data.data
            inputText.focus();
            if (inputText.value === 'undefined') {
                console.log('data undefined ne', data);
                return
            }

            let mode = window.localStorage.getItem('thoaiMode')
            if (mode === 'on') {
                let timeTl = window.localStorage.getItem('ThoaiTime') ?? 0;
                setTimeout(() => {
                    inputText.dispatchEvent(eventKeyBoard);
                }, timeTl);
            }


            if (data.type === 'die') {
                currentTypeTuVung = 'die'
            }
            else if (data.type === 'warning') {
                currentTypeTuVung = 'warning'
            } else {
                currentTypeTuVung = 'normal'
            }

        })
    })

    observer.observe(spanHead, { childList: true });
}
autoTraLoi();

//add event
const addEvent = () => {

    //enter input text
    inputText.onkeydown = (e) => {
        if (e.key === 'Enter') {
            let arrCurrentWord = currentWord.innerText.split(' ')
            listWord.push({
                tuBatDau: arrCurrentWord[0],
                tuKetThuc: arrCurrentWord[1]
            })
            inputText.classList.remove('error')

            waitingTraLoi = true


        }
    }


}
addEvent();

//init function
class funcHandle {
    static handleNhapTraLoi = async (tuBatDau, tuKetThuc) => {
        let data = {
            tuBatDau,
            tuKetThuc,
        }
        console.log("Nhap tu moi: ", tuBatDau, tuKetThuc);
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
        // response = await response.json()
    }

    static checkEndGame = () => {
        if (!formReplay || !formReplay.classList.contains('swal-overlay--show-modal'))
            return false
        return true
    }

    static handleXoaTu = async (tuBatDau, tuKetThuc) => {
        let data = {
            tuBatDau,
            tuKetThuc
        }
        console.log('Xoa: ', data.tuBatDau, data.tuKetThuc);

        let response = await fetch(link_backend + '/xoa-tu', {
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

    static getGoiY = async (tuBatDau, listWord) => {
        let response = await fetch(link_backend + '/tim-tu-goi-y?tuBatDau=' + tuBatDau + '&listWord=' + listWord)
        let data = response.json();
        return data;
    }

    static kiemTraTuTonTai = async (tuBatDau, tuKetThuc) => {
        let response = await fetch(link_backend + `/kiem-tra-tu-ton-tai?tuBatDau=${tuBatDau}&tuKetThuc=${tuKetThuc}`)
        let data = await response.json();
        if (data.errCode === 0 && data.isExit) {
            return true
        }
        return false;
    }

    static handleThemTuDie = async (tuBatDau, tuKetThuc, mess) => {
        mess = mess ? mess : 'Them die: '
        if (mess === 'Them die: ')
            console.log(mess, tuBatDau, tuKetThuc);
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

    static resetGame = () => {
        if (idTimeoutReset)
            clearTimeout(idTimeoutReset)

        idTimeoutReset = setTimeout(() => {
            window.location.reload()
        }, 20000);
    }

    static getListTuKetThuc = async (tuBatDau) => {
        let response = await fetch(link_backend + '/list-tu-ket-thuc?tuBatDau=' + tuBatDau)
        let data = response.json();
        return data;
    }
}


/**
 * "label" = 'undefined'
 */
