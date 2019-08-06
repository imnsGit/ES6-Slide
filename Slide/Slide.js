/**
 * by NATURAL SELECTION
 * 
 * 2019/8/6
 * 
 * 参数介绍
 * 
 * Slide(基类)(万物始于此处)(不推荐new)(没加限制，可以强行new)....
 *
 * Banner({
 *   slidebox：滑动组件元素     (#xxx,.xxx,xxx)
 *   Goton：控制元素  ---->  n-n    (#xxx,.xxx,xxx)
 *   Gotont：控制元素  ---->  next,prev     (#xxx,.xxx,xxx)
 *
 *   step: 准备一页放几个(1)       (1/3)表示一页放3个，但是不得超过总数量  (1/n)
 *   active：自定义激活的类名(active) (假如需要特殊效果可以自己写)  string
 *   autoPlay：自动播放(false)    (true,fasle)
 *   direction：轮播方式(0)    参数---> 0 row   |   1 column    (0,1)
 *   Delay：事件间隔(3000)
 * })
 *
 * Tab({
 *   slidebox：滑动组件元素     (#xxx,.xxx,xxx)
 *   Goton：控制元素  ---->  n-n    (#xxx,.xxx,xxx)
 *   active：自定义激活的类名 (假如需要特殊效果可以自己写)  string
 * })
 *
 */

class Slide {
    constructor(config) {
        this.slidebox = document.querySelectorAll(config.slidebox)[0]; //滑动盒子
        this.slideFloor = this.slidebox.children[0]; //滑动页
        this.slidePages = this.slideFloor.children; //滑动页组

        if (config.Goton) {
            this.Goton = document.querySelectorAll(config.Goton)[0]; // 控制
            this.GotonList = this.Goton.children; //  控制列
        }

        if (config.Gotont) {
            this.Gotont = document.querySelectorAll(config.Gotont)[0];
            this.Gotoprev = this.Gotont.children[0]; // 控制
            this.Gotonext = this.Gotont.children[1]; // 控制
        }

        //当前状态
        this.current = config.start || 0;
        //记录上一步
        this.previous = 0;
    }

    next(num) {
        this.previous = this.current;
        this.current++;
        this.limit(num);
        console.log(this.previous, this.current);
    }

    prev(num) {
        this.previous = this.current;
        this.current--;
        this.limit(num);
    }

    goton(index) {
        this.previous = this.current;
        this.current = index;
        console.log(this.previous, index, this.current);
    }

    limit(num) {
        //  最小为0
        // console.log(num);
        if (num < 0) {
            throw new Error("step The parameters are incorrect! \nPlease check the number of page child elements");
        }
        //计算最大步数
        if (this.current <= 0 || this.current > num) {
            this.current = 0;
        }
    }
}

class Banner extends Slide {
    constructor(config) {
        super(config);

        this.direction = config.direction || 0; // 0 row   |   1 column      方向
        this.posNeg = config.posNeg || 0; // 0 0-n   |   1 n-0         正反  【未完成】

        this.step = config.step || 1; //步长

        this.astep = 0; //一步的步长

        this.num = 0; //步长数量

        this.activeclass = config.active || false; //激活类的类名

        this.autoRun = config.autoPlay || false; //自动运行

        this.timer = null; //定时器

        this.Delay = config.delay || 3000; //定时器延时

        this.WIDTH = this.slidebox.offsetWidth; //长
        this.HEIGHT = this.slidebox.offsetHeight; //宽
        this.LENGTH = this.slidePages.length; //数量

        this.init(this.WIDTH, this.HEIGHT, this.LENGTH); //初始化准备运行
    }

    init(WIDTH, HEIGHT, LENGTH) {
        this.initSizeAndLength(WIDTH, HEIGHT, LENGTH); //初始化元素 大小 数量
        this.limit(this.num); //初始化当前最大步数
        this.onreSize(WIDTH, HEIGHT, LENGTH); //浏览器窗体带下发生改变时重置

        this.Update(); //初始化更新器配置
        this.click(this.num, this.Delay); //开启点击事件
        this.autoPlay(this.num, this.Delay); //自动运行
    }

    reSize(WIDTH, HEIGHT, LENGTH) {
        console.log(111);
        WIDTH = this.slidebox.offsetWidth; //长
        HEIGHT = this.slidebox.offsetHeight; //宽
        LENGTH = this.slidePages.length; //数量
        this.initSizeAndLength(WIDTH, HEIGHT, LENGTH); //初始化元素 大小 数量
    }

    initSizeAndLength(WIDTH, HEIGHT, LENGTH) {
        if (this.direction === 0) {
            // console.log(LENGTH);
            this.slideFloor.style.width = WIDTH * LENGTH * this.step + "px";
            this.astep = this.step * WIDTH;
        }

        if (this.direction === 1) {
            this.slideFloor.style.height = HEIGHT * LENGTH * this.step + "px";
            this.astep = this.step * HEIGHT;
        }

        //为初始化limit做准备，计算最大值
        /*
            步长 1/2

            每页走两步，初始为两步

            假如初始为3页

            计算最大步数为  1
            
            LENGTH - num    -->     3 - 2  = 1  
            
            2为一个大页分为2个小页面(1/2)( 指步长 this.step)，即是2个子页，初始为3页，那么最多走 1页
        */
        this.num = LENGTH - Math.floor(100 / (this.step * 100));

        //判断控制节点是否存在，不存在几句创建出对应的节点
        if (this.Goton) {
            if (this.GotonList.length === 0) {
                for (let index = 0, array = this.num; index <= array; index++) {
                    const element = document.createElement("div");
                    this.Goton.appendChild(element);
                }
            }
        }
    }

    onreSize(WIDTH, HEIGHT, LENGTH) {
        window.onresize = () => {
            console.log(window.innerWidth);
            this.reSize(WIDTH, HEIGHT, LENGTH);
        };
    }

    runSlide() {
        const site = this.astep * this.current;
        if (this.direction === 0) {
            if (this.posNeg === 0) {
                this.slideFloor.style.transform = `translate3d(-${site}px, 0px, 0px)`;
            }
            if (this.posNeg === 1) {
                this.slideFloor.style.transform = `translate3d(${site}px, 0px, 0px)`;
            }
        }

        if (this.direction === 1) {
            if (this.posNeg === 0) {
                this.slideFloor.style.transform = `translate3d( 0px,-${site}px, 0px)`;
            }
            if (this.posNeg === 1) {
                this.slideFloor.style.transform = `translate3d( 0px,${site}px, 0px)`;
            }
        }
    }

    activeClass() {
        if (this.activeclass) {
            this.slidePages[this.previous].classList.remove(this.activeclass);
            this.slidePages[this.current].classList.add(this.activeclass);

            if (this.Goton) {
                this.GotonList[this.previous].classList.remove(this.activeclass);
                this.GotonList[this.current].classList.add(this.activeclass);
            }
        }
    }

    click(num, Delay) {
        const operateUpdata = () => {
            //防止乱跳
            if (this.autoRun) {
                clearInterval(this.timer);
                this.autoPlay(num, Delay);
            }
            this.Update();
        };

        if (this.Goton) {
            for (let index = 0, array = this.GotonList; index < array.length; index++) {
                const element = array[index];
                element.onclick = () => {
                    this.goton(index);
                    operateUpdata();
                };
            }
        }

        if (this.Gotont) {
            this.Gotonext.onclick = () => {
                this.next(num);
                operateUpdata();
            };

            this.Gotoprev.onclick = () => {
                this.prev(num);
                operateUpdata();
            };
        }
    }

    autoPlay(num, Delay) {
        if (this.autoRun) {
            this.timer = setInterval(() => {
                this.next(num);
                this.Update();
            }, Delay);
        }
    }

    Update() {
        this.activeClass();
        this.runSlide();
    }
}

class Tab extends Slide {
    constructor(config) {
        super(config);
        this.activeclass = config.active; //激活类的类名
        this.Event = config.Event || "click";
        this.init();
    }

    init() {
        this.Update();
        this.initLength();
        this.onEvent();
    }

    initLength() {
        if (this.GotonList.length !== this.slidePages.length) {
            const difference = this.GotonList.length - this.slidePages.length;
            const Redundant = Math.abs(difference);
            if (this.GotonList.length - this.slidePages.length < 0) {
                if (Redundant == 1) {
                    throw new Error(`Redundant ${Redundant} page, please check!`);
                }
                throw new Error(`Redundant ${Redundant} pages, please check!`);
            } else {
                if (Redundant == 1) {
                    throw new Error(`Lost ${Redundant} page, please check!`);
                }
                throw new Error(`Lost ${Redundant} pages, please check!`);
            }
        }
    }

    activeClass() {
        this.slidePages[this.previous].classList.remove(this.activeclass);
        this.slidePages[this.current].classList.add(this.activeclass);

        this.GotonList[this.previous].classList.remove(this.activeclass);
        this.GotonList[this.current].classList.add(this.activeclass);
    }
    onEvent() {
        if (this.Goton) {
            for (let index = 0, array = this.GotonList; index < array.length; index++) {
                const element = array[index];
                element.addEventListener(
                    this.Event,
                    () => {
                        this.goton(index);
                        this.Update();
                    },
                    false
                );
            }
        }
    }

    Update() {
        this.activeClass();
    }
}
