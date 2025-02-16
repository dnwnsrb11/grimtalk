import { ResponsiveRadar } from '@nivo/radar';

export const AiCompareComponent = ({ data }) => {
  return (
    <div className="border">
      <div style={{ width: '100%', height: '500px' }}>
        <ResponsiveRadar
          data={data}
          keys={['myDrawing']} // 여기를 수정
          indexBy="taste"
          valueFormat=">-.2f"
          margin={{ top: 80, right: 80, bottom: 80, left: 80 }}
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
  );
};
