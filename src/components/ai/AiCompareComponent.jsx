import { ResponsiveRadar } from '@nivo/radar';

export const AiCompareComponent = ({ data, analysisResult }) => {
  const sumData = () => {
    try {
      if (data?.length >= 3) {
        const sumScore = data[0].myDrawing + data[1].myDrawing + data[2].myDrawing;
        return sumScore / 3;
      }
      return 0; // 데이터가 부족한 경우
    } catch (error) {
      console.error('데이터 합산 중 오류 발생:', error);
      return 0;
    }
  };
  return (
    <div className="mt-[20px] flex h-full w-full gap-6">
      <div className="w-[50%] rounded-2xl border">
        <div style={{ width: '100%', height: '500px' }}>
          <ResponsiveRadar
            data={data}
            keys={['myDrawing']} // 여기를 수정
            indexBy="taste"
            valueFormat=">-.2f"
            margin={{ top: 60, right: 40, bottom: 40, left: 40 }}
            borderColor="#FF5C38"
            gridLabelOffset={36}
            dotSize={15}
            dotColor={{ theme: 'background' }}
            dotBorderWidth={2}
            colors="#ff0000"
            blendMode="multiply"
            motionConfig="wobbly"
          />
        </div>
      </div>
      <div className="flex w-[50%] flex-col justify-end rounded-2xl">
        <div className="max-w-[150px] rounded-full border px-[15px] py-[5px] text-center">
          <p className="text-text-gray-color m-0 text-[18px] font-light">평균 유사도</p>
        </div>
        <p className="m-0 text-[74px] font-bold text-[#FF5C38]">{sumData().toFixed(0)}%</p>
        <p className="break-keep">{analysisResult.overall_feedback}</p>
      </div>
    </div>
  );
};
