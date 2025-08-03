'use client';

import React, { useEffect, useState } from 'react';
import domAlign from '../../src';
import getRegion from '../../src/getRegion';
import { setTransform } from '../../src/utils';

function $id(id): any {
  return document.getElementById(id);
}

function $val(sel) {
  sel = $id(sel);
  return sel.value;
}
const getregion = () => {
  const elRegion = getRegion($id('source'));
  const target = getRegion($id('target'));
  console.log('elRegion', elRegion, target);
};

const arr = Array(1000)
  .fill(0)
  .map((_, i) => i);
// 在文件顶部添加重叠检测函数
function isElementsOverlapping(
  element1: HTMLElement,
  element2: HTMLElement,
): boolean {
  const rect1 = element1.getBoundingClientRect();
  const rect2 = element2.getBoundingClientRect();

  return !(
    (
      rect1.right <= rect2.left || // element1 在 element2 左边
      rect1.left >= rect2.right || // element1 在 element2 右边
      rect1.bottom <= rect2.top || // element1 在 element2 上面
      rect1.top >= rect2.bottom
    ) // element1 在 element2 下面
  );
}

// 获取重叠区域信息
function getOverlapInfo(element1: HTMLElement, element2: HTMLElement) {
  const rect1 = element1.getBoundingClientRect();
  const rect2 = element2.getBoundingClientRect();

  const overlapLeft = Math.max(rect1.left, rect2.left);
  const overlapRight = Math.min(rect1.right, rect2.right);
  const overlapTop = Math.max(rect1.top, rect2.top);
  const overlapBottom = Math.min(rect1.bottom, rect2.bottom);
  console.log('overlap', overlapTop, overlapBottom, overlapLeft, overlapRight);
  const overlapWidth = Math.max(0, overlapRight - overlapLeft);
  const overlapHeight = Math.max(0, overlapBottom - overlapTop);

  return {
    isOverlapping: overlapWidth > 0 && overlapHeight > 0,
    overlapWidth,
    overlapHeight,
    overlapArea: overlapWidth * overlapHeight,
  };
}

function resolveOverlaps() {
  let cumulativeOffset = 0;

  for (let i = 0; i < arr.length; i++) {
    const currentElement = $id('source' + arr[i]);
    const currentTargetElement = $id('target' + arr[i]);

    // 应用当前累积偏移
    domAlign(currentElement, currentTargetElement, {
      points: ['tl', 'tl'],
      offset: [0, cumulativeOffset],
      useCssTransform: true,
    });

    // 检查与前一个元素是否重叠（如果存在前一个元素）
    if (i > 0) {
      const previousElement = $id('source' + arr[i - 1]);

      if (isElementsOverlapping(currentElement, previousElement)) {
        // 计算避免重叠需要的额外偏移
        const previousRect = previousElement.getBoundingClientRect();
        const currentRect = currentElement.getBoundingClientRect();

        const additionalOffset = previousRect.bottom - currentRect.top + 10;
        cumulativeOffset += additionalOffset;

        // 重新应用调整后的偏移
        domAlign(currentElement, currentTargetElement, {
          points: ['tl', 'tl'],
          offset: [0, cumulativeOffset],
          useCssTransform: true,
        });
      }
    }
  }
}

function align() {
  arr.forEach((item) => {
    if ($id('source' + item) === null || $id('target' + item) === null) {
      console.warn('Element not found for item:', item);
      return;
    }
    domAlign($id('source' + item), $id('target' + item), {
      points: ['tl', 'tl'],
      // offset: [$val('offset1'), $val('offset2')],
      // targetOffset: [$val('targetOffset1'), $val('targetOffset2')],
      // overflow: {
      //   adjustX: $id('adjustX').checked,
      //   adjustY: $id('adjustY').checked,
      // },
      // useCssRight: $id('useCssRight').checked,
      // useCssBottom: $id('useCssBottom').checked,
      useCssTransform: true,

      // ignoreShake: $id('ignoreShake').checked,
    });
  });
}
export default function Simple() {
  const [sourceItemHeight, setSourceItemHeight] = useState(400);
  const [targetItemHeight, setTargetItemHeight] = useState(200);
  const [visibleItems, setVisibleItems] = useState<number[]>([]);
  const [renderedCount, setRenderedCount] = useState(0);
  const renderedCountRef = React.useRef(0);
  const BATCH_SIZE = 20; // 每批渲染的项目数量

  // 时间分片渲染函数
  const renderInBatches = () => {
    if (renderedCountRef.current >= arr.length) return;
    // align();
    const endIndex = Math.min(
      renderedCountRef.current + BATCH_SIZE,
      arr.length,
    );
    const newItems = arr.slice(renderedCountRef.current, endIndex);

    setVisibleItems((prev) => [...prev, ...newItems]);
    // setRenderedCount(endIndex);
    renderedCountRef.current = endIndex;
    console.log('endIndex', endIndex, arr.length);

    if (endIndex < arr.length) {
      setTimeout(renderInBatches, 10);
    }
  };

  useEffect(() => {
    renderInBatches();
  }, []);

  useEffect(() => {
    // 等待 DOM 更新后再对齐
    if (visibleItems.length < arr.length) return;
    requestAnimationFrame(() => {
      visibleItems.forEach((item) => {
        const source = $id('source' + item);
        const target = $id('target' + item);
        if (source && target) {
          domAlign(source, target, {
            points: ['tl', 'tl'],
            useCssTransform: true,
          });
        }
      });
      setTimeout(() => {
        resolveOverlaps();
      });
    });
  }, [visibleItems]);

  return (
    <div style={{ height: '100vh', overflowY: 'scroll' }}>
      <div>
        <button onClick={align}>dom-align</button>
        <button onClick={resolveOverlaps}>resolveOverlaps</button>
        <div>
          target height:{' '}
          <input
            value={targetItemHeight}
            onChange={(e) => setTargetItemHeight(Number(e.target.value))}
          />
        </div>
        <div>
          source height:{' '}
          <input
            value={sourceItemHeight}
            onChange={(e) => setSourceItemHeight(Number(e.target.value))}
          />
        </div>
      </div>
      <div style={{ display: 'flex' }}>
        <div style={{ flex: 1, border: '1px solid red' }}>
          {visibleItems.map((item, index) => (
            <div
              key={index}
              id={'target' + item}
              onClick={() => {
                $id('source' + item).scrollIntoView({
                  behavior: 'smooth',
                  block: 'center',
                });
              }}
              style={{
                border: '1px solid red',
                height: targetItemHeight + 'px',
                margin: '50px 10px',
              }}>
              target {item}
            </div>
          ))}
        </div>
        <div style={{ width: '500px', border: '1px solid green' }}>
          {arr.map((item, index) => {
            // if (index > 2) return;
            return (
              <div
                onClick={() => {
                  $id('target' + item).scrollIntoView({
                    behavior: 'smooth',
                    block: 'center',
                  });
                }}
                key={index}
                id={'source' + item}
                style={{
                  border: '1px solid green',
                  width: '300px',
                  height: sourceItemHeight + 'px',
                  margin: '10px',
                }}>
                source {item}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
