let minesArr = new Set()
let cubesArray,helper, wasChecked = new Array()
let interval,firstClick,s_width,s_height,mines,nick = 0
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

function validation()
{
    s_width = parseInt(document.getElementById("form_width").value)
    s_height = parseInt(document.getElementById("form_height").value)
    mines = parseInt(document.getElementById("form_mines").value)
    nick = document.getElementById("form_nick").value

    if(nick.length == 0 || s_width <= 0 || s_height <=0 || mines <= 2)
    {
        interval = clearInterval(interval)
        alert("mordo, złe dane")
    }else generateSweeper()

}


function generateSweeper(){

    const temp = s_width*s_height;

    // generate grid with exact same width and height as cubes
    document.getElementById("main_nav").style.width = `${s_width*50}px`
    document.getElementById("main_content").style.width = `${s_width*50}px`
    document.getElementById("main_content").style.height = `${s_height*50}px`

    document.getElementById("main_content").style.gridTemplateColumns = `repeat(${s_width}, 50px)`
    document.getElementById("main_content").style.gridTemplateRows = `repeat(${s_height},50px)`
    
    // document.getElementById("leaderboard").style.height = document.getElementById("main_content").style.height 
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
    document.getElementById("main_content").style.pointerEvents = "all"
    helper = []
    wasChecked = []
    firstClick = 0
    cubesArray = []
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
    let counter = 0
    
    // fill cubes tab
    cubesArray = new Array(s_height)
    for(let i=0;i<s_height;i++)
    {
        cubesArray[i] = new Array(s_width)
        for(let j=0;j<s_width;j++)
        {
            const square = new Cube()
            square.x = i
            square.y = j
            square.id = counter
            if(minesArr.has(counter)) square.isMine = true
            cubesArray[i][j] = square
            helper.push(square)
            square.generateCube()
            document.getElementById(counter).style.pointerEvents = "all"
            counter++
        }

    }

    counter = 0
    for(let x=0;x<s_height;x++)
    {
        for(let y=0;y<s_width;y++)
        {
            if(x != 0)
            {
                if(cubesArray[x-1][y].isMine == true) counter+=1
                if(y != 0) if(cubesArray[x-1][y-1].isMine == true) counter+=1
                if(y != s_width-1) if(cubesArray[x-1][y+1].isMine == true) counter+=1
            }
            
            if(y != 0) if(cubesArray[x][y-1].isMine == true) counter+=1
            
            if(x !== s_height-1)
            {
                if(cubesArray[x+1][y].isMine == true) counter+=1
                if(y != 0) if(cubesArray[x+1][y-1].isMine == true) counter+=1
                if(y != s_width-1) if(cubesArray[x+1][y+1].isMine == true) counter+=1
            }
            
            if(y != s_width-1) if(cubesArray[x][y+1].isMine == true) counter+=1
            
            cubesArray[x][y].minesAround = counter
            counter = 0
        }
    }
}


document.getElementById("main_content").addEventListener("click" ,(event)=>{
    if(event.target.id != "main_content") cubesReveal(helper[event.target.id])
})

function cubesReveal(cube)
{   
    areYouWinningSon()
    if(cube != 'undefinded')
    {
        let x = parseInt(cube.x)
        let y = parseInt(cube.y)
        let checked = (wasChecked.includes(cube.id) == true)? true : false

        if(cube.isMine ==  false)
        {
            if(cube.minesAround == 0 && checked == true)
            {
                wasChecked.splice(wasChecked.indexOf(cube.id),1)
                
                if(x != 0)
                {
                    if(cubesArray[x-1][y] != 'undefinded') fill((x-1),(y))
                    if(y != 0) if(cubesArray[x-1][y-1] != 'undefinded') fill((x-1),(y-1))
                    if(y != s_width-1) if(cubesArray[x-1][y+1] != 'undefinded') fill((x-1),(y+1))
                }
    
                if(y != 0) if(cubesArray[x][y-1] != 'undefinded') fill(x,(y-1))
                
                if(x != s_height-1)
                {
                    if(cubesArray[x+1][y] != 'undefinded') fill((x+1),y)
                    if(y != 0) if(cubesArray[x+1][y-1] != 'undefinded') fill((x+1),(y-1))
                    if((y != s_width-1) && (x != s_height-1)) if(cubesArray[x+1][y+1] != 'undefinded') fill((x+1),(y+1))
                }

                if(y != s_width-1) if(cubesArray[x][y+1] != 'undefinded') fill((x),(y+1))

            }
            else if(checked == true && cube.minesAround != 0){
                document.getElementById(cube.id).style.pointerEvents = "none"
                document.getElementById(cube.id).style.background = "blue"
                document.getElementById(cube.id).innerText = cube.minesAround

                wasChecked.splice(wasChecked.indexOf(cube.id),1)
            }
            areYouWinningSon()
        }
        else endGame()
    }

}


function fill(x,y)
{
        if(cubesArray[x][y].minesAround == 0) 
        {
            document.getElementById(cubesArray[x][y].id).style.background = "yellow"

        }
        if(cubesArray[x][y].minesAround !=0){
            document.getElementById(cubesArray[x][y].id).style.pointerEvents = "none"
            document.getElementById(cubesArray[x][y].id).style.background = "blue"
            document.getElementById(cubesArray[x][y].id).innerText = cubesArray[x][y].minesAround

        }
        cubesReveal(cubesArray[x][y])
}
        
function areYouWinningSon()
{
    if(wasChecked.length == 10) 
    {
        // if(confirm("WYGRAŁEŚ SYNU") == true) generateSweeper()
        // else 
        document.getElementById("main_content").style.pointerEvents = "none"
        interval = clearInterval(interval)

        minesArr.forEach(element => {
            document.getElementById(element).style.background = "red"
        });
        alert("siema wygrałeś")
    }

}
function endGame()
{
    interval = clearInterval(interval)
    alert("siema przegrałeś")

    minesArr.forEach(element => {
        document.getElementById(element).style.background = "red"
    });


}


document.getElementById("main_content").addEventListener("mouseup" ,(event)=>{
//event.path[0]
        if((event.which == 3) || (event.path[0].id != "main_content"))
        {
            
            if(wasChecked.includes([event.path[0].id]))
            {
                event.path[0].classList.toggle("flag")
        
            }
        }
});
