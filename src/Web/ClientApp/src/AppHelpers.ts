export class AppHelpers {

  public static closestEdge(mouse, elem): 'left' | 'right' | 'top' | 'bottom' {

    const elemBounding = elem.getBoundingClientRect();

    const elementLeftEdge = elemBounding.left;
    const elementTopEdge = elemBounding.top;
    const elementRightEdge = elemBounding.right;
    const elementBottomEdge = elemBounding.bottom;

    const mouseX = mouse.pageX;
    const mouseY = mouse.pageY;

    const topEdgeDist = Math.abs(elementTopEdge - mouseY);
    const bottomEdgeDist = Math.abs(elementBottomEdge - mouseY);
    const leftEdgeDist = Math.abs(elementLeftEdge - mouseX);
    const rightEdgeDist = Math.abs(elementRightEdge - mouseX);

    const min = Math.min(topEdgeDist, bottomEdgeDist, leftEdgeDist, rightEdgeDist);

    switch (min) {
      case leftEdgeDist:
        return 'left';
      case rightEdgeDist:
        return 'right';
      case topEdgeDist:
        return 'top';
      case bottomEdgeDist:
        return 'bottom';
    }
  }

}
