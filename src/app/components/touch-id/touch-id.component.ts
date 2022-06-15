import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-touch-id',
  templateUrl: './touch-id.component.html',
  styleUrls: ['./touch-id.component.scss'],
})
export class TouchIDComponent implements OnInit {
  @ViewChild('dragable', { read: ElementRef }) draggable: ElementRef;
  @ViewChild('extend', { read: ElementRef }) extend: ElementRef;

  @Input() Side: string = 'Right';
  @Input() Percent: number = 50;

  element: any;
  extendElement: any;
  isMoving = false;
  SideCurr: string;
  PercentCurr: number;
  constructor() {}

  ngAfterViewInit() {
    this.element = this.draggable.nativeElement;
    this.extendElement = this.extend.nativeElement;
    this.SideCurr = this.Side;
    this.PercentCurr = this.Percent;

    // Sự kiện di chuột khắp màn hình
    document.addEventListener('mousemove', (e) => {
      if (this.isMoving) {
        this.clearSelection();
        var outWindow = this.edgeWindow(e);
        if (!outWindow.X) {
          this.element.style.left = e.clientX - this.startX + 'px';
          this.element.style.right = 'unset';
        }
        if (!outWindow.Y) {
          this.element.style.top = e.clientY - this.startY + 'px';
          this.element.style.bottom = 'unset';
        }
      }
    });

    // Sự kiện thay đổi độ rộng màn hình
    window.addEventListener('resize', () => {
      if (this.element) {
        this.setPosition();
      }
    });

    // Sự kiện nhấc chuột lên
    document.addEventListener('mouseup', (e) => {
      if (this.isMoving) {
        this.onStopMove();
      }
    });

    // Đặt vị trí khởi tạo
    this.setPosition();
  }

  ngOnInit() {}

  isPin = false;
  startX = 0;
  startY = 0;
  offsetVertical = 50;
  modeCollapse: string;
  collapseTimeout: any;
  modeFunction: string;
  functionTimeout: any;

  /**
   * Đặt vị trí
   * createdby ntdung5 13.06.2022
   */
  setPosition() {
    this.removePosition(this.element);
    this.removePosition(this.extendElement);

    switch (this.SideCurr) {
      case 'Top':
        this.element.style.top = 0;
        this.extendElement.style.top = 0;

        break;
      case 'Bottom':
        this.element.style.bottom = 0;
        this.extendElement.style.bottom = 0;
        break;
      case 'Right':
        this.element.style.right = 0;
        this.extendElement.style.right = 0;

        break;
      case 'Left':
        this.element.style.left = 0;
        this.extendElement.style.left = 0;
        break;
      default:
        break;
    }
    var rectElement = this.element.getBoundingClientRect();

    if (this.SideCurr == 'Top' || this.SideCurr == 'Bottom') {
      var left = (window.innerWidth * this.PercentCurr) / 100;
      if (left + rectElement.width >= window.innerWidth) {
        this.element.style.right = 0;
        this.extendElement.style.right = 0;
      } else {
        this.element.style.left = left + 'px';
        this.extendElement.style.left = left + 'px';
      }
    } else {
      this.element.style.top =
        (window.innerHeight * this.PercentCurr) / 100 + 'px';
      this.extendElement.style.top =
        (window.innerHeight * this.PercentCurr) / 100 + 'px';
    }
    this.isMoving = false;
  }

  get GetSide() {
    if (this.SideCurr) {
      return this.SideCurr.toLowerCase();
    } else {
      return 'right';
    }
  }

  /**
   * Sự kiện ấn chuột xuống
   * createdby ntdung5 13.06.2022
   */
  mousedown(e) {
    this.isMoving = true;
    this.startX = e.clientX - parseInt(getComputedStyle(this.element).left);
    this.startY = e.clientY - parseInt(getComputedStyle(this.element).top);
  }

  /**
   * Xử lý sự kiện bấm nút phân biệt với sự kiện kéo thả
   * created by ntdung5 13.06.2022
   */

  mousedownCollapse() {
    this.modeCollapse = 'click';
    clearTimeout(this.collapseTimeout);
    this.collapseTimeout = setTimeout(() => {
      this.modeCollapse = 'move';
    }, 100);
  }

  mouseupCollapse() {
    if (this.modeCollapse == 'click') {
      this.isPin = false;
    }
  }
  mousedownFunction() {
    this.modeFunction = 'click';
    clearTimeout(this.functionTimeout);
    this.functionTimeout = setTimeout(() => {
      this.modeFunction = 'move';
    }, 200);
  }

  mouseupFunction() {
    console.log(this.modeFunction);
    if (this.modeFunction == 'click') {
      this.isPin = true;
    }
  }

  /**
   * Dừng di chuyển
   * createdby ntdung5 13.06.2022
   */
  onStopMove() {
    var rectElement = this.element.getBoundingClientRect();
    var PercentTop = Number.parseFloat(
      rectElement.top / window.innerHeight + ''
    ).toFixed(5);
    var PercentLeft = Number.parseFloat(
      rectElement.left / window.innerWidth + ''
    ).toFixed(5);

    if (rectElement.top <= this.offsetVertical) {
      this.SideCurr = 'Top';
      this.PercentCurr = Number(PercentLeft) * 100;
    } else if (window.innerHeight - rectElement.bottom <= this.offsetVertical) {
      this.SideCurr = 'Bottom';
      this.PercentCurr = Number(PercentLeft) * 100;
    } else {
      if (Number(PercentLeft) < 0.5) {
        this.SideCurr = 'Left';
        this.PercentCurr = Number(PercentTop) * 100;
      } else {
        this.SideCurr = 'Right';
        this.PercentCurr = Number(PercentTop) * 100;
      }
    }

    // Đặt lại vị trí
    this.setPosition();
    setTimeout(() => {
      this.setPosition();
    }, 100);
  }
  /**
   * Con trỏ chuột nằm ngoài màn hình window
   * createdby ntdung5 13.06.2022
   */
  edgeWindow(e) {
    var result = { X: true, Y: true };
    if (this.element) {
      var rectElement = this.element.getBoundingClientRect();
      var positionX = e.clientX - this.startX;
      var positionY = e.clientY - this.startY;
      if (
        positionX >= 0 &&
        positionX + rectElement.width <= window.innerWidth
      ) {
        result.X = false;
      }
      if (
        positionY >= 0 &&
        positionY + rectElement.height <= window.innerHeight
      ) {
        result.Y = false;
      }
      return result;
    }
  }

  /**
   * Xóa vùng đang chọn
   * createdby ntdung5 13.06.2022
   */
  clearSelection() {
    if (window.getSelection()) {
      if (window.getSelection().empty) {
        window.getSelection().empty();
      } else if (window.getSelection().removeAllRanges) {
        window.getSelection().removeAllRanges();
      }
    }
    // else if (document.selection) {
    //   document.selection.empty();
    // }
  }

  /**
   * Loại bỏ vị trí của element
   * createdby ntdung5 13.06.2022
   */
  removePosition(element) {
    element.style.inset = 'unset';
  }
}
