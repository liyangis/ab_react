import React, {
    Component
} from 'react';
import ReactDOM from 'react-dom';
import logo from './logo.svg';
import './App.css';
class ImgFigure extends Component {
    handleClick(e) {
        if (this.props.arrange.isCenter) {
            this.props.inverse();
        } else {
            //居中
            this.props.center();
        }
        e.stopPropagation();
        e.preventDefault();

    }
    // 对象深拷贝
    copyObj(obj) {
        let res = {}
        for (var key in obj) {
            res[key] = obj[key]
        }
        return res
    }
    render() {
        var styleObj = {};
        //如果指定图片位置，则使用
        if (this.props.arrange.pos) {
            styleObj = this.copyObj(this.props.arrange.pos);
        }
        //判断执行角度旋转
        if (this.props.arrange.rotate) {
            (['MozTransform', 'msTransform', 'WebkitTransform', 'transform']).forEach(function (value) {
                styleObj[value] = 'rotate(' + this.props.arrange.rotate + 'deg)';
            }.bind(this));

        }
        if (this.props.arrange.isCenter) {
            // styleObj.zIndex  = 11;
        }
        var imgFigureClassName = 'img-figure';
        imgFigureClassName += this.props.arrange.isInverse ? ' is-inverse' : '';
        return (<figure className={imgFigureClassName} style={styleObj} onClick={this.handleClick.bind(this)}>
            <img src={this.props.data.imageURL} alt={this.props.data.title} />
            <figcaption>
                <h2 className='img-title'>{this.props.data.title}</h2>
                <div className='img-back' onClick={this.handleClick.bind(this)}>
                    <p>
                        {this.props.data.desc}
                    </p>
                </div>
            </figcaption >
        </figure>
        )
    }
}
// 控制器组件
class ControllerUnit extends Component {
    handleClick(e) {
        e.stopPropagation();
        e.preventDefault();
        // 点击后更改控制按钮状态+执行图片的居中
        if (this.props.arrange.isCenter) {
            this.props.inverse();
        } else {
            this.props.center();
        }

    }
    render() {
        var controllerClassName = 'controller-unit';
        if (this.props.arrange.isCenter) {
            controllerClassName += ' is-center';
        }
        if (this.props.arrange.isInverse) {
            controllerClassName += ' c-is-inverse';
        }
        return (<span className={controllerClassName} onClick={this.handleClick.bind(this)}></span>);
    }

}

class App extends Component {
    //常量，存储取值范围
    Constant = {
        centerPos: {
            left: 0,
            top: 0
        },
        hPosRange: {//左右两边的x,y取值范围
            leftSecX: 30,
            leftSecY: [20, 200],
            rightSecX: 400,
            rightSecY: [20, 200]
        }
    }

    //构造函数
    constructor(props) {
        super(props);
        this.state = {
            imgsArrangeArr: [{
                // pos:{
                //     left:'0',
                //     top:'0'
                // }
            }]
        };
    }
    //翻转选中图片，参数为索引，闭包函数，内return待被执行函数
    inverse(index) {
        return function () {
            var imgsArrangeArr = this.state.imgsArrangeArr;
            imgsArrangeArr[index].isInverse = !imgsArrangeArr[index].isInverse;
            this.setState({ imgsArrangeArr: imgsArrangeArr });
        }.bind(this);
    }
    //重新布局所有图片
    rearrange(centerIndex) {
        //所有图片的集合状态信息
        var imgsArrangeArr = this.state.imgsArrangeArr,
            Constant = this.Constant,
            centerPos = Constant.centerPos,
            hPosRange = Constant.hPosRange,
            hPosRangeLeftSecX = hPosRange.leftSecX,
            hPosRangeLeftSecY = hPosRange.leftSecY,
            hPosRangeRightSecX = hPosRange.rightSecX,
            hPosRangeRightSecY = hPosRange.rightSecY,
            //左侧图片集合
            // leftImgNum = Math.ceil(imgsArrangeArr.length / 2),
            //imgsArrangleLeftArr=[],
            //leftImgSpliceIndex=0,
            imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex, 1);
        //居中
        imgsArrangeCenterArr[0] = {
            pos: centerPos,
            rotate: 0,
            isCenter: true
        };

        for (var i = 0, j = imgsArrangeArr.length, k = j / 2; i < j; i++) {
            var hPosRangeLOR = null;
            //前半部在左边，右半部分在右边
            if (i < k) {
                hPosRangeLOR = { x: hPosRangeLeftSecX, y: hPosRangeLeftSecY };
                imgsArrangeArr[i] = {
                    pos: {
                        left: hPosRangeLOR.x + i * 10,
                        top: (hPosRangeLOR.y)[0] + 40 * i
                    },
                    isCenter: false

                }
            } else {
                hPosRangeLOR = { x: hPosRangeRightSecX, y: hPosRangeRightSecY };
                imgsArrangeArr[i] = {
                    pos: {
                        left: hPosRangeLOR.x + i * 10,
                        top: (hPosRangeLOR.y)[0] + 40 * (i - k)
                    },
                    isCenter: false
                }
            }
            imgsArrangeArr[i].rotate = Math.ceil(30 * Math.random()) * ((Math.random() > 0.5) ? 1 : -1);

        }
        imgsArrangeArr.splice(centerIndex, 0, imgsArrangeCenterArr[0]);
        this.setState({ imgsArrangeArr: imgsArrangeArr });

    }
    //居中选中图片
    centerImage(index) {
        return function () {
            this.rearrange(index);
        }.bind(this);
    }
    //未执行
    getInitialState() {
        return {
            imgsArrangeArr: [{
                // pos:{
                //     left:'0',
                //     top:'0'
                // }
            }]
        }
    }
    //组件加载后，计算位置的范围
    componentDidMount() {
        //舞台大小
        var stageDOM = ReactDOM.findDOMNode(this.refs.stage),
            stageW = stageDOM.scrollWidth,
            stageH = stageDOM.scrollHeight,
            halfStageW = Math.ceil(stageW / 2),
            halfstageH = Math.ceil(stageH / 2);
        //imgFureDOM
        var imgFigureDOM = ReactDOM.findDOMNode(this.refs.imgFigure0),
            imgW = imgFigureDOM.scrollWidth,
            imgH = imgFigureDOM.scrollHeight,
            halfImgW = Math.ceil(imgW / 2),
            halfImgH = Math.ceil(imgH / 2);
        //计算中心图片的位置点
        this.Constant.centerPos = {
            left: halfStageW - halfImgW,
            top: halfstageH - halfImgH
        };
        // //计算左侧，右侧区域图片排布位置的取值范围
        // this.Constant.hPosRange.lefSecX[0]=-halfImgW;
        // this.Constant.hPosRange.lefSecX[1]=halfStageW-halfImgW*3;
        // this.Constant.hPosRange.rightSecX[0]=halfStageW-halfImgW;
        // this.Constant.hPosRange.rightSecX[1]=stageW-halfImgW;
        this.Constant.hPosRange.leftSecX = Math.ceil(stageW / 6) - halfImgW;
        this.Constant.hPosRange.leftSecY = [20, 200];
        this.Constant.hPosRange.rightSecX = Math.ceil(stageW / 6 * 5) - halfImgW;
        this.Constant.hPosRange.rightSecY = [20, 200];


        this.rearrange(0);//默认居中第一张图片
    }
    render() {
        var imageDatas = [{
            "fileName": "1.jpg",
            "title": "test1",
            "desc": "详细信息1",
        }, {
            "fileName": "2.jpg",
            "title": "test2",
            "desc": "详细信息2",
        }, {
            "fileName": "3.jpg",
            "title": "test3",
            "desc": "详细信息3",
        }, {
            "fileName": "4.jpg",
            "title": "test4",
            "desc": "详细信息4",
        }, {
            "fileName": "5.jpg",
            "title": "test5",
            "desc": "详细信息5",
        }, {
            "fileName": "6.jpg",
            "title": "test6",
            "desc": "详细信息6",
        }, {
            "fileName": "7.jpg",
            "title": "test7",
            "desc": "详细信息7",
        }]; //require('./data/imageDatas.json');
        var imageDataArr = [];

        for (var i = 0; i < imageDatas.length; i++) {
            var singleImage = imageDatas[i];
            singleImage.imageURL = './images/' + singleImage.fileName;
            imageDataArr[i] = singleImage;
        }
        var controllerUints = [], imgFigures = [];
        // for (var j = 0; j < imageDataArr.length; j++) {
        //      imgFigures.push( <ImgFigure data={imageDataArr[j]} ref={'imgFigure'+j} arrange={this.state.imgsArrangeArr[j]}/>);
        //     }

        imageDataArr.forEach(function (element, index) {
            if (!this.state.imgsArrangeArr) {
                this.state.imgsArrangeArr = {};
            }
            if (!this.state.imgsArrangeArr[index]) {
                this.state.imgsArrangeArr[index] = {
                    pos: {
                        left: 0,
                        top: 0
                    },
                    rotate: 0,
                    isInverse: false,//是否翻转
                    isCenter: false,//是否居中状态
                };
            }
            imgFigures.push(<ImgFigure key={index} data={element} ref={'imgFigure' + index} arrange={this.state.imgsArrangeArr[index]}
                inverse={this.inverse(index)} center={this.centerImage(index)} />);
            controllerUints.push(<ControllerUnit key={index} arrange={this.state.imgsArrangeArr[index]}  inverse={this.inverse(index)} center={this.centerImage(index)} />);
        }.bind(this));

        return (
            //   <div className="App">
            //     <header className="App-header">
            //       <img src={logo} className="App-logo" alt="logo" />
            //       <h1 className="App-title">Welcome to React</h1>
            //       <h2>欢迎来到React世界</h2>
            //     </header>
            //     <p className="App-intro">
            //       想要开始, 编辑 <code>src/App.js</code> 保存然后重新加载.
            //     </p>
            //   </div>
            <section className='stage' ref='stage'>
                <section className='img-sec' >{imgFigures}</section>
                <nav className='controller-nav'>{controllerUints} </nav >
            </section>

        );
    }

}

export default App;