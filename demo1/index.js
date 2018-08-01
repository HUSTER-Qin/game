var _v0 = 500;
var _time = 0.005;
var _g = 1200;
var _tnow = 0;
var Game = function (params) {
    this.jump = false
    this.imgs = ['./images/Mario_0.png', './images/mid_bgW1.png', './images/mid_cao.png','./images/03.png','./images/09.png','./images/17.png','./images/21.png','./images/22.png'];
    this.speed = 4; // px
    this.time = 10000; // 毫秒
    this.rate = 20; //毫秒
    this.screen = 0; // 画布的宽
    this.goods = []; // 物品数组
    this.caoh = 0;
    this.enemyIndex = 0,
    this.gameStatus = true
    this.maxHeight = 200;
    // this.goodsHeight =[];
    this.interval = null
    this.drawBackgound = function () {
        var clienth = clientH()
        var clientw = clientW()
        this.caoh = getStyle($('.cao'), 'height')
        // this.goodsHeight = [caoh,]
        this.screen = Math.ceil(((this.time / this.rate) * this.speed) / clientw) * clientw + clientw
        $('.bg').style.height = clienth - this.caoh + 'px'
        setStyle($('.map'), 'width', this.screen)
        setStyle($('.person'), 'bottom', this.caoh)
        setStyle($('.person'), 'left', this.caoh)

    }
    this.setScreen = function () {
            // alert(2)
            var screenNum = Math.ceil(this.screen / clientW()) - 1
       
            for (var index = 0; index < screenNum; index++) {

                this.goods = this.goods.concat(this.randomEnemy(index))
                // debugger
            }
           
            this.goods.sort(function name(a,b) {
                return a.left-b.left
            })
             console.log(this.goods, 'ff')
            for (let i = 0; i < this.goods.length; i++) {
                $('.bg').appendChild(this.createDiv(this.goods[i]))
            }
        },
        this.createDiv = function (item) {
            var oDiv = document.createElement("div");
            oDiv.className = item.class+' enemy'
            oDiv.style.left = item.left
            oDiv.style.bottom = item.top
            // oDiv.innerHTML = item.html
            oDiv.style.position = 'absolute'
            return oDiv
        }
}
Game.prototype = {
    init() {
        this.drawBackgound()
        this.setScreen()
        this.loop()
        this.Listener()
    },
    loading: function () {
        var iNow = 0;
        var This = this;
        for (var i = 0; i < this.imgs.length; i++) {
            imgLoad(this.imgs[i], function () {
                iNow++;
                if (iNow == This.imgs.length) {
                    This.init();
                }
            });
        }
    },
    gamePause() {
        // e.stopPropagation()
        // console.log(this.gameStatus)
        if (this.gameStatus) {
            clearInterval(this.interval)
        } else {
            this.loop()
        }
        this.gameStatus = !this.gameStatus
    },
    gameResize() {
        this.gamePause.bind(this)
        // this.drawBackgound()
        // this.setScreen()
    },
    Listener() {
        $('.pause').addEventListener('touchstart', this.gamePause.bind(this), false)
        window.addEventListener("resize", this.gameResize.bind(this), false);
        window.addEventListener("touchstart", this.jumpPerson.bind(this), false);
    },
    loop() {
        var _this = this
        
        this.interval = setTimeout(function () {
            // var left =  getStyle($('.map'),'transform').replace(/[^0-9\-,]/g,'').split(',')[4]
            var left = getStyle($('.map'), 'left')
            _this.time -= _this.rate
            if (_this.time / 1000 < 0.01) {
                clearInterval(_this.interval)
                return
            } else {
                clearInterval(_this.interval)
                _this.loop()
            }
            document.title = (_this.time / 1000)
            $('.map').style.left = left - _this.speed + 'px'
            $('.person').style.left = -left + _this.speed + 30 + 'px'
            if(_this.jump) _this.JumpP()
            _this.pz(document.querySelectorAll('.enemy')[_this.enemyIndex],$('.person'))
        }, _this.rate)

    },
    elePosition(person) {
        // console.log(getStyle(person, 'left'),getStyle($('.cao'), 'height'))
        // debugger
        return {
            left: getStyle(person, 'left'),
            left2: getStyle(person, 'left') + getStyle(person, 'width'),
            bottom: getStyle(person, 'bottom'),
            bottom2: getStyle(person, 'bottom') + getStyle(person, 'height'),
        }
    },
    next(person,enemy){
        var goods = this.goods
        for (let index = 0; index < goods.length; index++) {
            const element = goods[index];
            
        }
        if(person>enemy){
            this.enemyIndex++
        }
    },
    // 碰撞
    pz(enemy, person) {
        var enemy_pos = this.elePosition(enemy)
        var person_pos = this.elePosition(person)
        console.log(person_pos.left,enemy_pos.left2)
        if(person_pos.left>enemy_pos.left2){
            if(this.enemyIndex==this.goods.length-1){
                this.enemyIndex = this.goods.length-1
            }else{
        //    debugger
                this.enemyIndex++
            }
            
        }
        console.log(this.enemyIndex, 'index')
        if(person_pos.left2>=enemy_pos.left&&person_pos.left<=enemy_pos.left2&&person_pos.bottom2>=enemy_pos.bottom&&person_pos.bottom<=enemy_pos.bottom2){
            // alert('碰撞')
            console.log(this.enemyIndex)
            enemy.parentNode.removeChild(enemy);
            // this.enemyIndex++
        }

    },
    randomEnemy(i) {
        var _goods = []
        // 当前屏的最大值  最小值
        var postion = {
            min: clientW() * i,
            max: clientW() * (i + 1)
        }
        // 随机距离 left  getRandom(0,(postion.max-postion.min))
        // console.log(leftW)
        // 物品个数
        var num = getRandom(4, 8)
        for (let index = 0; index < num; index++) {
            var goods_pos = getRandom(1, 6)
            var topH = getRandom(1, 3) * this.caoh
            // var leftW = getRandom(postion.min, postion.max)
            var leftW = getRandom(postion.min+clientW()*index/num,postion.min+clientW()*(index+1)/num)
            _goods.push({
                html:i,
                class: 'maptype-' + goods_pos,
                left: leftW+5,
                top: topH
            })
            // console.log(_goods)
        }
        // debugger
        return _goods
    },
    JumpP(){
        var _initTop = this._initTop
        _tnow +=  this.rate/1000;
        var _topTime = _v0 * _tnow - (1 / 2) * _g * _tnow * _tnow;
        var top = _initTop + _topTime;
        if (top <= _initTop) {
            top = _initTop;
            this.jump = false
            _tnow = 0
            // clearInterval(interval);
        }
        // debugger
        // console.log(_initTop,_tnow,_topTime,top)
        // debugger
        setStyle($('.person'), 'bottom', top)
    },
    jumpPerson() {
        if(this.jump) return
        // alert(5)
        this.jump = true
        this._initTop = getStyle($('.person'), 'bottom') - 0
        // var obj = this;
        // clearInterval(interval);
        // var _v0 = 500;
        // var _time = 0.005;
        // var _g = 1200;
        // var _tnow = 0;
        // var _initTop = getStyle($('.person'), 'bottom') - 0
        // var interval = setInterval(function () {
        //     _tnow += _time;
        //     var _topTime = _v0 * _tnow - (1 / 2) * _g * _tnow * _tnow;
        //     var top = _initTop + _topTime;
        //     if (top <= _initTop) {
        //         top = _initTop;
        //         clearInterval(interval);
        //     }
        //     // console.log(_initTop,_tnow,_topTime,top)
        //     // debugger
        //     setStyle($('.person'), 'bottom', top)
        //     if (parseInt(_tnow) == 1) {
        //         // obj.state = true;

        //     }
        // }, _time + "s");
    },
    drawPerson() {
        // 
    }
}