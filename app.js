const canvas = document.getElementById("jsCanvas"); //html에서 가져와
const ctx = canvas.getContext("2d"); //2d렌더링으로 
const colors = document.getElementsByClassName("jsColor")
const range = document.getElementById("jsRange")
const mode = document.getElementById("jsMode")
const saveBtn = document.getElementById("jsSave")

const INITIAL_COLOR = "#2c2c2c";
const CANVAS_SIZE = 700;
//pixel modifier에 사이즈를 줘 (css에서 설정했던 canvas의 사이즈)
// pixel을 다루는 윈도우의 크기를 주는것 
canvas.width = CANVAS_SIZE;
canvas.height = CANVAS_SIZE;

//실제 pixel manipulator canvas에 배경을 설정하지 않았다. html에만 설정한상태
// => canvas가 load되자마자 설정되도록 하자
ctx.fillStyle = "white";
ctx.fillRect(0, 0, canvas.width, canvas.height)


//context안의 모든 선들의 색상값과 너비값
ctx.strokeStyle = INITIAL_COLOR;
ctx.fillStyle = INITIAL_COLOR;
ctx.lineWidth = 2.5;

ctx.fillStyle = "green" //순서가 중요하다. 
ctx.fillRect(50, 100, 300, 30)
ctx.fillStyle = "purple"
ctx.fillRect(95, 107, 200, 15)


let painting = false;
let filling = false;

function stopPainting() {
    painting = false;
}

function startPainting(event) {
    if (filling === false) {
        painting = true;
    }
}

function onMouseMove(event) {
    const x = event.offsetX;
    const y = event.offsetY;
    if (!painting) {
        console.log("creating path in ", x, y)
        ctx.beginPath(); //클릭하지 않고 마우스를 움직일 때는 path를 시작한다. path = line
        ctx.moveTo(x, y);
    } else {
        console.log("creating line in ", x, y)
        ctx.lineTo(x, y); //path의 마지막점에서 지금의 위치까지 선을 만든다. 마우스를 움직이는 내내 발생한다.
        ctx.stroke(); //획을 긋는다. 마우스를 움직이는 내내 발생한다.
    }
}

function handleColorClick(event) {
    console.log(event.target.style)
    const color = event.target.style.backgroundColor;
    ctx.strokeStyle = color; //strokeStyle을 override하고 변경
    ctx.fillStyle = color;
}

function handleRangeChange(event) {
    console.log(event.target.value)
    const size = event.target.value
    ctx.lineWidth = size
}

function handleModeClick(event) {
    if (filling === true) {
        filling = false;
        mode.innerText = "Fill"
    } else {
        filling = true;
        mode.innerText = "Paint"
        // ctx.fillStyle = ctx.strokeStyle

    }
}

function handleCanvasClick() {
    if (filling) {
        ctx.fillRect(0, 0, canvas.width, canvas.height)
    }
}

//a html mdn download검색
function handleSaveClick() {
//canvas의 데이터를 image처럼 얻는다.
const image = canvas.toDataURL();
// console.log(image)
const link = document.createElement("a");
link.href = image;
link.download = "PaintJS[🌈]";
link.click()
// console.log(link)
}

//우클릭 방지
function handleRightClick(event) {
    console.log(event)
    event.preventDefault()
}

// creating path in 86 88
// creating path in 78 86
// creating line in 78 86
// creating line in 80 85

//line로직은 MouseDown에 필요해, MouseUp은 필요없기 때문에 addEvent에 바로 함수를 적용하자 
// function onMouseDown(event) {
//     stopPainting()
// }
//=> 이 함수도 필요없다.

// function onMouseUp(event) {
//     stopPainting()
// }
//나중에 line 실제로 그리는게 필요하니깐 mouseleave와 다르게 함수를 만들어서 사용한다. 
//  => 아니다. 여기도 필요없다.

if (canvas) {
    canvas.addEventListener("mousemove", onMouseMove)
    canvas.addEventListener("mousedown", startPainting) //클릭을 하면 페인팅이 시작된다. 
    canvas.addEventListener("mouseup", stopPainting)
    canvas.addEventListener("mouseleave", stopPainting)
    canvas.addEventListener("click", handleCanvasClick)
    canvas.addEventListener("contextmenu", handleRightClick)
}

//array를 만들어서 forEach로 color를 돌려서 호출한다.
//color를 다른변수명으로 해도된다. array안의 각 아이템들을 대표하는 이름일 뿐 
Array.from(colors).forEach(color => color.addEventListener("click", handleColorClick))

// console.log(colors) //HTMLCollection이라는 객체가 아닌 array를 만들기 위해서 Array.from 메소드를 사용
// console.log(Array.from(colors))

if (range) {
    range.addEventListener("input", handleRangeChange)
}

if (mode) {
    mode.addEventListener("click", handleModeClick)
}

if (saveBtn) {
    saveBtn.addEventListener("click", handleSaveClick)
}