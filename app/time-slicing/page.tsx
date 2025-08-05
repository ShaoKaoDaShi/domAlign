import { useState, useEffect, useRef } from 'react';

interface TimeSlicingListProps {
  data: any[];
  batchSize: number;
  onComplete?: () => void;
}

const TimeSlicingList: React.FC<TimeSlicingListProps> = ({
  data,
  onComplete,
  batchSize = 100,
}) => {
  const [renderedData, setRenderedData] = useState<any[]>([]);
  const currentIndex = useRef(0);
  const requestId = useRef<number | null>(null);
  const renderBatch = async () => {
      const processBatch = async (deadline: IdleDeadline) => {
        // 当还有数据且浏览器有剩余时间时处理
        while (
          currentIndex.current < data.length &&
          deadline.timeRemaining() > 40
        ) {
          const end = currentIndex.current + batchSize;
          // console.log('prev', currentIndex.current, end);
          await new Promise((resolve) => {
            setTimeout(() => {
              setRenderedData(data.slice(0, end));
              resolve(null);
            });
          });
          // console.log(
          //   'deadline.timeRemaining()',
          //   deadline.timeRemaining(),
          //   currentIndex.current,
          //   end,
          // );

          currentIndex.current = end;
          if(currentIndex.current >= data.length) {
            onComplete?.();
            setTimeout(()=>{
              
            })
          }
          
        }

        // 如果还有未处理数据，继续请求空闲回调
        if (currentIndex.current < data.length) {
          requestId.current = requestIdleCallback(processBatch);
        }
      };

      // 初始化时启动处理
      if (data.length > 0) {
        requestId.current = requestIdleCallback(processBatch);
      }

      // 清理未完成的回调
      return () => {
        if (requestId.current) {
          cancelIdleCallback(requestId.current);
        }
      };
  };

  useEffect(() => {
    renderBatch();
  }, [data, batchSize]);

  return (
    <div>
      {renderedData.map((item, index) => (
        <div key={index}>{item}</div>
      ))}
    </div>
  );
};

export default TimeSlicingList;

// 使用示例：
// <TimeSlicingList data={largeDataArray} batchSize={100} />
