'use client';

import React, { useEffect, useState } from 'react';
import domAlign from '../../src';
import getRegion from '../../src/getRegion';
import { setTransform } from '../../src/utils';
import { compute } from 'compute-scroll-into-view';
import scrollIntoView from 'scroll-into-view-if-needed';

// const node = document.getElementById('hero');

// same behavior as Element.scrollIntoView({block: "nearest", inline: "nearest"})
// see: https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView

// same behavior as Element.scrollIntoViewIfNeeded(true)
// see: https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoViewIfNeeded

function $id(id): any {
  return document.querySelector('#' + id);
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
const arr2 = [1, 4, 5, 2, 9, 10, 11, 888, 889, 890, 991, 992, 993];
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
  function alignAndResolveOverlaps() {
    let prevRect: DOMRect | null = null;

    // 1. 收集元素及其目标的 top 坐标
    const itemsWithTop = arr2
      .map((item) => {
        const target = $id('target' + item);
        return {
          item,
          top: target ? target.getBoundingClientRect().top : Infinity,
        };
      })
      .filter(({ top }) => top !== Infinity);

    // 2. 按 top 坐标排序
    itemsWithTop.sort((a, b) => a.top - b.top);

    // 3. 按排序后的顺序依次对齐和避重叠
    itemsWithTop.forEach(({ item }, idx) => {
      const source = $id('source' + item);
      const target = $id('target' + item);
      if (!source || !target) return;

      // 先对齐
      domAlign(source, target, {
        points: ['tl', 'tl'],
        offset: [0, 0], // 先不带偏移
        useCssTransform: true,
      });

      const currRect = source.getBoundingClientRect();

      let offset = 0;
      if (prevRect && currRect.top < prevRect.bottom) {
        // 只在重叠时，基于上一个元素的 bottom 重新计算偏移
        offset = prevRect.bottom - currRect.top + 10;
        domAlign(source, target, {
          points: ['tl', 'tl'],
          offset: [0, offset],
          useCssTransform: true,
        });
        prevRect = source.getBoundingClientRect();
      } else {
        prevRect = currRect;
      }
    });
  }
  useEffect(() => {
    renderInBatches();
  }, []);

  useEffect(() => {
    // 等待 DOM 更新后再对齐
    if (visibleItems.length < arr.length) return;
    requestAnimationFrame(() => {
      setTimeout(() => {
        alignAndResolveOverlaps();
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
          {arr2.map((item, index) => {
            // if (index > 2) return;
            return (
              <div
                key={index}
                id={'source' + item}
                style={{
                  border: '1px solid green',
                  width: '300px',
                  height: sourceItemHeight + 'px',
                  margin: '10px',
                }}>
                source {item}
                <button
                  onClick={() => {
                    const downTarget = $id('target' + arr2[index + 1]);

                    console.log(
                      '🚀 ~ arr2[index + 1]:',
                      arr2[index + 1],
                      downTarget,
                      'target' + arr2[index + 1],
                    );
                    // downTarget.scrollIntoView({
                    //   behavior: 'smooth',
                    //   block: 'center',
                    //   inline: 'nearest',
                    // });
                    // downTarget.scrollIntoView({
                    //   behavior: 'smooth',
                    //   block: 'center',
                    // });
                    // const actions = compute(downTarget, {
                    //   scrollMode: 'if-needed',
                    //   block: 'center',
                    //   inline: 'center',
                    // });

                    // Then perform the scrolling, use scroll-into-view-if-needed if you don't want to implement this part
                    // actions.forEach(({ el, top, left }) => {
                    //   el.scrollTop = top;
                    //   el.scrollLeft = left;
                    // });
                    scrollIntoView(downTarget, {
                      behavior: 'smooth',
                      scrollMode: 'if-needed',
                      block: 'center',
                    });
                  }}>
                  down
                </button>
                <button
                  onClick={() => {
                    const upTarget = $id('target' + arr2[index - 1]);
                    console.log('🚀 ~ arr2[index - 1]:', arr2[index - 1]);
                    upTarget.scrollIntoView({
                      behavior: 'smooth',
                      block: 'center',
                    });
                  }}>
                  up
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
