let minesArr = new Set()
let cubesArray,helper, wasChecked = new Array()
let interval,firstClick = 0

class Cube{
    constructor(){
        this.id = 0
        this.isMine = false
        this.minesAround = 0
        this.x = 0
        this.y = 0
    }
    generateCube()
    {
        const cube = document.createElement("div")
        cube.classList.add(`one-cube`)
        cube.setAttribute("id",`${this.id}`)
        document.getElementById("main_content").appendChild(cube)
    }
}

function generateSweeper(){

    const s_width = document.getElementById("form_width").value
    const s_height = document.getElementById("form_height").value
    const mines = document.getElementById("form_mines").value
    const temp = s_width*s_height;

    // generate grid with exact same width and height as cubes
    document.getElementById("main_nav").style.width = `${s_width*50}px`
    document.getElementById("main_content").style.width = `${s_width*50}px`
    document.getElementById("main_content").style.height = `${s_height*50}px`
    document.getElementById("main_content").style.gridTemplateColumns = `repeat(${s_width}, 50px)`
    document.getElementById("main_content").style.gridTemplateRows = `repeat(${s_height},50px)`

    // set timer
    interval = clearInterval(interval)
    let minutes = 0
    let seconds = 0
    let time_counter = 0
    interval = setInterval(() => {
        seconds = seconds < 10 ? `0${seconds}` : seconds
        if(seconds % 60 == 0)
        {
            time_counter != 0 ? minutes++ : time_counter++
            minutes = minutes < 10 ? `0${minutes}` : minutes
            seconds=0
        }
        document.getElementById("timer").innerText = `${minutes}:${seconds}`
        seconds++
    },100)

    // settings reset
    cubesArray, helper = []
    wasChecked.length = 0
    firstClick = 0
    document.getElementById("main_content").innerHTML = ``
    for(let i=0;i<temp;i++) wasChecked.push(i)

    generateMines(mines,temp);
    createCubes()
}

function generateMines(mines, max)
{
    minesArr.clear()
    do{
        minesArr.add(Math.floor(Math.random() * max))
    }
    while(minesArr.size < mines)

    console.log(minesArr)
}

function createCubes()
{
    const s_width = document.getElementById("form_width").value
    const s_height = document.getElementById("form_height").value
    let counter = 0
    cubesArray = new Array(s_height)
    
    // fill cubes tab
    for(let i=0;i<s_height;i++){
        cubesArray[i] = new Array(s_width)
        for(let j=0;j<s_width;j++){
            const square = new Cube()
            square.x = i;
            square.y = j;
            square.id = counter
            if(minesArr.has(counter))
            {
                square.isMine = true
            }
            cubesArray[i][j] = square
            helper.push(square)
            square.generateCube()
            counter++
        }
    }

    // how many mines around
    counter = 0
    for(let y=0;y<s_height;y++)
    {
        for(let x=0;x<s_width;x++)
        {
            if(x != 0)
            {
                if(cubesArray[x-1][y].isMine == true) counter+=1
                if(y != 0) if(cubesArray[x-1][y-1].isMine == true) counter+=1
                if(y != s_height-1) if(cubesArray[x-1][y+1].isMine == true) counter+=1
            }

            if(y != 0) if(cubesArray[x][y-1].isMine == true) counter+=1
            
            if(x != s_width-1)
            {
                if(cubesArray[x+1][y].isMine == true) counter+=1
                if(y != 0) if(cubesArray[x+1][y-1].isMine == true) counter+=1
                if(y != s_height-1) if(cubesArray[x+1][y+1].isMine == true) counter+=1
            }

            if(y != s_height-1) if(cubesArray[x][y+1].isMine == true) counter+=1
            
            cubesArray[x][y].minesAround = counter
            counter = 0
        }
    }
}


document.getElementById("main_content").addEventListener("click" ,(event)=>{
    cubesReveal(helper[event.target.id])
})



function cubesReveal(cube)
{   
    areYouWinningSon()
    const s_width = document.getElementById("form_width").value
    const s_height = document.getElementById("form_height").value
    if(cube.x != 'undefinded' || cube.y != 'undefinded')
    {
        let x = parseInt(cube.x)
        let y = parseInt(cube.y)
        let checked = (wasChecked.includes(cube.id) == true)? true : false

        if(cube.isMine != true)
        {
            if(cube.minesAround == 0 && checked == true)
            {
             
                wasChecked.splice(wasChecked.indexOf(cube.id),1)
                areYouWinningSon()
             
                // console.log(`--------${cube.id}------------`)
                temporary(x,y,"-1+","-1+",cube)
                temporary(x,y,"-","-",cube)
                temporary(x,y,"-1+","-",cube)
                temporary(x,y,"+","-",cube)
                temporary(x,y,"-","-1+",cube)
                temporary(x,y,"+","-1+",cube)
                temporary(x,y,"-","+",cube)
                temporary(x,y,"-1+","+",cube)
                temporary(x,y,"+","+",cube)
            }
            else if(cube.minesAround != 0 && checked == true){
                document.getElementById(cube.id).style.background = "blue"
                document.getElementById(cube.id).innerText = cube.minesAround
                document.getElementById(cube.id).style.pointerEvents = "none";

                wasChecked.splice(wasChecked.indexOf(cube.id),1)
                areYouWinningSon()
            }
        }
        else{
            alert("PRZEGEAŁEŚ SYNU"); generateSweeper()
        }
    }


} 
        
function temporary(x,y,char1,char2,cube)
{   
    x = eval(`${x}${char1}1`)
    y = eval(`${y}${char2}1`)
    try{  
        areYouWinningSon()
        if(typeof(cubesArray[x][y]) !== 'undefined')
            if(cubesArray[x][y].isMine != true)
            {
                    if(cubesArray[x][y].minesAround == 0 && cubesArray[x][y].isMine != true) document.getElementById(cubesArray[x][y].id).style.background = "yellow"
                    else document.getElementById(cubesArray[x][y].id).style.background = "blue"
             }
            else document.getElementById(cubesArray[x][y].id).style.background = "red"

            document.getElementById(cubesArray[x][y].id).style.pointerEvents = "none";
            cubesReveal(cubesArray[x][y])
    }catch(e){}
}


function areYouWinningSon()
{
    if(wasChecked.length == 10) if(confirm("WYGRAŁEŚ SYNU") == true) generateSweeper()

}



document.getElementById("main_content").addEventListener("mouseup" ,(event)=>{
    if(event.button == 2) 
    {
        document.getElementById(event.target.id)

    }

});
