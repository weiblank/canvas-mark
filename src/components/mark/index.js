/**
 * @function Draw 绘制组件
 * @param {Number} width 画布的宽
 * @param {Number} height 画布的高
 * @param {Number} brushRadius 笔刷的大小
 * @param {String} color 笔刷的颜色
 * @param {String} imgSrc 背景图的地址
 * @param {String} type 绘制的类型
 * @param {String} fileName 二进制图片的文件名
 */
import React, {
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef,
  useState,
} from "react";
import Png from "./two.jpeg";
const Draw = (
  { width, height, brushRadius, color, imgSrc, type, fileName },
  ref
) => {
  let [deg] = useState(0);
  let coordinateConfig = {
    startPointX: 0,
    startPointY: 0,
    endPointX: 0,
    endPointY: 0,
  };
  const canvasElem = useRef();
  const hiddenElem = useRef();
  let writingCtx;
  let hiddenCtx;
  let isDrawingShape = false;
  let coordinateScaleX;
  let coordinateScaleY;
  let mouseDownX;
  let mouseDownY;

  const drawRect = (e) => {
    const { offsetX, offsetY } = e;
    const positionX = mouseDownX / coordinateScaleX;
    const positionY = mouseDownY / coordinateScaleY;
    const dataX = (offsetX - mouseDownX) / coordinateScaleX;
    const dataY = (offsetY - mouseDownY) / coordinateScaleY;
    coordinateConfig = {
      startPointX: positionX,
      startPointY: positionY,
      endPointX: dataX,
      endPointY: dataY,
    };
    writingCtx.clearRect(0, 0, width, height);
    writingCtx.beginPath();
    writingCtx.strokeRect(positionX, positionY, dataX, dataY);
  };

  const drawCircle = (e) => {
    const { offsetX, offsetY } = e;
    const rx = (offsetX - mouseDownX) / 2;
    const ry = (offsetY - mouseDownY) / 2;
    const radius = Math.sqrt(rx * rx + ry * ry);
    const centreX = rx + mouseDownX;
    const centreY = ry + mouseDownY;
    writingCtx.clearRect(0, 0, width, height);
    writingCtx.beginPath();
    writingCtx.arc(
      centreX / coordinateScaleX,
      centreY / coordinateScaleY,
      radius,
      0,
      Math.PI * 2
    );
    writingCtx.stroke();
  };

  const drawEllipse = (e) => {
    const { offsetX, offsetY } = e;
    const radiusX = Math.abs(offsetX - mouseDownX) / 2;
    const radiusY = Math.abs(offsetY - mouseDownY) / 2;
    const centreX =
      offsetX >= mouseDownX ? radiusX + mouseDownX : radiusX + offsetX;
    const centreY =
      offsetY >= mouseDownY ? radiusY + mouseDownY : radiusY + offsetY;
    const positionX = centreX / coordinateScaleX;
    const positionY = centreY / coordinateScaleY;
    const dataX = radiusX / coordinateScaleX;
    const dataY = radiusY / coordinateScaleY;
    writingCtx.clearRect(0, 0, width, height);
    writingCtx.beginPath();
    writingCtx.ellipse(positionX, positionY, dataX, dataY, 0, 0, Math.PI * 2);

    writingCtx.stroke();
  };

  const handleMouseDown = (e) => {
    isDrawingShape = true;
    if (canvasElem.current !== undefined) {
      coordinateScaleX = canvasElem.current.clientWidth / width;
      coordinateScaleY = canvasElem.current.clientHeight / height;
    }
    writingCtx.lineWidth = brushRadius / coordinateScaleX;
    writingCtx.strokeStyle = color;
    const { offsetX, offsetY } = e;
    console.log(offsetX, offsetY, offsetX, offsetY);
    mouseDownX = coordinateConfig.startPointX || offsetX;
    mouseDownY = coordinateConfig.startPointY || offsetY;
  };

  const handleMouseMove = (e) => {
    if (isDrawingShape) {
      switch (type) {
        case "square":
          drawRect(e);
          break;
        case "circle":
          drawCircle(e);
          break;
        case "ellipse":
          drawEllipse(e);
          break;
        default:
          console.log("no type");
      }
    }
  };

  const handleMouseUp = () => {
    isDrawingShape = false;
    writingCtx.save();
  };

  const base64toFile = (dataurl) => {
    const arr = dataurl.split(",");
    const mime = arr[0].match(/:(.*?);/)[1];
    const suffix = mime.split("/")[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], `${fileName}.${suffix}`, {
      type: mime,
    });
  };

  useImperativeHandle(ref, () => ({
    getFile() {
      hiddenCtx.drawImage(canvasElem.current, 0, 0);
      const result = base64toFile(hiddenElem.current.toDataURL());
      return result;
    },
    getDataURL() {
      return getDataURL();
    },
  }));

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    writingCtx = canvasElem.current.getContext("2d");
    // eslint-disable-next-line react-hooks/exhaustive-deps
    hiddenCtx = hiddenElem.current.getContext("2d");
    const img = new Image();
    img.src = Png;
    img.crossOrigin = "anonymous";
    img.onload = function () {
      img.width = width;
      img.height = height;
      hiddenCtx.drawImage(img, 0, 0, width, height);
    };

    if (canvasElem.current) {
      canvasElem.current.addEventListener("mousedown", handleMouseDown);
      canvasElem.current.addEventListener("mousemove", handleMouseMove);
      canvasElem.current.addEventListener("mouseup", handleMouseUp);
    }
  }, []);

  const getDataURL = () => {
    hiddenCtx.drawImage(canvasElem.current, 0, 0);
    const result = hiddenElem.current.toDataURL();
    return result;
  };
  const handleClick = () => {
    deg += 30;
    canvasElem.current.style.transform = `rotate(${deg}deg)`;
    hiddenElem.current.style.transform = `rotate(${deg}deg)`;
  };

  const handleSave = () => {
    const dataUrl = getDataURL();
    // base64格式的url
    console.log(dataUrl, "dataUrl");
  };
  return (
    <div
      style={{
        width: "100%",
        height: "500px",
        position: "relative",
        margin: "auto",
      }}
    >
      <canvas
        width={width}
        height={height}
        className="draw"
        ref={canvasElem}
        style={{
          border: "1px solid yellowGreen",
          position: "absolute",
          top: 0,
          left: 0,
        }}
      />
      <canvas
        width={width}
        height={height}
        ref={hiddenElem}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          zIndex: -1,
        }}
      />
      <div>
        <button onClick={handleClick}>旋转</button>
        <button onClick={handleSave}>旋转</button>
      </div>
    </div>
  );
};
export default forwardRef(Draw);
