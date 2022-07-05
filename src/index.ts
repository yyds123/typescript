import './style/index.less'

//定义food类
class Food{
    element:HTMLElement
    constructor() {
        this.element = document.querySelector('#food')! //!起到断言的作用
    }
    get X(){
        return this.element.offsetLeft
    }
    get Y(){
        return this.element.offsetTop
    }
    //不能生成在贪吃蛇身体内
    change(bodies:HTMLCollection){
        let x = Math.floor(29*Math.random())*10
        let y = Math.floor(29*Math.random())*10
        while (!this.check(bodies,x,y)){
            x = Math.floor(29*Math.random())*10
            y = Math.floor(29*Math.random())*10
        }
        x = x==0?x+10:x
        x = x==290?x-10:x
        y = y==0?y+10:y
        y = y==290?y-10:y
        this.element.style.left = x+'px'
        this.element.style.top = y+'px'
    }
    check(bodies:HTMLCollection,x:number,y:number){
        for(let i=0;i<bodies.length;i++){
            if (x==(bodies[i] as HTMLElement).offsetLeft&&y==(bodies[i] as HTMLElement).offsetTop){
                return false
            }
        }
        return true
    }
}
//定义计分板类
class ScorePanel{
    score = 0
    level = 1
    maxNumber:number
    scoreTolevel:number
    scoreEle:HTMLElement
    levelEle:HTMLElement
    constructor(maxNumber:number=10,scrolTolevel:number=10) {
        this.scoreEle = document.querySelector('#score')!
        this.levelEle = document.querySelector('#level')!
        this.maxNumber = maxNumber
        this.scoreTolevel = scrolTolevel
    }
    addScore(){
        this.scoreEle.innerHTML = ++this.score+''
        if(this.score%this.scoreTolevel===0){
            this.levelUp()
        }
    }
    levelUp(){
        if(this.level<this.maxNumber){
            this.levelEle.innerHTML = ++this.level+''
        }
    }
}
//定义贪吃蛇
class Snake{
    snake:HTMLElement;
    head:HTMLElement;
    bodies:HTMLCollection;
    constructor() {
        this.snake = document.getElementById('snake')!
        this.head = this.snake.querySelectorAll('div')[0]
        this.bodies = this.snake.getElementsByTagName('div')
    }
    get X(){
        return this.head.offsetLeft
    }
    get Y(){
        return this.head.offsetTop
    }
    set X(val){
        //判断是否更改了横坐标，若没有更改则不做替换操作
        if(this.X == val){
            return;
        }
        //判断是否撞墙
        if(val<0||val>290){
            throw new Error('游戏结束')
        }
        //判断是否逆向运动
        if(this.bodies[1]&&(this.bodies[1] as HTMLElement).offsetLeft==val){
            if(val>this.X){
                val = this.X-10
            }
            else{
                val = this.X+10
            }
        }
        this.movebody()
        this.head.style.left = val+'px'
        this.checkHeadBody()
    }
    set Y(val){
        if(this.Y == val){
            return;
        }
        if(val<0||val>290){
            throw new Error('游戏结束')
        }
        if(this.bodies[1]&&(this.bodies[1] as HTMLElement).offsetTop==val) {
            if (val > this.Y) {
                val = this.Y - 10
            } else {
                val = this.Y + 10
            }
        }
        this.movebody()
        this.head.style.top = val+'px'
        this.checkHeadBody()
    }
    addBody(){
        this.snake.insertAdjacentHTML('beforeend',"<div></div>")
    }
    movebody(){
        for (let i = this.bodies.length-1;i>0;i--){
            let x = (this.bodies[i-1] as HTMLElement).offsetLeft;
            let y = (this.bodies[i-1] as HTMLElement).offsetTop;
            (this.bodies[i] as HTMLElement).style.left = x+'px';
            (this.bodies[i] as HTMLElement).style.top = y+'px';
        }
    }
    //检查头和身体是否相撞
    checkHeadBody(){
        for (let i = 1;i<this.bodies.length;i++){
            let x = (this.bodies[i] as HTMLElement).offsetLeft;
            let y = (this.bodies[i] as HTMLElement).offsetTop;
            if (this.X==x&&this.Y==y){
                throw new Error('游戏结束')
            }
        }
    }
}
//控制游戏
class GameControl{
    food:Food
    score:ScorePanel
    snake:Snake
    direction:string = ''
    isLive = true
    constructor() {
        this.food = new Food()
        this.score = new ScorePanel(10,1)
        this.snake = new Snake()
        this.init()
    }
    //初始化
    init(){
        this.isLive = true
        //更改移动方向
        document.addEventListener("keydown", this.handlerKeyDown.bind(this))
        this.run()
    }
    handlerKeyDown(event:KeyboardEvent){
        this.direction = event.key//key会显示按键名称
    }
    //贪吃蛇移动
    /*
    向上 top  减少
    向下 top  增加
    向左 left  减少
    向右 right 增加
     */
    run(){
        let x = this.snake.X
        let y = this.snake.Y
        switch (this.direction) {
            case 'ArrowUp':
            case 'Up':
                y-=10;
                break
            case 'ArrowDown':
            case 'Down':
                y+=10;
                break
            case 'ArrowLeft':
            case 'Left':
                x-=10;
                break
            case 'ArrowRight':
            case 'Right':
                x+=10;
                break
        }
        this.checkEat(x,y)
        try{
            this.snake.X = x
            this.snake.Y = y
        }catch (e:any){
            this.isLive = false
            alert(e.message)
        }
        this.isLive&&setTimeout(this.run.bind(this),300-(this.score.level-1)*30)
    }
    checkEat(x:number,y:number){
        if (this.food.X==x&&this.food.Y==y){
            this.score.addScore()
            this.snake.addBody()
            this.food.change(this.snake.bodies)
        }
    }
}

new GameControl()
// setInterval(function () {
//     food.change()
//     console.log(food.getX(),food.getY())
// },1000)