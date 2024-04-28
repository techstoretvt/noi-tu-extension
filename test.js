
;
(function ($) {
    $.fn.textfill = function (options) {
        var fontSize = options.maxFontPixels;
        var ourText = $('span:visible:first', this);
        var maxHeight = $(this).height();
        var maxWidth = $(this).width();
        var textHeight;
        var textWidth;
        do {
            ourText.css('font-size', fontSize);
            textHeight = ourText.height();
            textWidth = ourText.width();
            fontSize = fontSize - 1;
        } while ((textHeight > maxHeight || textWidth > maxWidth) && fontSize > 3);
        return this;
    }
})(jQuery);

var currentWord = {
    text: "",
    tail: ""
}
var socket, room
var currentTime
var score = 0
var timeInterval

function formatSecond() {
    let minute = `${parseInt(currentTime / 60)}`
    if (minute.length < 2) minute = `0${minute}`
    let second = `${currentTime % 60}`
    if (second.length < 2) second = `0${second}`
    $('.time').html(`${minute}:${second}`)
}

function startTimer() {
    restartTimer()
    timeInterval = setInterval(() => {
        currentTime--
        formatSecond()
        if (currentTime <= 0) {
            clearInterval(timeInterval)
        }
    }, 1000)
}

function restartTimer() {
    currentTime = 10
    formatSecond()
    if (timeInterval) {
        clearInterval(timeInterval)
    }

}

function bindWord(data) {
    let maxFontPixels = Math.min($(window).width() * 0.1, 100); // 10% of screen width, but not more than 100px

    $('.jtextfill').show().textfill({
        maxFontPixels: maxFontPixels
    });
    if (currentWord.text != data.text) {
        $('#currentWord').html(data.text)
        $("#head").html(data.tail)
        $('#text').val("").focus()
    }
    currentWord = data
}

function startGame() {
    confetti.stop()
    $('#username').hide()
    $('#group-text').hide()
    $('.jtextfill').hide()
    $('#noti > h3').html("Đang tìm kiếm đối thủ")
    $('#noti').show()
    $('.score').html(`(${score}) ${decodeURIComponent(Cookies.get("name2"))}`)

    socket = io("https://solo.noitu.pro");

    setTimeout(() => {
        socket.emit('queue', {
            id: Cookies.get('id2'),
            name: decodeURIComponent(Cookies.get('name2'))
        });
    }, 2000)

    socket.on("end", (data) => {
        if (data && data.room == room) {
            if (data.win) {
                confetti.start()
            }
            restartTimer()
            swal({
                title: "Trò chơi kết thúc!",
                text: data.win ? "Bạn đã dành chiến thắng" : "Bạn đã thua",
                buttons: ["Trang chủ", "Chơi lại"],
                icon: data.win == true ? "success" : "error",
            }).then((playAgain) => {
                let rand = Math.random()
                if (playAgain) {
                    runAd()
                    socket.close()
                    startGame()
                } else {
                    window.location = "/"
                }
            })
        }
        if (data && data.points) {
            score = data.points
        }
    })
    socket.on("points", (data) => {
        score = data.points
        $('.score').html(`(${score}) ${decodeURIComponent(Cookies.get("name2"))}`)
    })
    socket.on("ready", (data) => {
        // clearTimeout(autoClose)
        room = data
        socket.emit('ready', data);
    })

    socket.on("play", (data) => {
        startTimer()
        let mee = decodeURIComponent(Cookies.get("name2")).length < 30 ? decodeURIComponent(Cookies.get("name2")) : decodeURIComponent(Cookies.get("name2")).slice(0, 27) + "..."
        let opponent = data.opponent.name.length < 30 ? data.opponent.name : data.opponent.name.slice(0, 27) + "..."
        $('.score').html(`<span class="elo">(${score})</span> ${mee} vs ${opponent} <span class="elo">(${data.opponent.points})</span>`)
        bindWord(data.word)
        if (data.isAnswer) {
            $('#noti').hide()
            $('#group-text').show()
            $("#text").attr("disabled", false).focus()
        } else {
            $('#group-text').hide()
            $("#text").attr("disabled", true)
            $('#noti > h3').html(`Đối thủ đang trả lời`)
        }
    })

    socket.on("answer", (data) => {
        startTimer()
        $('#noti').hide()
        $('#group-text').show()
        $("#text").attr("disabled", false).focus()
        bindWord(data.word)
    })
}

function editName() {
    $('#group-text').hide()
    $('#username').show()
    $('#noti').hide()
}

function startOrEditName() {
    if (Cookies.get('id2') && Cookies.get("name2")) {
        startGame();
    } else {
        editName();
    }
}
$(document).ready(function () {

    $('#username').hide()
    $('#group-text').hide()
    $('.jtextfill').hide()

    scoreBoard()
    showAds(() => {
        if (Cookies.get('guideSolo')) {
            startOrEditName()
        } else {
            Cookies.set("guideSolo", "123", {
                expires: 7
            })
            swal({
                title: "Hướng dẫn",
                text: "Chế độ 1vs1 là chế độ giúp người chơi có thể chơi nối từ trực tiếp với người khác. Trong vòng 10s, mỗi người chơi phải đưa ra từ nối chính xác cho từ mà đối thủ đưa ra. Nhập từ vào ô trả lời và ấn Enter để gửi đáp án! Nếu không thể trả lời hoặc hết thời gian, bạn sẽ thua!",
                button: false,
                icon: "info"
            }).then(() => {
                startOrEditName()
            })
        }
    })


    $('#username').keydown(function (e) {
        if (e.keyCode == 13 && $('#username').val().trim() != "") {
            Cookies.set("name2", encodeURIComponent($('#username').val()), {
                expires: 365
            })
            if (!Cookies.get("id2"))
                Cookies.set("id2", makeid(), {
                    expires: 365
                })
            startGame()
        }
    })

    $("#text").keydown(function (e) {
        if (e.keyCode == 13) {
            if ($("#text").val() != "") {
                let text = $("#head").html() + " " + $("#text").val()
                let tail = ""
                if (text.split(' ').length < 2 || currentWord.chuan == text.trim()
                    .toLowerCase()
                    .split('-').join(' ') || text.split(' ')[0].trim().toLowerCase() !=
                    currentWord.tail) {
                    $("#head").html(currentWord.tail)
                    $('#text').val("").focus()
                } else {
                    startTimer()
                    socket.emit("answer", {
                        room,
                        word: text
                    })
                    $('#currentWord').html(text)
                    $('#group-text').hide()
                    $("#head").html($("#text").val().trim())
                    $("#text").val("").attr("disabled", true)
                    $('#noti > h3').html(`Đối thủ đang trả lời`)
                    $('#noti').show(``)
                }

            }

        }
    })
});

function titleCase(str) {
    var splitStr = str.toLowerCase().split(' ');
    for (var i = 0; i < splitStr.length; i++) {
        // You do not need to check if i is larger than splitStr length, as your for does that for you
        // Assign it back to the array
        splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
    }
    // Directly return the joined string
    return splitStr.join(' ');
}
